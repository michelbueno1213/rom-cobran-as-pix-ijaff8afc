/**
 * View: Landing Pública (rota #/ ou raiz sem login)
 * Identidade Sóbria, Oculta e Preservadora:
 * - Sigilo, discrição e preservação de dados
 * - "Seus dados não são a moeda de troca." / "Ninguém precisa saber quem você é para receber."
 * - Badge no hero: "Identidade preservada"
 * - Seção contraste sem exclamações nem emojis: foco em resguardo, proteção e sobriedade
 * - Traço fino monocromático, sem cores chamativas ou brincadeiras visuais
 */

import { Icons } from '../icons.js'
import { MSG_RODAPE } from '../utils.js'

export function renderLandingView() {
  return `
    <div style="display:flex; flex-direction:column; min-height:100vh;">
      <!-- NAVBAR PÚBLICA -->
      <header class="landing-navbar">
        <a href="#/" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          ${Icons.logo(30)}
          <span style="font-size:1.15rem; font-weight:700; color:var(--text-main); letter-spacing:0.06em;">ROM</span>
        </a>
        <div style="display:flex; align-items:center; gap:12px;">
          <a href="#/privacidade" class="btn btn-outline btn-sm">Privacidade</a>
          <a href="#/entrar" class="btn btn-outline btn-sm">Entrar</a>
          <a href="#/criar-conta" class="btn btn-primary btn-sm">Criar conta</a>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="landing-hero">
        <div class="hero-pill">
          ${Icons.shield(15)}
          <span>Identidade preservada</span>
        </div>
        <h1 class="hero-title">Seus dados não são a moeda de troca.</h1>
        <p class="hero-subtitle">
          Ninguém precisa saber quem você é para receber. Receba pagamentos Pix com liquidação direta em DePix na sua carteira Liquid, sem custódia e sem exposição.
        </p>
        <div class="hero-actions">
          <a href="#/criar-conta" class="btn btn-primary btn-lg">Abrir conta soberana</a>
          <a href="#/entrar" class="btn btn-secondary btn-lg">Acessar painel</a>
        </div>
      </section>

      <!-- 3 CARDS EM DESTAQUE (MANTIDOS E SÓBRIOS) -->
      <section class="landing-section">
        <div class="section-header">
          <h2 class="section-title">Proteção contínua para sua operação</h2>
          <p class="section-subtitle">Arquitetura não-custodial e comunicação silenciosa na rede Liquid.</p>
        </div>

        <div class="grid-3">
          <div class="feature-card">
            <div class="feature-icon">${Icons.shield(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Sem custódia</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              A plataforma não retém nem gerencia seu capital. A liquidação ocorre de forma direta no endereço Liquid do destinatário.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.users(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Multicliente</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              Segregação de recebíveis por carteira ou operação, mantendo fluxos isolados e sem cruzamento de dados sensíveis.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.zap(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Liquidação direta</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              Conversão Pix confirmada e liquidada em DePix na rede Liquid, sem intermediários no caminho.
            </p>
          </div>
        </div>
      </section>

      <!-- SEÇÃO CONTRASTE SÓBRIA: CANSADO DE EXPOR SEUS DADOS? -->
      <section class="landing-section" style="padding-top:0;">
        <div class="section-header">
          <span class="badge badge-gray" style="margin-bottom:10px;">Resguardo de dados</span>
          <h2 class="section-title">Cansado de expor seus dados?</h2>
          <p class="section-subtitle">A intermediação convencional exige comprovação de tudo. A ROM opera sob discrição e mínimo privilégio.</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;" class="config-grid">
          <div class="card" style="background:rgba(15, 23, 42, 0.4); border-color:var(--border-subtle); padding:28px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
              <span style="color:#64748b; font-size:1rem;">—</span>
              <h3 style="color:var(--text-main); font-size:1.05rem; font-weight:600;">Intermediação bancária tradicional</h3>
            </div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:12px; font-size:0.88rem; color:var(--text-muted);">
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:#64748b;">•</span>
                <span>Exigência de documentos pessoais, biometria e comprovantes</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:#64748b;">•</span>
                <span>Prazos de aprovação com análise humana de histórico financeiro</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:#64748b;">•</span>
                <span>Retenções unilaterais e bloqueios cautelares de saldo</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:#64748b;">•</span>
                <span>Exposição contínua do perfil de compras e movimentações</span>
              </li>
            </ul>
          </div>

          <div class="card" style="background:rgba(19, 28, 46, 0.65); border-color:#334155; padding:28px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
              <span style="color:var(--accent-emerald); font-size:1rem;">—</span>
              <h3 style="color:var(--text-main); font-size:1.05rem; font-weight:600;">Arquitetura preservadora ROM</h3>
            </div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:12px; font-size:0.88rem; color:var(--text-main);">
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:600;">•</span>
                <span>Identidade preservada: início imediato sem coleta desnecessária</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:600;">•</span>
                <span>Ativação instantânea da conta sem formulários invasivos</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:600;">•</span>
                <span>Não-custodial: soberania total sobre as chaves e os ativos</span>
              </li>
              <li style="display:flex; align-items:flex-start; gap:10px;">
                <span style="color:var(--accent-emerald); font-weight:600;">•</span>
                <span>Liquidação direta em carteira Liquid de forma silenciosa</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 3 PASSOS NUMERADOS (MANTIDOS E SÓBRIOS) -->
      <section class="landing-section" style="padding-top:16px;">
        <div class="section-header">
          <h2 class="section-title">Como funciona o fluxo de recebimento</h2>
          <p class="section-subtitle">Três etapas discretas entre o pagador e a sua carteira privada.</p>
        </div>

        <div class="grid-3">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Criar acesso</h3>
            <p style="font-size:0.88rem; line-height:1.5; color:var(--text-muted);">
              Definição de credenciais de acesso com hash criptográfico protegido.
            </p>
          </div>

          <div class="step-card">
            <div class="step-number">2</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Cadastrar carteira</h3>
            <p style="font-size:0.88rem; line-height:1.5; color:var(--text-muted);">
              Indicação do endereço da sua carteira Liquid iniciado por <code>lq1</code> ou <code>ex1</code>.
            </p>
          </div>

          <div class="step-card">
            <div class="step-number">3</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Gerar cobrança</h3>
            <p style="font-size:0.88rem; line-height:1.5; color:var(--text-muted);">
              O pagador liquida via Pix e o DePix é creditado diretamente na sua custódia pessoal.
            </p>
          </div>
        </div>
      </section>

      <!-- SEÇÃO SUPORTE SÓBRIA -->
      <section class="landing-section" style="padding-top:0;">
        <div class="section-header">
          <span class="badge badge-gray" style="margin-bottom:10px;">Atendimento sob demanda</span>
          <h2 class="section-title">Suporte com discrição e sigilo.</h2>
          <p class="section-subtitle">Canais diretos sem intermediários para resolver dúvidas técnicas com resguardo de informações.</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;" class="config-grid">
          <div class="feature-card">
            <div class="feature-icon">${Icons.bot(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Assistência automatizada 24 horas</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              Respostas técnicas imediatas sobre status de transações, validação de endereços Liquid e parâmetros de liquidação.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">${Icons.users(20)}</div>
            <h3 style="margin-bottom:8px; font-weight:600;">Atendimento individual especializado</h3>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-muted);">
              Acompanhamento direto e confidencial para situações que demandem validação operacional ou técnica.
            </p>
          </div>
        </div>
      </section>

      <!-- FOOTER PÚBLICO COM LINK PRIVACIDADE -->
      <footer class="landing-footer">
        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:16px; font-size:0.85rem;">
          <a href="#/" style="color:var(--text-muted);">Início</a>
          <a href="#/privacidade" style="color:var(--text-main); font-weight:500;">Privacidade na ROM</a>
          <a href="#/entrar" style="color:var(--text-muted);">Entrar</a>
          <a href="#/criar-conta" style="color:var(--text-muted);">Criar conta</a>
        </div>
        <p class="footer-disclaimer">${MSG_RODAPE}</p>
        <p class="footer-copy">ROM © 2025 — Todos os direitos reservados.</p>
      </footer>
    </div>
  `
}
