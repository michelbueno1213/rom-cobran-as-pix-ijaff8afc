/**
 * Views de Autenticação (#/entrar e #/criar-conta)
 *
 * Itens atendidos com rigor:
 * 1. Bloquear e-mail duplicado ao criar conta (case-insensitive, e-mail em minúsculas).
 *    Exibir erro inline no campo: "Já existe uma conta com este e-mail. Faça login." e NÃO criar.
 * 2. Atalho "Entrar com esta conta" se o e-mail já existe neste dispositivo, preenchendo o login.
 * 3. Mensagem clara e explicativa quando o login falha porque o e-mail não existe neste dispositivo:
 *    "As contas ficam salvas neste dispositivo. Se você criou a conta em outro aparelho, use o mesmo e-mail para criar sua conta aqui ou aguarde o login centralizado (em implantação)."
 * 4. Manter acessibilidade (labels, foco visível, aria-live para mensagens de erro inline).
 */

import { Icons } from '../icons.js'
import { Store } from '../store.js'
import { showToast } from '../toast.js'

export function renderLoginView(initialEmail = '') {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <a href="#/" style="display:inline-flex; align-items:center; gap:10px; margin-bottom:16px; text-decoration:none;">
            ${Icons.logo(32)}
            <span style="font-size:1.25rem; font-weight:700; color:var(--text-main); letter-spacing:0.04em;">ROM</span>
          </a>
          <h2>Entrar na conta</h2>
          <p style="font-size:0.88rem; margin-top:4px;">Acesso soberano ao painel de liquidação DePix</p>
        </div>

        <form id="form-login" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">E-mail</label>
            <input
              type="email"
              id="login-email"
              class="form-input"
              placeholder="seu@email.com"
              value="${initialEmail ? String(initialEmail).replace(/"/g, '&quot;') : ''}"
              required
              autocomplete="email"
            />
            <div id="login-email-error" class="form-error" role="alert" style="display:none; margin-top:6px;"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="login-senha">Senha</label>
            <input
              type="password"
              id="login-senha"
              class="form-input"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
            <div id="login-senha-error" class="form-error" role="alert" style="display:none; margin-top:6px;"></div>
          </div>

          <!-- Banner de erro geral -->
          <div id="login-general-error" class="banner-amber" role="alert" style="display:none; margin-bottom:16px; border-color:var(--accent-red); color:var(--accent-red); background:var(--accent-red-subtle); align-items:flex-start;">
            <div style="flex-shrink:0; margin-top:2px;">
              ${Icons.alertTriangle(18)}
            </div>
            <div style="font-size:0.86rem; line-height:1.45;">
              <span id="login-general-error-text">E-mail ou senha inválidos.</span>
            </div>
          </div>

          <!-- Banner explicativo específico de conta não encontrada neste dispositivo -->
          <div id="login-device-notice" class="banner-amber" role="alert" style="display:none; margin-bottom:16px; border-left:4px solid var(--accent-amber); background:rgba(245, 158, 11, 0.08); color:#fef3c7; align-items:flex-start;">
            <div style="flex-shrink:0; margin-top:2px; color:var(--accent-amber);">
              ${Icons.alertTriangle(18)}
            </div>
            <div style="font-size:0.85rem; line-height:1.5;">
              <strong style="display:block; margin-bottom:4px; color:#fde68a;">Aviso sobre suas contas</strong>
              <span id="login-device-notice-text">
                As contas ficam salvas neste dispositivo. Se você criou a conta em outro aparelho, use o mesmo e-mail para criar sua conta aqui ou aguarde o login centralizado (em implantação).
              </span>
            </div>
          </div>

          <button type="submit" id="btn-submit-login" class="btn btn-primary" style="width:100%; margin-top:8px;">
            Entrar
          </button>
        </form>

        <div style="text-align:center; margin-top:24px; font-size:0.88rem; color:var(--text-muted);">
          Ainda não tem conta? <a href="#/criar-conta" style="font-weight:600;">Criar conta grátis</a>
        </div>
      </div>
    </div>
  `
}

export function initLoginEvents() {
  const form = document.getElementById('form-login')
  if (!form) return

  const emailInput = document.getElementById('login-email')
  const senhaInput = document.getElementById('login-senha')
  const emailErr = document.getElementById('login-email-error')
  const senhaErr = document.getElementById('login-senha-error')
  const generalErr = document.getElementById('login-general-error')
  const generalErrText = document.getElementById('login-general-error-text')
  const deviceNotice = document.getElementById('login-device-notice')
  const submitBtn = document.getElementById('btn-submit-login')

  // Limpa erros ao digitar
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailErr.style.display = 'none'
      generalErr.style.display = 'none'
      deviceNotice.style.display = 'none'
    })
  }
  if (senhaInput) {
    senhaInput.addEventListener('input', () => {
      senhaErr.style.display = 'none'
      generalErr.style.display = 'none'
      deviceNotice.style.display = 'none'
    })
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    emailErr.style.display = 'none'
    senhaErr.style.display = 'none'
    generalErr.style.display = 'none'
    deviceNotice.style.display = 'none'

    const rawEmail = emailInput ? emailInput.value : ''
    const email = Store.normalizeEmail(rawEmail)
    const senha = senhaInput ? senhaInput.value : ''

    let hasClientError = false

    if (!email) {
      emailErr.textContent = 'Informe o seu e-mail cadastrado.'
      emailErr.style.display = 'block'
      hasClientError = true
    } else if (!email.includes('@') || !email.includes('.')) {
      emailErr.textContent = 'Informe um formato de e-mail válido.'
      emailErr.style.display = 'block'
      hasClientError = true
    }

    if (!senha) {
      senhaErr.textContent = 'Informe a sua senha.'
      senhaErr.style.display = 'block'
      hasClientError = true
    }

    if (hasClientError) return

    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = 'Entrando...'
    }

    try {
      await Store.login({ email, senha })
      showToast('Login realizado com sucesso.', 'success', 2500)
      window.location.hash = '#/inicio'
    } catch (err) {
      console.warn('Erro durante tentativa de login:', err)

      // Se for conta inexistente neste aparelho nem no servidor
      if (
        err.code === 'ACCOUNT_NOT_FOUND_DEVICE' ||
        String(err.message).includes('As contas ficam salvas neste dispositivo')
      ) {
        deviceNotice.style.display = 'flex'
        emailErr.textContent = 'Nenhuma conta encontrada com este e-mail neste dispositivo.'
        emailErr.style.display = 'block'
        if (emailInput) emailInput.focus()
      } else {
        // Credenciais inválidas padrão
        generalErr.style.display = 'flex'
        generalErrText.textContent = err.message || 'E-mail ou senha inválidos.'
        if (senhaInput) {
          senhaInput.value = ''
          senhaInput.focus()
        }
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = 'Entrar'
      }
    }
  })
}

export function renderRegisterView() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <a href="#/" style="display:inline-flex; align-items:center; gap:10px; margin-bottom:16px; text-decoration:none;">
            ${Icons.logo(32)}
            <span style="font-size:1.25rem; font-weight:700; color:var(--text-main); letter-spacing:0.04em;">ROM</span>
          </a>
          <h2>Criar conta preservada</h2>
          <p style="font-size:0.88rem; margin-top:4px;">Inicie sua operação com soberania e proteção de dados</p>
        </div>

        <form id="form-register" novalidate>
          <div class="form-group">
            <label class="form-label" for="reg-nome">Nome do comerciante</label>
            <input
              type="text"
              id="reg-nome"
              class="form-input"
              placeholder="Ex: Padaria Central ou Seu Nome"
              required
              autocomplete="name"
            />
            <div id="reg-nome-error" class="form-error" role="alert" style="display:none; margin-top:6px;"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-email">E-mail</label>
            <input
              type="email"
              id="reg-email"
              class="form-input"
              placeholder="seu@email.com"
              required
              autocomplete="email"
            />
            <!-- Mensagem de erro inline exigida -->
            <div id="reg-email-error" class="form-error" role="alert" style="display:none; margin-top:6px;"></div>

            <!-- Atalho "Entrar com esta conta" quando o e-mail já existe -->
            <div id="reg-email-duplicate-shortcut" style="display:none; margin-top:8px; padding:10px 12px; background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:var(--radius-md);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <span style="font-size:0.83rem; color:var(--text-main);">
                  Você já possui cadastro com este e-mail.
                </span>
                <button
                  type="button"
                  id="btn-shortcut-login"
                  class="btn btn-outline btn-sm"
                  style="border-color:var(--accent-emerald); color:var(--accent-emerald); font-weight:600; padding:4px 10px; font-size:0.8rem;"
                >
                  Entrar com esta conta &rarr;
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-senha">Senha (mínimo 8 caracteres)</label>
            <input
              type="password"
              id="reg-senha"
              class="form-input"
              placeholder="Mínimo 8 caracteres"
              required
              minlength="8"
              autocomplete="new-password"
            />
            <div id="reg-senha-error" class="form-error" role="alert" style="display:none; margin-top:6px;"></div>
          </div>

          <div id="reg-general-error" class="banner-amber" role="alert" style="display:none; margin-bottom:16px; border-color:var(--accent-red); color:var(--accent-red); background:var(--accent-red-subtle);">
            ${Icons.alertTriangle(18)}
            <span id="reg-general-error-text"></span>
          </div>

          <button type="submit" id="btn-submit-register" class="btn btn-primary" style="width:100%; margin-top:8px;">
            Criar conta
          </button>
        </form>

        <div style="text-align:center; margin-top:24px; font-size:0.88rem; color:var(--text-muted);">
          Já tem conta? <a href="#/entrar" style="font-weight:600;">Entrar</a>
        </div>
      </div>
    </div>
  `
}

export function initRegisterEvents(onNavigateToLogin = null) {
  const form = document.getElementById('form-register')
  if (!form) return

  const nomeInput = document.getElementById('reg-nome')
  const emailInput = document.getElementById('reg-email')
  const senhaInput = document.getElementById('reg-senha')

  const nomeErr = document.getElementById('reg-nome-error')
  const emailErr = document.getElementById('reg-email-error')
  const senhaErr = document.getElementById('reg-senha-error')
  const generalErr = document.getElementById('reg-general-error')
  const duplicateShortcut = document.getElementById('reg-email-duplicate-shortcut')
  const btnShortcut = document.getElementById('btn-shortcut-login')
  const submitBtn = document.getElementById('btn-submit-register')

  // Ao clicar no atalho "Entrar com esta conta"
  if (btnShortcut) {
    btnShortcut.addEventListener('click', () => {
      const email = Store.normalizeEmail(emailInput ? emailInput.value : '')
      if (typeof onNavigateToLogin === 'function') {
        onNavigateToLogin(email)
      } else {
        sessionStorage.setItem('rom_prefill_email', email)
        window.location.hash = '#/entrar'
      }
    })
  }

  // Verificação em tempo real ao digitar o e-mail: detecta duplicidade local imediatamente
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const email = Store.normalizeEmail(emailInput.value)
      // Limpa erros ao digitar
      emailErr.style.display = 'none'
      duplicateShortcut.style.display = 'none'
      generalErr.style.display = 'none'

      if (email && email.includes('@') && email.includes('.')) {
        const localExisting = Store.findLocalUserByEmail(email)
        if (localExisting) {
          emailErr.textContent = 'Já existe uma conta com este e-mail. Faça login.'
          emailErr.style.display = 'block'
          duplicateShortcut.style.display = 'block'
        }
      }
    })
  }

  if (nomeInput) {
    nomeInput.addEventListener('input', () => {
      nomeErr.style.display = 'none'
      generalErr.style.display = 'none'
    })
  }

  if (senhaInput) {
    senhaInput.addEventListener('input', () => {
      senhaErr.style.display = 'none'
      generalErr.style.display = 'none'
    })
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Limpa erros anteriores
    nomeErr.style.display = 'none'
    emailErr.style.display = 'none'
    senhaErr.style.display = 'none'
    generalErr.style.display = 'none'
    duplicateShortcut.style.display = 'none'

    const nome = (nomeInput ? nomeInput.value : '').trim()
    const email = Store.normalizeEmail(emailInput ? emailInput.value : '')
    const senha = senhaInput ? senhaInput.value : ''

    let hasError = false

    if (!nome) {
      nomeErr.textContent = 'Informe o nome do comerciante.'
      nomeErr.style.display = 'block'
      hasError = true
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      emailErr.textContent = 'Informe um e-mail válido.'
      emailErr.style.display = 'block'
      hasError = true
    }

    if (!senha || senha.length < 8) {
      senhaErr.textContent = 'A senha deve ter no mínimo 8 caracteres.'
      senhaErr.style.display = 'block'
      hasError = true
    }

    if (hasError) return

    // 1. Verificação síncrona local: e-mail duplicado
    const localExisting = Store.findLocalUserByEmail(email)
    if (localExisting) {
      emailErr.textContent = 'Já existe uma conta com este e-mail. Faça login.'
      emailErr.style.display = 'block'
      duplicateShortcut.style.display = 'block'
      if (emailInput) emailInput.focus()
      return
    }

    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = 'Criando conta...'
    }

    try {
      await Store.createUser({ nome, email, senha })
      showToast('Conta criada com sucesso.', 'success', 3000)
      window.location.hash = '#/inicio'
    } catch (err) {
      console.warn('Erro ao criar conta:', err)

      // Erro de e-mail duplicado (seja local ou do servidor PocketBase)
      if (
        err.code === 'EMAIL_DUPLICATE_LOCAL' ||
        err.code === 'EMAIL_DUPLICATE_SERVER' ||
        String(err.message).toLowerCase().includes('já existe uma conta com este e-mail') ||
        String(err.message).toLowerCase().includes('already registered')
      ) {
        emailErr.textContent = 'Já existe uma conta com este e-mail. Faça login.'
        emailErr.style.display = 'block'
        duplicateShortcut.style.display = 'block'
        if (emailInput) emailInput.focus()
      } else {
        emailErr.textContent = err.message || 'Erro ao criar conta.'
        emailErr.style.display = 'block'
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = 'Criar conta'
      }
    }
  })
}
