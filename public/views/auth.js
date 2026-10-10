/**
 * Views de Autenticação (#/entrar e #/criar-conta)
 */

import { Icons } from '../icons.js'
import { Store } from '../store.js'
import { showToast } from '../toast.js'

export function renderLoginView() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <a href="#/" style="display:inline-flex; align-items:center; gap:10px; margin-bottom:16px; text-decoration:none;">
            ${Icons.logo(32)}
            <span style="font-size:1.25rem; font-weight:700; color:var(--text-main); letter-spacing:0.04em;">ROM</span>
          </a>
          <h2>Entrar na conta</h2>
          <p style="font-size:0.88rem; margin-top:4px;">Acesso preservado ao painel de liquidação DePix</p>
        </div>

        <form id="form-login" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">E-mail</label>
            <input type="email" id="login-email" class="form-input" placeholder="seu@email.com" required autocomplete="email" />
            <div id="login-email-error" class="form-error" style="display:none;"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="login-senha">Senha</label>
            <input type="password" id="login-senha" class="form-input" placeholder="••••••••" required autocomplete="current-password" />
            <div id="login-senha-error" class="form-error" style="display:none;"></div>
          </div>

          <div id="login-general-error" class="banner-amber" style="display:none; margin-bottom:16px; border-color:var(--accent-red); color:var(--accent-red); background:var(--accent-red-subtle);">
            ${Icons.alertTriangle(18)}
            <span id="login-general-error-text">E-mail ou senha inválidos.</span>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
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

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const emailInput = document.getElementById('login-email')
    const senhaInput = document.getElementById('login-senha')
    const generalErr = document.getElementById('login-general-error')

    generalErr.style.display = 'none'

    const email = emailInput.value.trim()
    const senha = senhaInput.value

    if (!email || !senha) {
      generalErr.style.display = 'flex'
      document.getElementById('login-general-error-text').textContent =
        'Preencha o e-mail e a senha.'
      return
    }

    try {
      Store.login({ email, senha })
      showToast('Login realizado com sucesso.', 'success', 2500)
      window.location.hash = '#/inicio'
    } catch {
      generalErr.style.display = 'flex'
      document.getElementById('login-general-error-text').textContent = 'E-mail ou senha inválidos.'
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
            <input type="text" id="reg-nome" class="form-input" placeholder="Ex: Padaria Central ou Seu Nome" required />
            <div id="reg-nome-error" class="form-error" style="display:none;"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-email">E-mail</label>
            <input type="email" id="reg-email" class="form-input" placeholder="seu@email.com" required autocomplete="email" />
            <div id="reg-email-error" class="form-error" style="display:none;"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-senha">Senha (mínimo 8 caracteres)</label>
            <input type="password" id="reg-senha" class="form-input" placeholder="Mínimo 8 caracteres" required minlength="8" autocomplete="new-password" />
            <div id="reg-senha-error" class="form-error" style="display:none;"></div>
          </div>

          <div id="reg-general-error" class="banner-amber" style="display:none; margin-bottom:16px; border-color:var(--accent-red); color:var(--accent-red); background:var(--accent-red-subtle);">
            ${Icons.alertTriangle(18)}
            <span id="reg-general-error-text"></span>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
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

export function initRegisterEvents() {
  const form = document.getElementById('form-register')
  if (!form) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const nomeInput = document.getElementById('reg-nome')
    const emailInput = document.getElementById('reg-email')
    const senhaInput = document.getElementById('reg-senha')

    const nomeErr = document.getElementById('reg-nome-error')
    const emailErr = document.getElementById('reg-email-error')
    const senhaErr = document.getElementById('reg-senha-error')
    const generalErr = document.getElementById('reg-general-error')

    // Limpa erros anteriores
    nomeErr.style.display = 'none'
    emailErr.style.display = 'none'
    senhaErr.style.display = 'none'
    generalErr.style.display = 'none'

    const nome = nomeInput.value.trim()
    const email = emailInput.value.trim()
    const senha = senhaInput.value

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

    try {
      Store.createUser({ nome, email, senha })
      showToast('Conta criada com sucesso.', 'success', 3000)
      window.location.hash = '#/inicio'
    } catch (err) {
      emailErr.textContent = err.message || 'Erro ao criar conta.'
      emailErr.style.display = 'block'
    }
  })
}
