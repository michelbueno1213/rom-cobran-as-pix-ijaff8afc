/**
 * View: Landing Pública (#/)
 * Fintech Premium, Sofisticada, Séria, Exclusiva e Discreta.
 * Identidade própria: Azul-noturno quase preto, grafite e detalhes em azul-petróleo.
 *
 * Estrutura ordenada conforme especificação:
 * 1. Apresentação premium
 * 2. Benefícios em quatro cards: "Privacidade operacional", "Recebimento na rede Liquid",
 *    "Arquitetura sem custódia da ROM", "Gestão simplificada de cobranças"
 * 3. Como funciona: Crie sua conta → cadastre sua carteira SideSwap/Liquid → gere um link Pix → acompanhe o recebimento
 * 4. Painel ilustrativo com transações e status (demonstração visual com dados fictícios)
 * 5. Chamada final: "Uma nova experiência para receber seus pagamentos."
 * 6. Rodapé com os links: Termos (#/privacidade), Privacidade (#/privacidade), Entrar (#/entrar), Criar conta (#/criar-conta)
 */

import { Icons } from '../icons.js'
import { MSG_RODAPE } from '../utils.js'

export function renderLandingView() {
  // Padrão decorativo estático estilizado (NÃO payload Pix real nem escaneável)
  const decorativeQrPattern = `
    <svg class="mockup-qr-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- Fundo sutil -->
      <rect width="120" height="120" rx="10" fill="#060A11"/>
      
      <!-- Canto Sup-Esq -->
      <rect x="12" y="12" width="28" height="28" rx="4" stroke="#2DD4BF" stroke-width="2.5" fill="none"/>
      <rect x="18" y="18" width="16" height="16" rx="2" fill="#2DD4BF"/>

      <!-- Canto Sup-Dir -->
      <rect x="80" y="12" width="28" height="28" rx="4" stroke="#2DD4BF" stroke-width="2.5" fill="none"/>
      <rect x="86" y="18" width="16" height="16" rx="2" fill="#2DD4BF"/>

      <!-- Canto Inf-Esq -->
      <rect x="12" y="80" width="28" height="28" rx="4" stroke="#2DD4BF" stroke-width="2.5" fill="none"/>
      <rect x="18" y="86" width="16" height="16" rx="2" fill="#2DD4BF"/>

      <!-- Matriz de blocos decorativos modernos de demonstração visual -->
      <rect x="46" y="14" width="8" height="8" rx="1.5" fill="#38BDF8"/>
      <rect x="58" y="14" width="14" height="8" rx="1.5" fill="#14B8A6"/>
      <rect x="46" y="26" width="26" height="6" rx="1.5" fill="#475569"/>
      <rect x="46" y="36" width="10" height="10" rx="1.5" fill="#2DD4BF"/>
      <rect x="60" y="36" width="12" height="10" rx="1.5" fill="#334155"/>

      <!-- Área central estilizada com ponto de pulso -->
      <rect x="46" y="52" width="28" height="16" rx="3" fill="#0D1524" stroke="#1E293B"/>
      <circle cx="60" cy="60" r="3.5" fill="#2DD4BF"/>

      <!-- Linhas de temporização decorativas -->
      <line x1="14" y1="58" x2="38" y2="58" stroke="#334155" stroke-width="3" stroke-dasharray="4 4"/>
      <line x1="82" y1="58" x2="106" y2="58" stroke="#334155" stroke-width="3" stroke-dasharray="4 4"/>

      <!-- Blocos decorativos inferiores -->
      <rect x="46" y="74" width="12" height="10" rx="1.5" fill="#334155"/>
      <rect x="62" y="74" width="12" height="20" rx="1.5" fill="#14B8A6"/>
      <rect x="46" y="88" width="12" height="18" rx="1.5" fill="#2DD4BF"/>
      <rect x="78" y="80" width="14" height="8" rx="1.5" fill="#475569"/>
      <rect x="96" y="80" width="12" height="14" rx="1.5" fill="#38BDF8"/>
      <rect x="78" y="92" width="30" height="14" rx="1.5" fill="#1E293B"/>
    </svg>
  `

  return `
    <div class="landing-wrapper">
      <!-- Iluminação e malha sutil de fundo com orbes esmeralda desfocados -->
      <div class="landing-ambient-bg" aria-hidden="true">
        <div class="floating-orb floating-orb-1"></div>
        <div class="floating-orb floating-orb-2"></div>
      </div>
      <div class="landing-grid-overlay" aria-hidden="true"></div>

      <!-- NAVBAR PÚBLICA -->
      <header class="landing-navbar">
        <a href="#/" class="landing-nav-brand">
          ${Icons.logo(30)}
          <span class="landing-brand-title">ROM</span>
          <span class="landing-brand-badge" style="display:inline-flex; align-items:center; gap:5px;">
            <span class="status-dot status-dot-green" style="width:5px; height:5px;"></span>
            LIQUID NETWORK
          </span>
        </a>
        <div class="landing-nav-actions">
          <a href="#/privacidade" class="btn btn-outline btn-sm">Privacidade</a>
          <a href="#/entrar" class="btn btn-secondary btn-sm">Acessar painel</a>
          <a href="#/criar-conta" class="btn btn-premium-teal btn-sm">Criar conta grátis</a>
        </div>
      </header>

      <!-- HERO SECTION (TEXTOS EXATOS VERBATIM) -->
      <section class="landing-hero reveal-on-scroll">
        <div style="display:inline-flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:26px;">
          <div class="hero-pill" style="margin-bottom:0;">
            <span class="hero-pill-dot"></span>
            <span>Pix ⇄ DePix na rede Liquid</span>
          </div>
          <div class="liquid-status-badge">
            <span class="status-dot status-dot-green" style="width:6px; height:6px;"></span>
            <span>liquid-network: online</span>
          </div>
        </div>

        <h1 class="hero-title">
          <span class="title-accent">Seu Pix. Seu controle.</span><br/>
          <span class="title-teal">Sua carteira.</span>
        </h1>

        <p class="hero-subtitle">
          Gere cobranças Pix e receba em DePix na rede Liquid, diretamente na carteira cadastrada, por meio de parceiros integrados.
        </p>

        <div class="hero-actions">
          <a href="#/criar-conta" class="btn btn-premium-teal btn-lg hero-cta-btn">Criar conta grátis</a>
          <a href="#/entrar" class="btn btn-premium-dark btn-lg">Acessar painel</a>
        </div>

        <div class="hero-discrete-note">
          ${Icons.shield(13)}
          <span>Cobranças reais dependem da integração e aprovação do provedor de liquidação.</span>
        </div>

        <!-- MOCKUP SOFISTICADO DO HERO COM PARALLAX SUAVE NO MOUSE -->
        <div class="hero-mockup-wrapper" id="hero-console-mockup">
          <div class="hero-mockup-inner">
            <!-- Barra superior da janela -->
            <div class="mockup-window-bar">
              <div class="mockup-window-dots">
                <span class="mockup-dot"></span>
                <span class="mockup-dot"></span>
                <span class="mockup-dot"></span>
              </div>
              <div class="mockup-window-title">
                ${Icons.shield(13)}
                <span>rom-protocol // liquid-settlement // demonstration-mode</span>
              </div>
              <span class="mockup-amount-tag">DEMO VISUAL</span>
            </div>

            <!-- Corpo do mockup -->
            <div class="mockup-body">
              <!-- Coluna 1: Cobrança Pix com QR decorativo -->
              <div class="mockup-qr-card">
                <div class="mockup-card-label">
                  <span>Cobrança Pix Ativa</span>
                  <span style="color:#2dd4bf; display:flex; align-items:center; gap:4px;">
                    <span class="hero-pill-dot"></span> Aguardando
                  </span>
                </div>

                <div class="mockup-qr-box">
                  ${decorativeQrPattern}
                  <span style="font-size:0.62rem; color:#64748b; font-family:var(--font-mono); margin-top:8px; letter-spacing:0.04em;">
                    ILUSTRAÇÃO DECORATIVA ESTÁTICA
                  </span>
                </div>

                <div class="mockup-amount-display">
                  <span style="font-size:0.7rem; color:#64748b; text-transform:uppercase; letter-spacing:0.06em;">Valor da Cobrança</span>
                  <span class="mockup-amount-num tabular-nums val-cyan-highlight">R$ 1.850,00</span>
                  <div class="mockup-amount-tag">
                    ${Icons.zap(12)}
                    <span class="tabular-nums">1.850,00 DePix (1:1 BRL)</span>
                  </div>
                </div>
                <div>
                  <div style="font-size:0.68rem; color:#64748b; margin-bottom:4px; font-weight:500;">Carteira Liquid Destino</div>
                  <div class="mockup-dest-address">lq1qq2m8x9p2z84k2m7d3c0v1a8j...3w9f</div>
                </div>
              </div>

              <!-- Coluna 2: KPIs e Histórico de Liquidações -->
              <div class="mockup-main-panel">
                <div class="mockup-kpi-row">
                  <div class="mockup-kpi-card">
                    <div class="mockup-kpi-label">
                      ${Icons.checkCircle(13)}
                      <span>Liquidado hoje</span>
                    </div>
                    <div class="mockup-kpi-val"><span class="landing-animated-counter" data-target="12450" data-suffix=" DePix">12.450 DePix</span></div>
                    <div style="font-size:0.68rem; color:#2dd4bf; margin-top:2px;">100% em custódia própria</div>
                  </div>

                  <div class="mockup-kpi-card">
                    <div class="mockup-kpi-label">
                      ${Icons.repeat(13)}
                      <span>Tempo médio</span>
                    </div>
                    <div class="mockup-kpi-val">~ <span class="landing-animated-counter" data-target="18" data-suffix=" seg">18 seg</span></div>
                    <div style="font-size:0.68rem; color:#64748b; margin-top:2px;">Pix → Confirmação Liquid</div>
                  </div>

                  <div class="mockup-kpi-card">
                    <div class="mockup-kpi-label">
                      ${Icons.shield(13)}
                      <span>Custódia ROM</span>
                    </div>
                    <div class="mockup-kpi-val" style="color:#2dd4bf;">R$ 0,00</div>
                    <div style="font-size:0.68rem; color:#94a3b8; margin-top:2px;">Arquitetura sem retenção</div>
                  </div>
                </div>

                <div class="mockup-table-card">
                  <div class="mockup-table-header">
                    <span class="mockup-table-title">Histórico de liquidações recentes</span>
                    <span style="font-size:0.7rem; color:#64748b; font-family:var(--font-mono);">Liquid Network Sidechain</span>
                  </div>

                  <div class="mockup-tx-list">
                    <div class="mockup-tx-item">
                      <div class="mockup-tx-left">
                        <div class="mockup-tx-icon">${Icons.checkCircle(14)}</div>
                        <div>
                          <div class="mockup-tx-desc">Liquidação Comercial #8492</div>
                          <div class="mockup-tx-time">Hoje às 14:32 • Bloco Liquid #2.981.402</div>
                        </div>
                      </div>
                      <div class="mockup-tx-right">
                        <div class="mockup-tx-val tabular-nums val-cyan-highlight">+ 3.200,00 DePix</div>
                        <span class="mockup-badge-liquidated"><span class="status-dot status-dot-emerald" style="width:5px; height:5px;"></span> Liquidado</span>
                      </div>
                    </div>

                    <div class="mockup-tx-item">
                      <div class="mockup-tx-left">
                        <div class="mockup-tx-icon">${Icons.checkCircle(14)}</div>
                        <div>
                          <div class="mockup-tx-desc">Pagamento Fornecedor #8491</div>
                          <div class="mockup-tx-time">Hoje às 13:10 • Bloco Liquid #2.981.365</div>
                        </div>
                      </div>
                      <div class="mockup-tx-right">
                        <div class="mockup-tx-val tabular-nums val-cyan-highlight">+ 850,00 DePix</div>
                        <span class="mockup-badge-liquidated"><span class="status-dot status-dot-emerald" style="width:5px; height:5px;"></span> Liquidado</span>
                      </div>
                    </div>

                    <div class="mockup-tx-item">
                      <div class="mockup-tx-left">
                        <div class="mockup-tx-icon" style="color:var(--accent-amber); background:var(--accent-amber-subtle);">${Icons.repeat(14)}</div>
                        <div>
                          <div class="mockup-tx-desc">Ordem de Recebimento #8490</div>
                          <div class="mockup-tx-time">Hoje às 12:45 • Aguardando Pix</div>
                        </div>
                      </div>
                      <div class="mockup-tx-right">
                        <div class="mockup-tx-val tabular-nums" style="color:#94a3b8;">1.850,00 DePix</div>
                        <span class="mockup-badge-waiting"><span class="status-dot status-dot-amber" style="width:5px; height:5px;"></span> Pendente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mockup-demo-watermark">dados puramente ilustrativos para demonstração de interface</div>
          </div>
        </div>
      </section>

      <hr class="section-divider" aria-hidden="true" />

      <!-- 1. SEÇÃO: APRESENTAÇÃO PREMIUM -->
      <section class="landing-section">
        <div class="presentation-card">
          <div class="presentation-grid">
            <div class="presentation-text">
              <span class="section-tag">Apresentação Institucional</span>
              <h3>Engenharia financeira desenhada para autonomia e precisão.</h3>
              <p>
                A ROM atua como uma camada inteligente de infraestrutura para operações comerciais contemporâneas. Ao conectar os trilhos instantâneos do Pix à sidechain Liquid do ecossistema Bitcoin, garantimos que suas cobranças comerciais sejam convertidas em DePix e entregues diretamente às suas chaves privadas, com previsibilidade e total segregação operacional.
              </p>
              <div class="presentation-stats-row">
                <div>
                  <div class="presentation-stat-num">DePix</div>
                  <div class="presentation-stat-label">Paridade 1:1 BRL</div>
                </div>
                <div>
                  <div class="presentation-stat-num">Liquid</div>
                  <div class="presentation-stat-label">Sidechain Bitcoin</div>
                </div>
                <div>
                  <div class="presentation-stat-num">0%</div>
                  <div class="presentation-stat-label">Custódia pela ROM</div>
                </div>
              </div>
            </div>

            <div class="presentation-visual">
              <div style="font-size:0.75rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">
                Fluxo Arquitetural Unidirecional
              </div>

              <div class="arch-flow-item">
                <div class="arch-flow-icon">${Icons.receipt(16)}</div>
                <div>
                  <div style="font-weight:600; color:#f1f5f9;">1. Pagador emite Pix</div>
                  <div style="font-size:0.72rem; color:#64748b;">Qualquer banco ou instituição participante</div>
                </div>
              </div>

              <div class="arch-flow-arrow">↓</div>

              <div class="arch-flow-item">
                <div class="arch-flow-icon" style="color:#38bdf8; background:rgba(56,189,248,0.1);">${Icons.zap(16)}</div>
                <div>
                  <div style="font-weight:600; color:#f1f5f9;">2. Provedores parceiros liquidam</div>
                  <div style="font-size:0.72rem; color:#64748b;">Conversão automatizada para DePix</div>
                </div>
              </div>

              <div class="arch-flow-arrow">↓</div>

              <div class="arch-flow-item" style="border-color:rgba(20, 184, 166, 0.4); background:rgba(20, 184, 166, 0.05);">
                <div class="arch-flow-icon">${Icons.wallet(16)}</div>
                <div>
                  <div style="font-weight:600; color:#2dd4bf;">3. Sua Carteira Liquid</div>
                  <div style="font-size:0.72rem; color:#94a3b8;">SideSwap, Blockstream Green ou hardware wallet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="section-divider" aria-hidden="true" />

      <!-- 2. SEÇÃO: BENEFÍCIOS EM QUATRO CARDS ELEGANTES -->
      <section class="landing-section" style="padding-top:20px;">
        <div class="section-header-premium">
          <span class="section-tag">Diferenciais Operacionais</span>
          <h2>Segurança e controle construídos sob medida</h2>
          <p>Uma proposta pensada para quem exige confiabilidade institucional e resguardo patrimonial.</p>
        </div>

        <div class="grid-4-benefits">
          <!-- Card 1: Privacidade operacional -->
          <div class="benefit-card-premium">
            <div class="benefit-card-header">
              <div class="benefit-icon-wrapper">
                ${Icons.lock(20)}
              </div>
              <span class="benefit-card-order">01</span>
            </div>
            <h3 class="benefit-card-title">Privacidade operacional</h3>
            <p class="benefit-card-desc">
              Segregação rigorosa de fluxos com comunicação silenciosa e sem cruzamento indevido de metadados operacionais do seu negócio.
            </p>
          </div>

          <!-- Card 2: Recebimento na rede Liquid -->
          <div class="benefit-card-premium">
            <div class="benefit-card-header">
              <div class="benefit-icon-wrapper">
                ${Icons.zap(20)}
              </div>
              <span class="benefit-card-order">02</span>
            </div>
            <h3 class="benefit-card-title">Recebimento na rede Liquid</h3>
            <p class="benefit-card-desc">
              Liquidação em DePix na confiável sidechain do Bitcoin, com blocos determinísticos a cada minuto e transações confidenciais.
            </p>
          </div>

          <!-- Card 3: Arquitetura sem custódia da ROM -->
          <div class="benefit-card-premium">
            <div class="benefit-card-header">
              <div class="benefit-icon-wrapper">
                ${Icons.shield(20)}
              </div>
              <span class="benefit-card-order">03</span>
            </div>
            <h3 class="benefit-card-title">Arquitetura sem custódia da ROM</h3>
            <p class="benefit-card-desc">
              A ROM não custodia nem retém recursos. Os valores convertidos são transmitidos diretamente ao seu endereço cadastrado.
            </p>
          </div>

          <!-- Card 4: Gestão simplificada de cobranças -->
          <div class="benefit-card-premium">
            <div class="benefit-card-header">
              <div class="benefit-icon-wrapper">
                ${Icons.receipt(20)}
              </div>
              <span class="benefit-card-order">04</span>
            </div>
            <h3 class="benefit-card-title">Gestão simplificada de cobranças</h3>
            <p class="benefit-card-desc">
              Painel objetivo para gerar cobranças avulsas, links compartilháveis, conciliação de liquidações e histórico unificado.
            </p>
          </div>
        </div>
      </section>

      <hr class="section-divider" aria-hidden="true" />

      <!-- 3. SEÇÃO: COMO FUNCIONA (PASSOS EXATOS DO USUÁRIO) -->
      <section class="landing-section">
        <div class="section-header-premium">
          <span class="section-tag">Fluxo Operacional</span>
          <h2>Como funciona</h2>
          <p>Quatro etapas diretas entre o faturamento da sua venda e a disponibilidade na sua custódia.</p>
        </div>

        <div class="steps-timeline-grid">
          <!-- Passo 1 -->
          <div class="step-card-premium">
            <div class="step-number-badge">01</div>
            <h3 class="step-card-title">Crie sua conta</h3>
            <p class="step-card-desc">
              Acesso descomplicado ao painel ROM para configurar seu ambiente de faturamento e emitir cobranças.
            </p>
          </div>

          <!-- Passo 2 -->
          <div class="step-card-premium">
            <div class="step-number-badge">02</div>
            <h3 class="step-card-title">Cadastre sua carteira SideSwap/Liquid</h3>
            <p class="step-card-desc">
              Indique o endereço da sua carteira (iniciados com <code>lq1</code> ou <code>ex1</code>) para onde seus DePix serão remetidos.
            </p>
          </div>

          <!-- Passo 3 -->
          <div class="step-card-premium">
            <div class="step-number-badge">03</div>
            <h3 class="step-card-title">Gere um link Pix</h3>
            <p class="step-card-desc">
              Defina o valor em reais. O sistema gera a instrução de pagamento instantâneo com conciliação individualizada.
            </p>
          </div>

          <!-- Passo 4 -->
          <div class="step-card-premium">
            <div class="step-number-badge">04</div>
            <h3 class="step-card-title">Acompanhe o recebimento</h3>
            <p class="step-card-desc">
              Assim que o Pix for pago, o parceiro integrado liquida os DePix diretamente na sua carteira Liquid cadastrada.
            </p>
          </div>
        </div>
      </section>

      <hr class="section-divider" aria-hidden="true" />

      <!-- 4. SEÇÃO: PAINEL ILUSTRATIVO COM TRANSAÇÕES E STATUS -->
      <section class="landing-section" style="padding-top:20px;">
        <div class="section-header-premium">
          <span class="section-tag">Experiência de Uso</span>
          <h2>Painel ilustrativo com transações e status</h2>
          <p>Visão clara e em tempo real sobre cada cobrança, status de processamento e liquidações na rede Liquid.</p>
        </div>

        <div class="dashboard-preview-card">
          <!-- Topo do Painel Ilustrativo -->
          <div class="dash-preview-topbar">
            <div style="display:flex; align-items:center; gap:10px;">
              ${Icons.logo(22)}
              <span style="font-weight:700; font-size:0.85rem; color:#ffffff; letter-spacing:0.04em;">ROM CONSOLE</span>
              <span class="mockup-amount-tag" style="font-size:0.62rem;">VISUALIZAÇÃO DE INTERFACE</span>
            </div>
            <div style="display:flex; align-items:center; gap:14px; font-size:0.75rem; color:#64748b; font-family:var(--font-mono);">
              <span class="liquid-status-badge">
                <span class="status-dot status-dot-green" style="width:6px; height:6px;"></span>
                liquid-network: online
              </span>
              <span style="color:#2dd4bf;">•</span>
              <span>bloco: #2.981.415</span>
            </div>
          </div>

          <!-- Conteúdo em colunas -->
          <div class="dash-preview-content">
            <!-- Coluna Maior: Métricas + Tabela -->
            <div>
              <div class="dash-preview-metrics">
                <div class="dash-metric-box">
                  <div class="dash-metric-label">
                    <span>Total Liquidado</span>
                    ${Icons.checkCircle(14)}
                  </div>
                  <div class="dash-metric-val"><span class="landing-animated-counter" data-target="48320" data-format="currency" data-suffix=" DePix">48.320,00 DePix</span></div>
                  <div class="dash-metric-sub">
                    ${Icons.zap(12)}
                    <span>Equivalente a R$ 48.320,00</span>
                  </div>
                </div>

                <div class="dash-metric-box">
                  <div class="dash-metric-label">
                    <span>Taxa de Liquidação</span>
                    ${Icons.repeat(14)}
                  </div>
                  <div class="dash-metric-val"><span class="landing-animated-counter" data-target="99.8" data-decimal="1" data-suffix="%">99,8%</span></div>
                  <div class="dash-metric-sub">
                    ${Icons.checkCircle(12)}
                    <span>Tempo médio de 18s</span>
                  </div>
                </div>
              </div>

              <!-- Lista de cobranças com status -->
              <div class="mockup-table-card">
                <div class="mockup-table-header">
                  <span class="mockup-table-title">Monitor de Cobranças em Andamento</span>
                  <span style="font-size:0.7rem; color:#64748b;">Parceiros Integrados</span>
                </div>

                <div class="mockup-tx-list">
                  <div class="mockup-tx-item">
                    <div class="mockup-tx-left">
                      <div class="mockup-tx-icon">${Icons.checkCircle(14)}</div>
                      <div>
                        <div class="mockup-tx-desc">Cobrança Consultoria #9921</div>
                        <div class="mockup-tx-time">Confirmada no Pix • Liquidada em lq1qq2m8...</div>
                      </div>
                    </div>
                    <div class="mockup-tx-right">
                      <div class="mockup-tx-val tabular-nums val-cyan-highlight">R$ 5.400,00</div>
                      <span class="mockup-badge-liquidated"><span class="status-dot status-dot-emerald" style="width:5px; height:5px;"></span> Liquidado</span>
                    </div>
                  </div>

                  <div class="mockup-tx-item">
                    <div class="mockup-tx-left">
                      <div class="mockup-tx-icon">${Icons.checkCircle(14)}</div>
                      <div>
                        <div class="mockup-tx-desc">Licença de Software #9920</div>
                        <div class="mockup-tx-time">Confirmada no Pix • Liquidada em lq1qq2m8...</div>
                      </div>
                    </div>
                    <div class="mockup-tx-right">
                      <div class="mockup-tx-val tabular-nums val-cyan-highlight">R$ 1.250,00</div>
                      <span class="mockup-badge-liquidated"><span class="status-dot status-dot-emerald" style="width:5px; height:5px;"></span> Liquidado</span>
                    </div>
                  </div>

                  <div class="mockup-tx-item">
                    <div class="mockup-tx-left">
                      <div class="mockup-tx-icon" style="color:var(--accent-amber); background:var(--accent-amber-subtle);">${Icons.repeat(14)}</div>
                      <div>
                        <div class="mockup-tx-desc">Fatura Corporativa #9919</div>
                        <div class="mockup-tx-time">QR Code gerado • Expira em 25 minutos</div>
                      </div>
                    </div>
                    <div class="mockup-tx-right">
                      <div class="mockup-tx-val tabular-nums" style="color:#94a3b8;">R$ 9.800,00</div>
                      <span class="mockup-badge-waiting"><span class="status-dot status-dot-amber" style="width:5px; height:5px;"></span> Aguardando Pix</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Coluna Menor: Painel Lateral de Status -->
            <div class="dash-preview-sidebar-box">
              <div style="font-size:0.75rem; color:#cbd5e1; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">
                Carteira Primária Vinculada
              </div>

              <div style="background:#070b12; border:1px solid #1a2536; border-radius:var(--radius-md); padding:12px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                  <span style="font-size:0.72rem; color:#64748b;">Rótulo</span>
                  <span class="mockup-amount-tag" style="font-size:0.65rem;">SideSwap</span>
                </div>
                <div style="font-family:var(--font-mono); font-size:0.72rem; color:#e2e8f0; word-break:break-all;">
                  lq1qq2m8x9p2z84k2m7d3c0v1a8j3w9f...
                </div>
              </div>

              <div style="border-top:1px solid #1a2536; padding-top:12px;">
                <div style="font-size:0.72rem; color:#64748b; margin-bottom:8px; font-weight:500;">
                  Arquitetura de Segurança
                </div>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.75rem; color:#94a3b8;">
                  <li style="display:flex; align-items:center; gap:6px;">
                    ${Icons.shield(13)}
                    <span>Chaves privadas retidas no seu dispositivo</span>
                  </li>
                  <li style="display:flex; align-items:center; gap:6px;">
                    ${Icons.checkCircle(13)}
                    <span>Sem retenção de saldo na plataforma ROM</span>
                  </li>
                  <li style="display:flex; align-items:center; gap:6px;">
                    ${Icons.lock(13)}
                    <span>Criptografia de ponta a ponta</span>
                  </li>
                </ul>
              </div>

              <div style="margin-top:auto; padding-top:12px; border-top:1px solid #1a2536;">
                <a href="#/criar-conta" class="btn btn-premium-teal btn-sm" style="width:100%; justify-content:center;">
                  Explorar no painel
                </a>
              </div>
            </div>
          </div>

          <div class="mockup-demo-watermark">dados fictícios para demonstração visual de produto</div>
        </div>
      </section>

      <!-- 5. SEÇÃO: CHAMADA FINAL (TEXTO EXATO VERBATIM) -->
      <section class="final-cta-section">
        <div class="final-cta-box">
          <h2 class="final-cta-title">Uma nova experiência para receber seus pagamentos.</h2>
          <p class="final-cta-desc">
            Pronto para receber via Pix diretamente na sua carteira Liquid, com discrição tecnológica, autonomia e sem intermediações desnecessárias.
          </p>
          <div class="final-cta-actions">
            <a href="#/criar-conta" class="btn btn-premium-teal btn-lg hero-cta-btn">Criar conta grátis</a>
            <a href="#/entrar" class="btn btn-premium-dark btn-lg">Acessar painel</a>
          </div>
        </div>
      </section>

      <!-- 6. RODAPÉ PÚBLICO COM LINKS REQUISITADOS -->
      <footer class="landing-footer-refined">
        <div class="landing-footer-inner">
          <div class="footer-top-row">
            <a href="#/" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
              ${Icons.logo(26)}
              <span style="font-family:var(--font-display); font-size:1.05rem; font-weight:700; color:#ffffff; letter-spacing:0.06em;">ROM</span>
            </a>

            <!-- Links obrigatórios: Termos, Privacidade, Entrar e Criar conta -->
            <div class="footer-links-group">
              <a href="#/privacidade" class="footer-link-item">Termos</a>
              <a href="#/privacidade" class="footer-link-item">Privacidade</a>
              <a href="#/entrar" class="footer-link-item">Entrar</a>
              <a href="#/criar-conta" class="footer-link-item">Criar conta</a>
            </div>
          </div>

          <div class="footer-bottom-row">
            <p class="footer-disclaimer-text">
              Cobranças reais dependem da integração e aprovação do provedor. A ROM é uma plataforma tecnológica de interface para orquestração de cobranças e liquidação direta em rede Liquid por parceiros integrados.
            </p>
            <p class="footer-copy-text">
              ROM © 2025 — Infraestrutura de Recebimentos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `
}

/**
 * Inicialização de Animações Específicas da Landing:
 * - Revelar seções ao rolar com IntersectionObserver (uma vez só, sem retrigger)
 * - Contadores numéricos animados decorativos (respeitando prefers-reduced-motion)
 * - Parallax suave no mouse sobre o card ilustrativo do console
 */
export function initLandingAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 1. Reveal on scroll (uma vez só)
  const revealElements = document.querySelectorAll(
    '.landing-section, .landing-hero, .final-cta-section',
  )
  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    revealElements.forEach((el) => {
      el.classList.add('reveal-on-scroll')
      revealObserver.observe(el)
    })
  } else {
    // Fallback ou prefers-reduced-motion: exibe direto
    revealElements.forEach((el) => el.classList.add('is-revealed'))
  }

  // 2. Contadores numéricos animados decorativos (somente na landing)
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const counterElements = document.querySelectorAll('.landing-animated-counter')
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            animateCounter(el)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.2 },
    )

    counterElements.forEach((el) => counterObserver.observe(el))
  }

  // 3. Parallax 3D suave no mouse sobre o card ilustrativo do console
  const consoleMockup = document.getElementById('hero-console-mockup')
  if (consoleMockup && !prefersReduced) {
    const handleMouseMove = (e) => {
      const rect = consoleMockup.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -4.5 // Max ~4.5deg
      const rotateY = ((x - centerX) / centerX) * 4.5

      consoleMockup.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`
    }

    const handleMouseLeave = () => {
      consoleMockup.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)'
    }

    consoleMockup.addEventListener('mousemove', handleMouseMove)
    consoleMockup.addEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Função utilitária para contagem suave de 0 até o valor decorativo
 */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target') || '0')
  const suffix = el.getAttribute('data-suffix') || ''
  const isCurrency = el.getAttribute('data-format') === 'currency'
  const decimalPlaces = parseInt(el.getAttribute('data-decimal') || '0', 10)
  const duration = 1600 // ms
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Easing out cubic: 1 - pow(1 - progress, 3)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    const currentVal = target * easeProgress

    let formatted = ''
    if (isCurrency) {
      // Formato brasileiro: 48.320,00
      formatted = currentVal.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    } else if (decimalPlaces > 0) {
      formatted = currentVal.toLocaleString('pt-BR', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
    } else {
      formatted = Math.floor(currentVal).toLocaleString('pt-BR')
    }

    el.textContent = `${formatted}${suffix}`

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}
