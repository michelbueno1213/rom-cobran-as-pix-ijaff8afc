/**
 * Store - Camada de persistência em localStorage
 * - rom_users: lista de contas de comerciantes
 * - rom_session: id do usuário autenticado
 * - Isolamento por usuário: rom_wallets_{userId}, rom_charges_{userId}, rom_links_{userId},
 *   rom_withdrawals_{userId}, rom_activities_{userId}, rom_homolog_charges_{userId},
 *   rom_bill_payments_{userId}, rom_coupons_{userId}, rom_swaps_{userId}
 */

import { generateUUID } from './utils.js'

const USERS_KEY = 'rom_users'
const SESSION_KEY = 'rom_session'

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

export const Store = {
  // === AUTENTICAÇÃO E USUÁRIOS ===
  getUsers() {
    return getLocal(USERS_KEY, [])
  },

  getCurrentUser() {
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

  createUser({ nome, email, senha }) {
    const users = this.getUsers()
    const cleanEmail = String(email || '')
      .trim()
      .toLowerCase()

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('E-mail já cadastrado no sistema.')
    }

    const isFirstUser = users.length === 0
    const newUser = {
      id: generateUUID(),
      nome: String(nome || '').trim(),
      email: cleanEmail,
      senha: String(senha || ''),
      isAdmin: isFirstUser, // Primeira conta criada = administrador
      createdAt: new Date().toISOString(),
      settings: {
        telefone: '',
        cnpj: '',
      },
    }

    users.push(newUser)
    setLocal(USERS_KEY, users)
    this.setSession(newUser.id)
    return newUser
  },

  login({ email, senha }) {
    const cleanEmail = String(email || '')
      .trim()
      .toLowerCase()
    const users = this.getUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.senha === String(senha || ''),
    )
    if (!found) {
      throw new Error('E-mail ou senha inválidos.')
    }
    this.setSession(found.id)
    return found
  },

  setSession(userId) {
    setLocal(SESSION_KEY, userId)
  },

  clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (err) {
      console.error(err)
    }
  },

  updateUserSettings(userId, { nome, telefone, cnpj }) {
    const users = this.getUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) throw new Error('Usuário não encontrado.')

    if (nome) users[idx].nome = nome.trim()
    users[idx].settings = {
      ...(users[idx].settings || {}),
      telefone: telefone ? telefone.trim() : '',
      cnpj: cnpj ? cnpj.trim() : '',
    }
    setLocal(USERS_KEY, users)
    return users[idx]
  },

  // === CARTEIRAS LIQUID (Isoladas por userId) ===
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
    return newWallet
  },

  setDefaultWallet(userId, walletId) {
    const list = this.getWallets(userId)
    const updated = list.map((w) => ({
      ...w,
      is_default: w.id === walletId,
    }))
    this.saveWallets(userId, updated)
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
    return newCharge
  },

  updateHomologStatus(userId, chargeId, newStatus) {
    const list = this.getHomologCharges(userId)
    const item = list.find((c) => c.id === chargeId)
    if (!item) throw new Error('Cobrança de teste não encontrada.')
    item.status = newStatus
    item.updatedAt = new Date().toISOString()
    this.saveHomologCharges(userId, list)
    return item
  },

  clearHomologCharges(userId) {
    this.saveHomologCharges(userId, [])
  },

  // === BUSCA GLOBAL DE COBRANÇAS (para a página pública #/pagar/:id) ===
  findChargeById(chargeId) {
    if (!chargeId) return null
    // 1. Procura em todos os namespaces de homologação (rom_homolog_charges_*)
    // 2. Procura em todos os namespaces de cobranças reais (rom_charges_*)
    try {
      const keys = Object.keys(localStorage)

      // Homologação primeiro
      for (const k of keys) {
        if (k.startsWith('rom_homolog_charges_')) {
          const list = getLocal(k, [])
          const found = list.find((c) => c.id === chargeId)
          if (found) {
            // Busca dados do comerciante
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

  // === TROCAS / SWAPS (rom_swaps_{userId}) ===
  getSwaps(userId) {
    if (!userId) return []
    return getLocal(`rom_swaps_${userId}`, [])
  },
}
