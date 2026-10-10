/**
 * View: Privacidade (#/privacidade)
 * Rota pública sem login
 * Identidade Sóbria e Preservadora:
 * "Seu negócio é seu. Seus dados também."
 * Sigilo operacional, resguardo patrimonial e mínima exposição.
 */

import { Icons } from '../icons.js'
import { MSG_RODAPE } from '../utils.js'

export function renderPrivacidadeView() {
  return `
    <div style="display:flex; flex-direction:column; min-height:100vh;">
      <!-- NAVBAR PÚBLICA -->
      <header class="landing-navbar">
        <a href="#/" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          ${Icons.logo(30)}
          <span style="font-size:1.15rem; font-weight:700; color:var(--text-main); letter-spacing:0.06em;">ROM</span>
        </a>
        <div style="display:flex; align-items:center; gap:12px;">
          <a href="#/entrar" class="btn btn-outline btn-sm">Entrar</a>
          <a href="#/criar-conta" class="btn btn-primary btn-sm">Criar conta</a>
        </div>
      </header>

      <!-- HERO PRIVACIDADE -->
      <section class="landing-hero" style="padding-bottom:50px;">
        <div class="hero-pill">
          ${Icons.shield(15)}
          <span>Privacidade por projeto & discrição</span>
        </div>
        <h1 class="hero-title" style="max-width:800px; margin-left:auto; margin-right:auto;">
          Seu negócio é seu. Seus dados também.
        </h1>
        <p class="hero-subtitle" style="max-width:680px;">
          A proteção da sua atividade comercial não deve exigir concessões de privacidade. A arquitetura da ROM foi desenhada para preservar o sigilo operacional de ponta a ponta.
        </p>
        <div class="hero-actions">
          <a href="#/criar-conta" class="btn btn-primary btn-lg">Criar conta preservada</a>
          <a href="#/" class="btn btn-secondary btn-lg">Retornar ao início</a>
        </div>
      </section>

      <!-- PILARES DE PRIVACIDADE -->
      <section class="landing-section" style="padding-top:20px;">
        <div class="grid-3">
          <div class="feature-card">
            <div class="feature-icon">${Icons.shield(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Identidade preservada</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              Nenhum documento pessoal, registro biométrico ou comprovante domiciliar é exigido para abertura de conta. Nome de identificação e e-mail bastam para operação inicial.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.lock(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Arquitetura não-custodial</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              A liquidação é remetida diretamente para a sua carteira Liquid. O capital não transita por saldo compartilhado nem permanece sob guarda de terceiros.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.zap(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Mínimo privilégio de dados</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              Armazenamento restrito às credenciais essenciais para autenticação com derivação criptográfica. Dados secundários são sempre opcionais.
            </p>
          </div>
        </div>
      </section>

      <!-- MANIFESTO DE PRIVACIDADE -->
      <section class="landing-section" style="padding-top:0;">
        <div class="card" style="padding:36px; background:rgba(19, 28, 46, 0.7); border-color:#334155;">
          <div style="max-width:740px; margin:0 auto; text-align:center;">
            <div style="display:inline-flex; color:#94a3b8; background:rgba(30, 41, 59, 0.7); border:1px solid #334155; padding:12px; border-radius:50%; margin-bottom:16px;">
              ${Icons.shield(28)}
            </div>
            <h2 style="font-size:1.45rem; font-weight:700; margin-bottom:14px; color:var(--text-main);">Compromisso de Discrição</h2>
            <p style="font-size:0.92rem; line-height:1.7; color:var(--text-muted); margin-bottom:20px;">
              A operação começa sem exposição de dados sensíveis. Verificações regulatórias adicionais só ocorrerão se exigidas estritamente pela parceira bancária liquidante em casos específicos, sempre com aviso prévio transparente e plena autonomia para encerrar ou remanejar a sua custódia.
            </p>
            <div style="font-size:1.1rem; font-weight:600; color:var(--text-main); letter-spacing:-0.01em;">
              “Seu negócio é seu. Seus dados também.”
            </div>
            <div style="margin-top:24px;">
              <a href="#/criar-conta" class="btn btn-primary">Iniciar operação silenciosa</a>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER PÚBLICO -->
      <footer class="landing-footer">
        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:16px; font-size:0.85rem;">
          <a href="#/" style="color:var(--text-muted);">Início</a>
          <a href="#/privacidade" style="color:var(--text-main); font-weight:500;">Privacidade</a>
          <a href="#/entrar" style="color:var(--text-muted);">Entrar</a>
          <a href="#/criar-conta" style="color:var(--text-muted);">Criar conta</a>
        </div>
        <p class="footer-disclaimer">${MSG_RODAPE}</p>
        <p class="footer-copy">ROM © 2025 — Todos os direitos reservados.</p>
      </footer>
    </div>
  `
}
