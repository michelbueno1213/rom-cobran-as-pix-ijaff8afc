/**
 * View: Landing Pública (rota #/ ou raiz sem login)
 * Atualizada com identidade de privacidade:
 * - Badge no hero: "Sem KYC para começar"
 * - Seção contraste "Cansado de expor seus dados?": "No banco tradicional" vs "Na ROM"
 * - Seção suporte "Suporte que respeita sua privacidade.": "Inteligência artificial 24 horas" e "Gente de verdade quando importa"
 * - Manter 3 cards existentes (Sem custódia, Multicliente, Liquidação direta)
 * - Manter 3 passos existentes
 * - Links "Privacidade" no rodapé
 */

import { Icons } from '../icons.js'
import { MSG_RODAPE } from '../utils.js'

export function renderLandingView() {
  return `
    <div style="display:flex; flex-direction:column; min-height:100vh;">
      <!-- NAVBAR PÚBLICA -->
      <header class="landing-navbar">
        <a href="#/" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          ${Icons.logo(32)}
          <span style="font-size:1.25rem; font-weight:800; color:var(--text-main); letter-spacing:0.04em;">ROM</span>
        </a>
        <div style="display:flex; align-items:center; gap:12px;">
          <a href="#/privacidade" class="btn btn-outline btn-sm">Privacidade</a>
          <a href="#/entrar" class="btn btn-outline btn-sm">Entrar</a>
          <a href="#/criar-conta" class="btn btn-primary btn-sm">Criar conta grátis</a>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="landing-hero">
        <div class="hero-pill">
          ${Icons.shield(16)}
          <span>Sem KYC para começar</span>
        </div>
        <h1 class="hero-title">Do Pix para a sua carteira Liquid.</h1>
        <p class="hero-subtitle">
          Receba pagamentos Pix dos seus clientes com conversão e liquidação direta em DePix na sua carteira Liquid, sem intermediários custodiando o seu capital.
        </p>
        <div class="hero-actions">
          <a href="#/criar-conta" class="btn btn-primary btn-lg">Criar conta grátis</a>
          <a href="#/entrar" class="btn btn-secondary btn-lg">Entrar</a>
        </div>
      </section>

      <!-- 3 CARDS EM DESTAQUE (MANTIDOS) -->
      <section class="landing-section">
        <div class="section-header">
          <h2 class="section-title">Construído para comerciantes soberanos</h2>
          <p class="section-subtitle">Arquitetura sem custódia de ponta a ponta na rede Liquid.</p>
        </div>

        <div class="grid-3">
          <div class="feature-card">
            <div class="feature-icon">${Icons.shield(22)}</div>
            <h3 style="margin-bottom:8px;">Sem custódia</h3>
            <p style="font-size:0.9rem; line-height:1.5;">
              A ROM não custodia valores. Os pagamentos são liquidados diretamente na sua carteira Liquid.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.users(22)}</div>
            <h3 style="margin-bottom:8px;">Multicliente</h3>
            <p style="font-size:0.9rem; line-height:1.5;">
              Crie uma carteira Liquid por operação e receba de cada cliente de forma organizada.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.zap(22)}</div>
            <h3 style="margin-bottom:8px;">Liquidação direta</h3>
            <p style="font-size:0.9rem; line-height:1.5;">
              Pix confirmado vira DePix líquido na sua carteira, direto na rede Liquid.
            </p>
          </div>
        </div>
      </section>

      <!-- SEÇÃO CONTRASTE ESTILO DEFLOW: CANSADO DE EXPOR SEUS DADOS? -->
      <section class="landing-section" style="padding-top:0;">
        <div class="section-header">
          <span class="badge badge-amber" style="margin-bottom:10px;">Liberdade de verdade</span>
          <h2 class="section-title">Cansado de expor seus dados?</h2>
          <p class="section-subtitle">No banco é formulário atrás de formulário, comprovante de tudo e espera. Aqui é diferente.</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;" class="config-grid">
          <div class="card" style="background:rgba(239, 68, 68, 0.04); border-color:rgba(239, 68, 68, 0.25); padding:32px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
              <span style="color:var(--accent-red); font-size:1.2rem;">✕</span>
              <h3 style="color:var(--text-main); font-size:1.2rem;">No banco tradicional</h3>
            </div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:14px; font-size:0.92rem; color:var(--text-muted);">
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-red);">&bull;</span>
                <span>Pede documento, comprovante de endereço e até foto facial</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-red);">&bull;</span>
                <span>Demora dias úteis para aprovar e liberar a conta</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-red);">&bull;</span>
                <span>Bloqueia seu dinheiro preventivamente quando quer</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-red);">&bull;</span>
                <span>Burocracia e tarifas escondidas em cada operação</span>
              </li>
            </ul>
          </div>

          <div class="card" style="background:rgba(16, 185, 129, 0.05); border-color:rgba(16, 185, 129, 0.35); padding:32px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
              <span style="color:var(--accent-emerald); font-size:1.2rem;">✓</span>
              <h3 style="color:var(--text-main); font-size:1.2rem;">Na ROM</h3>
            </div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:14px; font-size:0.92rem; color:var(--text-main);">
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:bold;">✓</span>
                <span><strong>Comece sem KYC</strong>, em menos de 1 minuto</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:bold;">✓</span>
                <span><strong>Conta pronta na hora</strong>, sem filas ou burocracia</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:bold;">✓</span>
                <span><strong>Não-custodial</strong>: o dinheiro é seu, sempre</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:bold;">✓</span>
                <span><strong>Receber, enviar e cobrar</strong> em poucos toques</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 3 PASSOS NUMERADOS (MANTIDOS) -->
      <section class="landing-section" style="padding-top:20px;">
        <div class="section-header">
          <h2 class="section-title">Como funciona em 3 passos simples</h2>
          <p class="section-subtitle">Comece a receber em DePix em poucos minutos.</p>
        </div>

        <div class="grid-3">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3 style="margin-bottom:8px;">Criar conta</h3>
            <p style="font-size:0.9rem; line-height:1.5;">
              Cadastro rápido com nome do comerciante, e-mail e senha segura.
            </p>
          </div>

          <div class="step-card">
            <div class="step-number">2</div>
            <h3 style="margin-bottom:8px;">Cadastrar carteira</h3>
            <p style="font-size:0.9rem; line-height:1.5;">
              Informe o apelido e o endereço Liquid começando com <code>lq1</code> ou <code>ex1</code>.
            </p>
          </div>

          <div class="step-card">
            <div class="step-number">3</div>
            <h3 style="margin-bottom:8px;">Gerar cobranças</h3>
            <p style="font-size:0.9rem; line-height:1.5;">
              Código Pix para o cliente pagar e você receber DePix na Liquid diretamente.
            </p>
          </div>
        </div>
      </section>

      <!-- SEÇÃO SUPORTE ESTILO DEFLOW -->
      <section class="landing-section" style="padding-top:0;">
        <div class="section-header">
          <span class="badge badge-blue" style="margin-bottom:10px;">Atendimento que respeita você</span>
          <h2 class="section-title">Suporte que respeita sua privacidade.</h2>
          <p class="section-subtitle">Ajuda rápida na hora certa. O equilíbrio perfeito entre inteligência artificial e acolhimento humano.</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;" class="config-grid">
          <div class="feature-card">
            <div class="feature-icon" style="background:var(--accent-blue-subtle); color:var(--accent-blue);">${Icons.bot(22)}</div>
            <h3 style="margin-bottom:10px;">Inteligência artificial 24 horas</h3>
            <p style="font-size:0.9rem; line-height:1.6;">
              Tira dúvida na hora, a qualquer momento do dia ou da noite, sem fila. Resolve dúvidas técnicas sobre a Liquid, status de transações e regras de pagamento em segundos.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background:var(--accent-emerald-subtle); color:var(--accent-emerald);">${Icons.users(22)}</div>
            <h3 style="margin-bottom:10px;">Gente de verdade quando importa</h3>
            <p style="font-size:0.9rem; line-height:1.6;">
              Quando o caso é sério, uma pessoa real assume, com nome e atenção. Atendimento humano dedicado para proteger seu negócio e garantir tranquilidade.
            </p>
          </div>
        </div>
      </section>

      <!-- FOOTER PÚBLICO COM LINK PRIVACIDADE -->
      <footer class="landing-footer">
        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:16px; font-size:0.85rem;">
          <a href="#/">Início</a>
          <a href="#/privacidade" style="color:var(--accent-emerald);">Privacidade na ROM</a>
          <a href="#/entrar">Entrar</a>
          <a href="#/criar-conta">Criar conta grátis</a>
        </div>
        <p class="footer-disclaimer">${MSG_RODAPE}</p>
        <p class="footer-copy">ROM © 2025 — Todos os direitos reservados.</p>
      </footer>
    </div>
  `
}
