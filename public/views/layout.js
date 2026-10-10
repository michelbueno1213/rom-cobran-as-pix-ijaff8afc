/**
 * Componente de Layout do Painel
 * Sidebar fixa (desktop) / Bottom Nav (mobile) / Rodapé fixo / Menu Homologação condicional
 * Atualizado com paridade DeFlow:
 * - Pagar Contas (#/pagar-contas) entre Saques e Histórico
 * - Cupons (#/cupons) na seção Conta
 * - Link "Privacidade" no rodapé do painel
 */

import { Icons } from '../icons.js'
import { MSG_RODAPE } from '../utils.js'

export function renderDashboardLayout({ currentUser, currentRoute, contentHtml }) {
  const isAdmin = Boolean(currentUser && currentUser.isAdmin)

  const navItems = [
    { route: '#/inicio', label: 'Início', icon: Icons.home() },
    { route: '#/nova-cobranca', label: 'Nova Cobrança', icon: Icons.plusCircle() },
    { route: '#/links', label: 'Meus Links', icon: Icons.link() },
    { route: '#/saques', label: 'Saques', icon: Icons.withdraw() },
    { route: '#/pagar-contas', label: 'Pagar Contas', icon: Icons.receipt() },
    { route: '#/historico', label: 'Histórico', icon: Icons.history() },
    { route: '#/carteiras', label: 'Carteiras Liquid', icon: Icons.wallet() },
  ]

  const accountItems = [
    { route: '#/liquidados', label: 'Valores Liquidados', icon: Icons.checkCircle() },
    { route: '#/cupons', label: 'Cupons', icon: Icons.tag() },
    { route: '#/config', label: 'Configurações', icon: Icons.settings() },
    { route: '#/suporte', label: 'Suporte', icon: Icons.helpCircle() },
  ]

  // Item de homologação exclusivo para administradores
  const homologItem = isAdmin
    ? {
        route: '#/homologacao',
        label: 'Homologação',
        icon: Icons.flask(),
        badge:
          '<span class="badge badge-amber" style="font-size:0.65rem; padding:1px 6px;">HOMOLOGAÇÃO</span>',
      }
    : null

  const isCurrent = (r) => currentRoute === r || (r === '#/inicio' && currentRoute === '')

  return `
    <div class="dashboard-layout">
      <!-- SIDEBAR DESKTOP (264px) -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a href="#/inicio" style="display:flex; align-items:center; gap:12px; text-decoration:none;">
            ${Icons.logo(32)}
            <div class="brand-text">
              <span class="brand-name">ROM</span>
              <span class="brand-tagline">Cobranças Pix → DePix</span>
            </div>
          </a>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-title">Principal</div>
          ${navItems
            .map(
              (item) => `
            <a href="${item.route}" class="nav-link ${isCurrent(item.route) ? 'active' : ''}">
              ${item.icon}
              <span class="nav-label">${item.label}</span>
            </a>
          `,
            )
            .join('')}

          <div class="nav-section-title">Conta</div>
          ${accountItems
            .map(
              (item) => `
            <a href="${item.route}" class="nav-link ${isCurrent(item.route) ? 'active' : ''}">
              ${item.icon}
              <span class="nav-label">${item.label}</span>
            </a>
          `,
            )
            .join('')}

          ${
            homologItem
              ? `
            <div class="nav-section-title">Ambiente Restrito</div>
            <a href="${homologItem.route}" class="nav-link ${isCurrent(homologItem.route) ? 'active' : ''}">
              ${homologItem.icon}
              <span class="nav-label">${homologItem.label}</span>
              ${homologItem.badge}
            </a>
          `
              : ''
          }
        </nav>

        <div class="sidebar-footer">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; margin-bottom:4px;">
            <a href="#/privacidade" style="color:var(--text-muted); font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
              ${Icons.shield(14)} <span>Privacidade na ROM</span>
            </a>
          </div>
          <div class="sidebar-disclaimer">
            ${MSG_RODAPE}
          </div>
          <div class="sidebar-user">
            <div class="user-meta">
              <span class="user-name">${currentUser?.nome || 'Comerciante'}</span>
              <span class="user-email">${currentUser?.email || ''}</span>
            </div>
            <button id="btn-logout" class="btn-icon" title="Sair da conta" aria-label="Sair da conta">
              ${Icons.logOut(18)}
            </button>
          </div>
        </div>
      </aside>

      <!-- ÁREA PRINCIPAL -->
      <div class="dashboard-main">
        <!-- HEADER MOBILE -->
        <header class="mobile-header">
          <div style="display:flex; align-items:center; gap:8px;">
            ${Icons.logo(26)}
            <span style="font-weight:700; font-size:1.05rem; color:var(--text-main); letter-spacing:0.04em;">ROM</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <a href="#/pagar-contas" class="btn-icon" aria-label="Pagar Contas" title="Pagar Contas">${Icons.receipt(18)}</a>
            <a href="#/config" class="btn-icon" aria-label="Configurações">${Icons.settings(18)}</a>
            <button id="btn-mobile-logout" class="btn-icon" aria-label="Sair">${Icons.logOut(18)}</button>
          </div>
        </header>

        <!-- CONTEÚDO DA VIEW -->
        <main class="dashboard-content">
          ${contentHtml}
        </main>

        <!-- FOOTER DO CONTEÚDO -->
        <footer class="content-footer">
          <div style="margin-bottom:8px;">
            <a href="#/privacidade" style="color:var(--text-muted); font-weight:500; text-decoration:none;">
              Privacidade na ROM
            </a>
          </div>
          <div>${MSG_RODAPE}</div>
        </footer>
      </div>

      <!-- BOTTOM NAV (MOBILE) -->
      <nav class="mobile-bottom-nav">
        <a href="#/inicio" class="bottom-nav-item ${isCurrent('#/inicio') ? 'active' : ''}">
          ${Icons.home(20)}
          <span>Início</span>
        </a>
        <a href="#/historico" class="bottom-nav-item ${isCurrent('#/historico') ? 'active' : ''}">
          ${Icons.history(20)}
          <span>Histórico</span>
        </a>
        <a href="#/nova-cobranca" class="bottom-nav-center" aria-label="Nova Cobrança">
          ${Icons.plus(22)}
        </a>
        <a href="#/carteiras" class="bottom-nav-item ${isCurrent('#/carteiras') ? 'active' : ''}">
          ${Icons.wallet(20)}
          <span>Carteiras</span>
        </a>
        <a href="#/config" class="bottom-nav-item ${isCurrent('#/config') ? 'active' : ''}">
          ${Icons.settings(20)}
          <span>Ajustes</span>
        </a>
      </nav>
    </div>
  `
}
