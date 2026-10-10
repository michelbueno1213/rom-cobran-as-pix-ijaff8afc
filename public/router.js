/**
 * Router - Hash routing com proteção de rotas
 *
 * Rotas:
 * - #/ (landing pública)
 * - #/entrar, #/criar-conta (se logado -> #/inicio)
 * - #/pagar/:id (pública, sem login)
 * - #/inicio, #/nova-cobranca, #/links, #/saques, #/historico, #/carteiras,
 *   #/liquidados, #/config, #/suporte, #/homologacao -> exigem sessão (se não logado -> #/)
 * - #/homologacao: exige isAdmin === true (se não admin -> #/inicio com toast)
 */

import { Store } from './store.js'
import { showToast } from './toast.js'
import { renderDashboardLayout } from './views/layout.js'
import { renderLandingView } from './views/landing.js'
import {
  renderLoginView,
  initLoginEvents,
  renderRegisterView,
  initRegisterEvents,
} from './views/auth.js'
import { renderInicioView } from './views/inicio.js'
import { renderNovaCobrancaView, initNovaCobrancaEvents } from './views/nova-cobranca.js'
import { renderLinksView, initLinksEvents } from './views/links.js'
import { renderSaquesView, initSaquesEvents } from './views/saques.js'
import { renderHistoricoView, initHistoricoEvents } from './views/historico.js'
import { renderCarteirasView, initCarteirasEvents } from './views/carteiras.js'
import { renderLiquidadosView, initLiquidadosEvents } from './views/liquidados.js'
import { renderConfigView, initConfigEvents } from './views/config.js'
import { renderSuporteView, initSuporteEvents } from './views/suporte.js'
import { renderHomologacaoView, initHomologacaoEvents } from './views/homologacao.js'
import { renderPagarView } from './views/pagar.js'

export const Router = {
  getHash() {
    return window.location.hash || '#/'
  },

  navigate(hash) {
    window.location.hash = hash
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute())
    this.handleRoute()
  },

  handleRoute() {
    const rawHash = this.getHash()
    const appEl = document.getElementById('app')
    if (!appEl) return

    const currentUser = Store.getCurrentUser()

    // 1. Rota de Pagamento Público: #/pagar/:id
    if (rawHash.startsWith('#/pagar/')) {
      const chargeId = rawHash.replace('#/pagar/', '').trim()
      appEl.innerHTML = renderPagarView(chargeId)
      return
    }

    // 2. Rotas de Autenticação (#/entrar e #/criar-conta)
    if (rawHash === '#/entrar') {
      if (currentUser) {
        this.navigate('#/inicio')
        return
      }
      appEl.innerHTML = renderLoginView()
      initLoginEvents()
      return
    }

    if (rawHash === '#/criar-conta') {
      if (currentUser) {
        this.navigate('#/inicio')
        return
      }
      appEl.innerHTML = renderRegisterView()
      initRegisterEvents()
      return
    }

    // 3. Rota Raiz (#/ ou vazia)
    if (rawHash === '#/' || rawHash === '#' || rawHash === '') {
      if (currentUser) {
        this.navigate('#/inicio')
        return
      }
      appEl.innerHTML = renderLandingView()
      return
    }

    // 4. Todas as rotas do painel exigem usuário autenticado
    if (!currentUser) {
      this.navigate('#/')
      return
    }

    // 5. Rota Homologação: restrita a administradores
    if (rawHash === '#/homologacao' && !currentUser.isAdmin) {
      showToast('Acesso restrito a administradores.', 'warning', 3000)
      this.navigate('#/inicio')
      return
    }

    // Função de re-render para views interativas
    const reRender = () => this.handleRoute()

    // Renderiza a view correspondente dentro do layout padrão do painel
    let contentHtml = ''
    let initCallback = null

    switch (rawHash) {
      case '#/inicio':
        contentHtml = renderInicioView(currentUser)
        break

      case '#/nova-cobranca':
        contentHtml = renderNovaCobrancaView(currentUser)
        initCallback = () => initNovaCobrancaEvents(currentUser, reRender)
        break

      case '#/links':
        contentHtml = renderLinksView()
        initCallback = () => initLinksEvents(currentUser, reRender)
        break

      case '#/saques':
        contentHtml = renderSaquesView()
        initCallback = () => initSaquesEvents()
        break

      case '#/historico':
        contentHtml = renderHistoricoView(currentUser)
        initCallback = () => initHistoricoEvents(currentUser, reRender)
        break

      case '#/carteiras':
        contentHtml = renderCarteirasView(currentUser)
        initCallback = () => initCarteirasEvents(currentUser, reRender)
        break

      case '#/liquidados':
        contentHtml = renderLiquidadosView(currentUser)
        initCallback = () => initLiquidadosEvents(currentUser, reRender)
        break

      case '#/config':
        contentHtml = renderConfigView(currentUser)
        initCallback = () => initConfigEvents(currentUser, reRender)
        break

      case '#/suporte':
        contentHtml = renderSuporteView()
        initCallback = () => initSuporteEvents(currentUser, reRender)
        break

      case '#/homologacao':
        contentHtml = renderHomologacaoView(currentUser)
        initCallback = () => initHomologacaoEvents(currentUser, reRender)
        break

      default:
        // Rota desconhecida -> redireciona para #/inicio (se logado) ou landing
        this.navigate(currentUser ? '#/inicio' : '#/')
        return
    }

    // Injeta o Dashboard Layout
    appEl.innerHTML = renderDashboardLayout({
      currentUser,
      currentRoute: rawHash,
      contentHtml,
    })

    // Configura botões de logout
    const btnLogout = document.getElementById('btn-logout')
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        Store.clearSession()
        showToast('Sessão encerrada.', 'success', 2000)
        this.navigate('#/')
      })
    }
    const btnMobileLogout = document.getElementById('btn-mobile-logout')
    if (btnMobileLogout) {
      btnMobileLogout.addEventListener('click', () => {
        Store.clearSession()
        showToast('Sessão encerrada.', 'success', 2000)
        this.navigate('#/')
      })
    }

    // Inicializa eventos da view ativa
    if (typeof initCallback === 'function') {
      initCallback()
    }
  },
}
