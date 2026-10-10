/**
 * View: Landing Pública (rota #/ ou raiz sem login)
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
          <a href="#/entrar" class="btn btn-outline btn-sm">Entrar</a>
          <a href="#/criar-conta" class="btn btn-primary btn-sm">Criar conta grátis</a>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="landing-hero">
        <div class="hero-pill">
          ${Icons.zap(16)}
          <span>Tecnologia Pix integrada à rede Liquid</span>
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

      <!-- 3 CARDS EM DESTAQUE -->
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

      <!-- 3 PASSOS NUMERADOS -->
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

      <!-- FOOTER PÚBLICO -->
      <footer class="landing-footer">
        <p class="footer-disclaimer">${MSG_RODAPE}</p>
        <p class="footer-copy">ROM © 2025 — Todos os direitos reservados.</p>
      </footer>
    </div>
  `
}
