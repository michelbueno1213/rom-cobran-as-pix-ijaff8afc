/**
 * Store - Camada unificada de dados (PocketBase / Skip Cloud + fallback localStorage)
 *
 * Funcionalidades:
 * 1. Bloqueio de e-mail duplicado (case-insensitive, e-mail em minúsculas).
 * 2. Normalização de e-mail para minúsculas em todo o fluxo (cadastro, login, busca).
 * 3. Ao sair (logout), limpa APENAS a sessão ativa (token e ID ativo), NUNCA apaga as contas salvas.
 * 4. Isolamento rigoroso de contas (um e-mail = uma conta).
 * 5. Integração com o servidor PocketBase para login centralizado entre múltiplos aparelhos.
 * 6. Fallback local offline resiliente caso o servidor esteja inacessível.
 * 7. Suporte a sincronização de carteiras, cobranças, homologação e configurações com o servidor.
 */

import { generateUUID } from './utils.js'

const USERS_KEY = 'rom_users'
const SESSION_KEY = 'rom_session'
const PB_AUTH_KEY = 'pocketbase_auth'
const PB_FALLBACK_URL = 'https://rom-cobrancas-pix-d324e.shrd00.internal.goskip.dev'

// Utilitários de leitura/escrita segura em localStorage
function getLocal(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch (err) {
    console.error(`Erro ao ler localStorage [${key}]:`, err)
    return defaultValue
  }
}

function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Erro ao salvar localStorage [${key}]:`, err)
  }
}

function getPB() {
  if (typeof window !== 'undefined' && window.pb) {
    return window.pb
  }
  return null
}

function getPbUrl() {
  if (typeof window !== 'undefined' && window.VITE_POCKETBASE_URL) {
    return window.VITE_POCKETBASE_URL
  }
  return PB_FALLBACK_URL
}

export const Store = {
  // === UTILITÁRIOS DE E-MAIL ===
  normalizeEmail(email) {
    return String(email || '')
      .trim()
      .toLowerCase()
  },

  // === AUTENTICAÇÃO E USUÁRIOS ===
  getUsers() {
    return getLocal(USERS_KEY, [])
  },

  saveUsers(users) {
    setLocal(USERS_KEY, users)
  },

  // Busca se um e-mail já existe localmente (case-insensitive)
  findLocalUserByEmail(email) {
    const cleanEmail = this.normalizeEmail(email)
    if (!cleanEmail) return null
    const users = this.getUsers()
    return users.find((u) => this.normalizeEmail(u.email) === cleanEmail) || null
  },

  // Retorna o usuário logado no momento (verificando tanto PocketBase quanto sessão local)
  getCurrentUser() {
    // 1. Tenta recuperar sessão ativa do PocketBase SDK
    const pb = getPB()
    if (pb && pb.authStore && pb.authStore.isValid && pb.authStore.record) {
      const rec = pb.authStore.record
      const localUsers = this.getUsers()
      const existing = localUsers.find(
        (u) => u.id === rec.id || this.normalizeEmail(u.email) === this.normalizeEmail(rec.email),
      )

      const mergedUser = {
        id: rec.id,
        nome: rec.name || existing?.nome || 'Comerciante ROM',
        email: this.normalizeEmail(rec.email),
        isAdmin: Boolean(rec.is_admin || existing?.isAdmin),
        createdAt: rec.created || existing?.createdAt || new Date().toISOString(),
        settings: {
          telefone: rec.telefone || existing?.settings?.telefone || '',
          cnpj: rec.cnpj || existing?.settings?.cnpj || '',
        },
      }

      // Sincroniza espelho local do usuário para funcionamento offline
      this.upsertLocalUser(mergedUser)
      setLocal(SESSION_KEY, mergedUser.id)
      return mergedUser
    }

    // 2. Se o SDK não estiver carregado ou offline, consulta session local
    const userId = getLocal(SESSION_KEY, null)
    if (!userId) return null
    const users = this.getUsers()
    const found = users.find((u) => u.id === userId)
    if (!found) {
      this.clearSession()
      return null
    }
    return found
  },

  // Atualiza ou insere usuário na lista local sem criar duplicados
  upsertLocalUser(userData) {
    const users = this.getUsers()
    const cleanEmail = this.normalizeEmail(userData.email)
    const idx = users.findIndex(
      (u) => u.id === userData.id || this.normalizeEmail(u.email) === cleanEmail,
    )

    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        ...userData,
        email: cleanEmail,
        settings: {
          ...(users[idx].settings || {}),
          ...(userData.settings || {}),
        },
      }
    } else {
      users.push({
        ...userData,
        email: cleanEmail,
      })
    }
    this.saveUsers(users)
  },

  /**
   * Cadastro com bloqueio de duplicidade e sincronização com servidor
   */
  async createUser({ nome, email, senha }) {
    const cleanEmail = this.normalizeEmail(email)
    const cleanNome = String(nome || '').trim()
    const cleanSenha = String(senha || '')

    // 1. Verificação local imediata: se já existe neste dispositivo, BLOQUEIA
    const localExisting = this.findLocalUserByEmail(cleanEmail)
    if (localExisting) {
      const err = new Error('Já existe uma conta com este e-mail. Faça login.')
      err.code = 'EMAIL_DUPLICATE_LOCAL'
      throw err
    }

    // 2. Tentar registrar no PocketBase (servidor)
    const pb = getPB()
    let serverRecord = null
    let isServerAdmin = false

    if (pb) {
      try {
        // Criação de usuário no PocketBase
        serverRecord = await pb.collection('users').create({
          email: cleanEmail,
          password: cleanSenha,
          passwordConfirm: cleanSenha,
          name: cleanNome,
        })

        // Efetua login automático no servidor para obter token e atualizar sessão
        const authData = await pb.collection('users').authWithPassword(cleanEmail, cleanSenha)
        serverRecord = authData.record
        isServerAdmin = Boolean(serverRecord.is_admin)
      } catch (pbErr) {
        // Se o PocketBase acusou que o e-mail já existe
        const pbStatus = pbErr?.status
        const pbData = pbErr?.data?.data || {}
        if (pbStatus === 400 && pbData.email) {
          const err = new Error('Já existe uma conta com este e-mail. Faça login.')
          err.code = 'EMAIL_DUPLICATE_SERVER'
          throw err
        }
        // Se for erro de rede/offline, segue para criação local em fallback
        console.warn('Servidor inacessível durante cadastro, salvando localmente:', pbErr)
      }
    } else {
      // Fallback direto via fetch caso window.pb não esteja inicializado ainda
      try {
        const res = await fetch(`${getPbUrl()}/api/collections/users/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: cleanSenha,
            passwordConfirm: cleanSenha,
            name: cleanNome,
          }),
        })
        if (res.status === 400) {
          const errData = await res.json().catch(() => ({}))
          if (errData?.data?.email) {
            const err = new Error('Já existe uma conta com este e-mail. Faça login.')
            err.code = 'EMAIL_DUPLICATE_SERVER'
            throw err
          }
        }
      } catch (netErr) {
        console.warn('Fetch fallback para servidor falhou:', netErr)
      }
    }

    // 3. Persistência local (mantém consistência mesmo offline)
    const users = this.getUsers()
    const isFirstUser = users.length === 0
    const newUser = {
      id: serverRecord ? serverRecord.id : generateUUID(),
      nome: cleanNome,
      email: cleanEmail,
      senha: cleanSenha, // Salvo localmente para permitir login offline neste aparelho
      isAdmin: serverRecord ? isServerAdmin : isFirstUser,
      createdAt: serverRecord?.created || new Date().toISOString(),
      settings: {
        telefone: '',
        cnpj: '',
      },
    }

    users.push(newUser)
    this.saveUsers(users)
    this.setSession(newUser.id)

    return newUser
  },

  /**
   * Login unificado: tenta servidor PocketBase primeiro; se falhar ou offline, tenta local.
   * Se a conta existir em outro aparelho e não aqui, ou se o e-mail não existir de forma alguma,
   * emite a mensagem explicativa requerida.
   */
  async login({ email, senha }) {
    const cleanEmail = this.normalizeEmail(email)
    const cleanSenha = String(senha || '')

    const localUser = this.findLocalUserByEmail(cleanEmail)
    const pb = getPB()

    // 1. Tentar login no PocketBase (permite acessar conta criada em outro dispositivo)
    if (pb) {
      try {
        const authData = await pb.collection('users').authWithPassword(cleanEmail, cleanSenha)
        const rec = authData.record

        const loggedUser = {
          id: rec.id,
          nome: rec.name || localUser?.nome || 'Comerciante',
          email: cleanEmail,
          senha: cleanSenha,
          isAdmin: Boolean(rec.is_admin || localUser?.isAdmin),
          createdAt: rec.created || localUser?.createdAt || new Date().toISOString(),
          settings: {
            telefone: rec.telefone || localUser?.settings?.telefone || '',
            cnpj: rec.cnpj || localUser?.settings?.cnpj || '',
          },
        }

        // Salva cópia neste aparelho para permitir login offline futuro
        this.upsertLocalUser(loggedUser)
        this.setSession(loggedUser.id)

        // Tenta puxar dados remotos do usuário (carteiras, etc.)
        this.syncFromServer(loggedUser.id).catch((e) => console.warn('Sync inicial pós-login:', e))

        return loggedUser
      } catch (serverErr) {
        const status = serverErr?.status
        // Se o servidor rejeitou especificamente por credenciais inválidas (400)
        // e não temos localUser correspondente
        if (status === 400 && !localUser) {
          throw new Error('E-mail ou senha inválidos.')
        }
        // Se o servidor estiver offline (status 0 ou erro de rede), tenta login local abaixo
        console.warn('Tentativa de login no servidor falhou/offline, tentando local:', serverErr)
      }
    }

    // 2. Fallback de Login Local
    if (localUser) {
      if (localUser.senha && localUser.senha !== cleanSenha) {
        throw new Error('E-mail ou senha inválidos.')
      }
      this.setSession(localUser.id)
      return localUser
    }

    // 3. E-mail não encontrado neste dispositivo nem no servidor
    const err = new Error(
      'As contas ficam salvas neste dispositivo. Se você criou a conta em outro aparelho, use o mesmo e-mail para criar sua conta aqui ou aguarde o login centralizado (em implantação).',
    )
    err.code = 'ACCOUNT_NOT_FOUND_DEVICE'
    throw err
  },

  setSession(userId) {
    setLocal(SESSION_KEY, userId)
  },

  /**
   * Sair da conta: limpa APENAS a sessão ativa.
   * NUNCA limpa as contas nem os dados salvos!
   */
  clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY)
      const pb = getPB()
      if (pb && pb.authStore) {
        pb.authStore.clear()
      }
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err)
    }
  },

  async updateUserSettings(userId, { nome, telefone, cnpj }) {
    const cleanNome = (nome || '').trim()
    const cleanTel = (telefone || '').trim()
    const cleanCnpj = (cnpj || '').trim()

    // 1. Atualiza no servidor se logado no PocketBase
    const pb = getPB()
    if (pb && pb.authStore && pb.authStore.isValid && pb.authStore.record?.id === userId) {
      try {
        await pb.collection('users').update(userId, {
          name: cleanNome,
          telefone: cleanTel,
          cnpj: cleanCnpj,
        })
      } catch (err) {
        console.warn('Erro ao atualizar configurações no servidor:', err)
      }
    }

    // 2. Atualiza localmente
    const users = this.getUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) throw new Error('Usuário não encontrado.')

    if (cleanNome) users[idx].nome = cleanNome
    users[idx].settings = {
      ...(users[idx].settings || {}),
      telefone: cleanTel,
      cnpj: cleanCnpj,
    }
    this.saveUsers(users)
    return users[idx]
  },

  // Sincronização em background do servidor para o dispositivo
  async syncFromServer(userId) {
    const pb = getPB()
    if (!pb || !pb.authStore || !pb.authStore.isValid) return

    try {
      // 1. Carteiras
      const remoteWallets = await pb.collection('rom_wallets').getFullList({
        sort: 'created',
      })
      if (remoteWallets && remoteWallets.length > 0) {
        const localList = remoteWallets.map((w) => ({
          id: w.id,
          apelido: w.apelido,
          address: w.address,
          is_default: Boolean(w.is_default),
          createdAt: w.created,
        }))
        this.saveWallets(userId, localList)
      }

      // 2. Cobranças de Homologação
      const remoteHomolog = await pb.collection('rom_homolog_charges').getFullList({
        sort: '-created',
      })
      if (remoteHomolog && remoteHomolog.length > 0) {
        const localList = remoteHomolog.map((c) => ({
          id: c.id,
          userId: c.user_id,
          valor: c.valor,
          cliente: c.cliente || '',
          descricao: c.descricao || '',
          status: c.status,
          is_simulated: true,
          createdAt: c.created,
          updatedAt: c.updated,
        }))
        this.saveHomologCharges(userId, localList)
      }
    } catch (err) {
      console.warn('Sync em segundo plano não pôde ser completado:', err)
    }
  },

  // === CARTEIRAS LIQUID (Isoladas por userId + Servidor) ===
  getWallets(userId) {
    if (!userId) return []
    return getLocal(`rom_wallets_${userId}`, [])
  },

  saveWallets(userId, wallets) {
    if (!userId) return
    setLocal(`rom_wallets_${userId}`, wallets)
  },

  getDefaultWallet(userId) {
    const list = this.getWallets(userId)
    return list.find((w) => w.is_default) || list[0] || null
  },

  addWallet(userId, { apelido, address }) {
    const list = this.getWallets(userId)
    if (list.length >= 3) {
      throw new Error('Limite de 3 carteiras por conta.')
    }
    const cleanAddr = address.trim()
    const isFirst = list.length === 0
    const newWallet = {
      id: generateUUID(),
      apelido: (apelido || '').trim() || `Carteira #${list.length + 1}`,
      address: cleanAddr,
      is_default: isFirst,
      createdAt: new Date().toISOString(),
    }
    list.push(newWallet)
    this.saveWallets(userId, list)

    // Tentar persistir no PocketBase
    const pb = getPB()
    if (pb && pb.authStore && pb.authStore.isValid && pb.authStore.record?.id === userId) {
      pb.collection('rom_wallets')
        .create({
          user_id: userId,
          apelido: newWallet.apelido,
          address: newWallet.address,
          is_default: newWallet.is_default,
        })
        .then((record) => {
          // Atualiza id local para o do servidor se desejar
          const updated = this.getWallets(userId).map((w) =>
            w.id === newWallet.id ? { ...w, serverId: record.id } : w,
          )
          this.saveWallets(userId, updated)
        })
        .catch((err) => console.warn('Erro ao salvar carteira no PocketBase:', err))
    }

    return newWallet
  },

  setDefaultWallet(userId, walletId) {
    const list = this.getWallets(userId)
    const updated = list.map((w) => ({
      ...w,
      is_default: w.id === walletId,
    }))
    this.saveWallets(userId, updated)

    // Sincroniza no servidor
    const pb = getPB()
    if (pb && pb.authStore && pb.authStore.isValid) {
      pb.collection('rom_wallets')
        .getFullList()
        .then((items) => {
          items.forEach((item) => {
            const isDef =
              item.id === walletId || item.address === updated.find((w) => w.is_default)?.address
            pb.collection('rom_wallets')
              .update(item.id, { is_default: isDef })
              .catch(() => {})
          })
        })
        .catch(() => {})
    }

    return updated
  },

  deleteWallet(userId, walletId) {
    const list = this.getWallets(userId)
    const toDelete = list.find((w) => w.id === walletId)
    const remaining = list.filter((w) => w.id !== walletId)
    if (toDelete?.is_default && remaining.length > 0) {
      remaining[0].is_default = true
    }
    this.saveWallets(userId, remaining)

    // Exclui do servidor
    const pb = getPB()
    if (pb && pb.authStore && pb.authStore.isValid && toDelete) {
      pb.collection('rom_wallets')
        .getFullList({ filter: `address="${toDelete.address}"` })
        .then((items) => {
          if (items.length > 0) {
            pb.collection('rom_wallets')
              .delete(items[0].id)
              .catch(() => {})
          }
        })
        .catch(() => {})
    }

    return remaining
  },

  // === COBRANÇAS REAIS (Produção - bloqueadas, vazias por padrão) ===
  getCharges(userId) {
    if (!userId) return []
    return getLocal(`rom_charges_${userId}`, [])
  },

  // === COBRANÇAS DE HOMOLOGAÇÃO (is_simulated = true, namespace separado) ===
  getHomologCharges(userId) {
    if (!userId) return []
    return getLocal(`rom_homolog_charges_${userId}`, [])
  },

  saveHomologCharges(userId, list) {
    if (!userId) return
    setLocal(`rom_homolog_charges_${userId}`, list)
  },

  addHomologCharge(userId, { valor, cliente, descricao }) {
    const list = this.getHomologCharges(userId)
    const newCharge = {
      id: generateUUID(),
      userId,
      valor: Number(valor) || 0,
      cliente: (cliente || '').trim(),
      descricao: (descricao || '').trim(),
      status: 'Aguardando Pagamento',
      is_simulated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    list.unshift(newCharge)
    this.saveHomologCharges(userId, list)

    // Salva no PocketBase se conectado
    const pb = getPB()
    if (pb && pb.authStore && pb.authStore.isValid && pb.authStore.record?.id === userId) {
      pb.collection('rom_homolog_charges')
        .create({
          user_id: userId,
          valor: newCharge.valor,
          cliente: newCharge.cliente,
          descricao: newCharge.descricao,
          status: newCharge.status,
          is_simulated: true,
        })
        .catch((err) => console.warn('Erro ao salvar cobrança homolog no PocketBase:', err))
    }

    return newCharge
  },

  updateHomologStatus(userId, chargeId, newStatus) {
    const list = this.getHomologCharges(userId)
    const item = list.find((c) => c.id === chargeId)
    if (!item) throw new Error('Cobrança de teste não encontrada.')
    item.status = newStatus
    item.updatedAt = new Date().toISOString()
    this.saveHomologCharges(userId, list)

    // Atualiza no servidor se possível
    const pb = getPB()
    if (pb && pb.authStore && pb.authStore.isValid) {
      pb.collection('rom_homolog_charges')
        .getFullList({ filter: `created~"${item.createdAt.slice(0, 16)}"` })
        .then((records) => {
          if (records.length > 0) {
            pb.collection('rom_homolog_charges')
              .update(records[0].id, { status: newStatus })
              .catch(() => {})
          }
        })
        .catch(() => {})
    }

    return item
  },

  clearHomologCharges(userId) {
    this.saveHomologCharges(userId, [])
  },

  // === BUSCA GLOBAL DE COBRANÇAS (para a página pública #/pagar/:id) ===
  findChargeById(chargeId) {
    if (!chargeId) return null
    try {
      const keys = Object.keys(localStorage)

      // Homologação primeiro
      for (const k of keys) {
        if (k.startsWith('rom_homolog_charges_')) {
          const list = getLocal(k, [])
          const found = list.find((c) => c.id === chargeId)
          if (found) {
            const users = this.getUsers()
            const owner = users.find((u) => u.id === found.userId)
            return {
              charge: found,
              ownerName: owner ? owner.nome : 'Comerciante ROM',
              isHomolog: true,
            }
          }
        }
      }

      // Produção
      for (const k of keys) {
        if (k.startsWith('rom_charges_')) {
          const list = getLocal(k, [])
          const found = list.find((c) => c.id === chargeId)
          if (found) {
            const users = this.getUsers()
            const owner = users.find((u) => u.id === found.userId)
            return {
              charge: found,
              ownerName: owner ? owner.nome : 'Comerciante ROM',
              isHomolog: false,
            }
          }
        }
      }
    } catch (err) {
      console.error('Erro ao buscar cobrança:', err)
    }
    return null
  },

  // === SAQUES (Isolados por userId) ===
  getWithdrawals(userId) {
    if (!userId) return []
    return getLocal(`rom_withdrawals_${userId}`, [])
  },

  // === LINKS E QR FIXO ===
  getLinks(userId) {
    if (!userId) return []
    return getLocal(`rom_links_${userId}`, [])
  },

  // === MOVIMENTAÇÕES (rom_activities_{userId}) ===
  getActivities(userId) {
    if (!userId) return []
    return getLocal(`rom_activities_${userId}`, [])
  },

  // === PAGAMENTOS DE CONTAS E BOLETOS (rom_bill_payments_{userId}) ===
  getBillPayments(userId) {
    if (!userId) return []
    return getLocal(`rom_bill_payments_${userId}`, [])
  },

  // === CUPONS (rom_coupons_{userId}) ===
  getCoupons(userId) {
    if (!userId) return []
    return getLocal(`rom_coupons_${userId}`, [])
  },
}
