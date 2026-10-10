/**
 * View: Privacidade (#/privacidade)
 * Rota pública sem login
 * Identidade visual de privacidade: "Sem KYC para começar", não-custodial, mínimo de dados
 * "Seu negócio é seu. Seus dados também."
 * CTA "Criar conta grátis"
 */

import { Icons } from '../icons.js'
import { MSG_RODAPE } from '../utils.js'

export function renderPrivacidadeView() {
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

      <!-- HERO PRIVACIDADE -->
      <section class="landing-hero" style="padding-bottom:50px;">
        <div class="hero-pill">
          ${Icons.shield(16)}
          <span>Privacidade por Design & Soberania</span>
        </div>
        <h1 class="hero-title" style="max-width:800px; margin-left:auto; margin-right:auto;">
          Seu negócio é seu. Seus dados também.
        </h1>
        <p class="hero-subtitle" style="max-width:680px;">
          Acreditamos que você não precisa expor sua vida e dados sensíveis para receber pagamentos digitais. Conheça os pilares de proteção da ROM.
        </p>
        <div class="hero-actions">
          <a href="#/criar-conta" class="btn btn-primary btn-lg">Criar conta grátis</a>
          <a href="#/" class="btn btn-secondary btn-lg">Voltar ao início</a>
        </div>
      </section>

      <!-- PILARES DE PRIVACIDADE -->
      <section class="landing-section" style="padding-top:20px;">
        <div class="grid-3">
          <div class="feature-card">
            <div class="feature-icon">${Icons.shield(24)}</div>
            <h3 style="margin-bottom:10px;">Sem KYC para começar</h3>
            <p style="font-size:0.9rem; line-height:1.6;">
              Você não precisa enviar fotos de documentos, selfies biométricas ou comprovantes de residência para abrir sua conta. Nome e e-mail bastam para criar sua identidade na plataforma.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.lock(24)}</div>
            <h3 style="margin-bottom:10px;">Arquitetura Não-Custodial</h3>
            <p style="font-size:0.9rem; line-height:1.6;">
              Os pagamentos são liquidados diretamente na sua carteira Liquid. A ROM não custodia valores nem retém seu saldo. O dinheiro sai do pagador direto para seu endereço cripto.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.zap(24)}</div>
            <h3 style="margin-bottom:10px;">Mínimo de dados coletados</h3>
            <p style="font-size:0.9rem; line-height:1.6;">
              Só coletamos o estritamente necessário para autenticação: nome, e-mail e senha com hash seguro. CNPJ e telefone são sempre opcionais e nunca exigidos para começar.
            </p>
          </div>
        </div>
      </section>

      <!-- MANIFESTO DE PRIVACIDADE -->
      <section class="landing-section" style="padding-top:0;">
        <div class="card" style="padding:36px; background:linear-gradient(135deg, #131c2e 0%, #172640 100%); border-color:rgba(16, 185, 129, 0.3);">
          <div style="max-width:740px; margin:0 auto; text-align:center;">
            <div style="display:inline-flex; color:var(--accent-emerald); background:var(--accent-emerald-subtle); padding:12px; border-radius:50%; margin-bottom:16px;">
              ${Icons.shield(32)}
            </div>
            <h2 style="font-size:1.6rem; margin-bottom:14px;">Compromisso de Transparência</h2>
            <p style="font-size:0.95rem; line-height:1.7; color:#cbd5e1; margin-bottom:20px;">
              Você pode começar sem expor dados sensíveis. Procedimentos adicionais de verificação (KYC) só ocorrerão caso a provedora de pagamentos e liquidação bancária parceira venha a exigir por força regulatória, e mesmo nessa hipótese você será previamente avisado e terá plena liberdade de decidir.
            </p>
            <div style="font-size:1.15rem; font-weight:700; color:var(--accent-emerald); letter-spacing:-0.01em;">
              “Seu negócio é seu. Seus dados também.”
            </div>
            <div style="margin-top:24px;">
              <a href="#/criar-conta" class="btn btn-primary">Começar agora sem KYC</a>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER PÚBLICO -->
      <footer class="landing-footer">
        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:16px; font-size:0.85rem;">
          <a href="#/">Início</a>
          <a href="#/privacidade" style="color:var(--accent-emerald); font-weight:600;">Privacidade</a>
          <a href="#/entrar">Entrar</a>
          <a href="#/criar-conta">Criar conta</a>
        </div>
        <p class="footer-disclaimer">${MSG_RODAPE}</p>
        <p class="footer-copy">ROM © 2025 — Todos os direitos reservados.</p>
      </footer>
    </div>
  `
}
