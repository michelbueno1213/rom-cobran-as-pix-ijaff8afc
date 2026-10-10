/**
 * View: Página Pública de Pagamento (#/pagar/{id})
 * SEM login, somente leitura, acessível por qualquer um
 * Busca varrendo cobranças de todos os usuários (homologação e produção)
 * Cobrança de homologação (is_simulated):
 *   - Banner âmbar: "Cobrança de homologação — ambiente de teste. Esta não é uma cobrança real."
 *   - Placeholder tracejado: "O QR Code será exibido aqui em cobranças reais." (NUNCA QR fictício)
 * Cobrança real (sem QR):
 *   - Mostrar a mensagem "Em breve" exata
 * ID inexistente: "Cobrança não encontrada."
 * Nenhum botão de ação
 */

import { Icons } from '../icons.js'
import { MSG_EM_BREVE, formatBrl, formatDate } from '../utils.js'
import { Store } from '../store.js'

export function renderPagarView(chargeId) {
  const result = Store.findChargeById(chargeId)

  // Caso 1: ID inexistente
  if (!result || !result.charge) {
    return `
      <div class="payment-page">
        <div class="payment-card" style="text-align:center;">
          <div style="color:var(--accent-red); margin-bottom:14px;">
            ${Icons.alertTriangle(48)}
          </div>
          <h2 style="margin-bottom:8px;">Cobrança não encontrada.</h2>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:20px;">
            O link de pagamento informado não existe, expirou ou foi cancelado pelo comerciante.
          </p>
          <a href="#/" class="btn btn-outline btn-sm">Voltar ao início</a>
        </div>
      </div>
    `
  }

  const { charge, ownerName, isHomolog } = result
  const status = charge.status || 'Aguardando Pagamento'

  // Linha do tempo: "Aguardando pagamento → Pix Confirmado → DePix Enviado"
  const isAguardando = status === 'Aguardando Pagamento'
  const isPixConfirmado = status === 'Pix Confirmado'
  const isDePixEnviado = status === 'DePix Enviado'

  const step1Class = 'completed'
  const step2Class = isPixConfirmado || isDePixEnviado ? 'completed' : isAguardando ? 'active' : ''
  const step3Class = isDePixEnviado ? 'completed' : ''

  return `
    <div class="payment-page">
      <div class="payment-card">
        <!-- HEADER DA COBRANÇA -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:16px;">
          <div style="display:flex; align-items:center; gap:10px;">
            ${Icons.logo(30)}
            <div>
              <strong style="display:block; font-size:1.05rem; color:var(--text-main);">ROM — Pagamento seguro</strong>
              <span style="font-size:0.75rem; color:var(--accent-emerald);">Liquidação em DePix na rede Liquid</span>
            </div>
          </div>
          ${
            isHomolog
              ? '<span class="badge badge-amber" style="font-size:0.68rem;"><span class="status-dot status-dot-amber"></span>Teste</span>'
              : '<span class="badge badge-green" style="font-size:0.68rem;"><span class="status-dot status-dot-green"></span>Oficial</span>'
          }
        </div>

        <!-- BANNER SE FOR HOMOLOGAÇÃO -->
        ${
          isHomolog
            ? `
          <div class="banner-amber" style="margin-bottom:20px; border-left:4px solid var(--accent-amber);">
            ${Icons.alertTriangle(20)}
            <div>
              <strong style="display:block; color:#fde68a; font-size:0.85rem;">Atenção: Modo Simulado</strong>
              <span>Cobrança de homologação — ambiente de teste. Esta não é uma cobrança real.</span>
            </div>
          </div>
        `
            : `
          <div class="banner-amber" style="margin-bottom:20px;">
            ${Icons.alertTriangle(20)}
            <span>${MSG_EM_BREVE}</span>
          </div>
        `
        }

        <!-- DETALHES DO COMERCIANTE E VALOR -->
        <div style="text-align:center; margin-bottom:20px;">
          <span style="font-size:0.82rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Beneficiário</span>
          <h3 style="font-size:1.15rem; color:var(--text-main); margin-top:2px;">${ownerName}</h3>

          <div style="font-size:2.4rem; font-weight:800; color:#ffffff; letter-spacing:-0.02em; margin:10px 0;">
            ${formatBrl(charge.valor)}
          </div>

          ${
            charge.descricao
              ? `
            <p style="font-size:0.88rem; color:var(--text-muted); background:rgba(11, 18, 32, 0.4); padding:8px 12px; border-radius:var(--radius-md); display:inline-block;">
              ${charge.descricao}
            </p>
          `
              : ''
          }
        </div>

        <!-- LINHA DO TEMPO: "Aguardando pagamento → Pix Confirmado → DePix Enviado" -->
        <div style="margin:24px 0 16px 0;">
          <span style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:12px; text-align:center;">
            Status do Fluxo de Liquidação:
          </span>

          <div class="timeline">
            <!-- Barra de progresso preenchida dinamicamente conforme status -->
            <div class="timeline-progress-bar" style="width: ${isDePixEnviado ? 'calc(100% - 48px)' : isPixConfirmado ? '50%' : '0%'};"></div>

            <div class="timeline-step ${step1Class}">
              <div class="timeline-dot">1</div>
              <span class="timeline-label">Aguardando pagamento</span>
            </div>

            <div class="timeline-step ${step2Class}">
              <div class="timeline-dot">2</div>
              <span class="timeline-label">Pix Confirmado</span>
            </div>

            <div class="timeline-step ${step3Class}">
              <div class="timeline-dot">3</div>
              <span class="timeline-label">DePix Enviado</span>
            </div>
          </div>
        </div>

        <!-- ÁREA DO QR CODE / PLACEHOLDER (NUNCA QR FICTÍCIO) -->
        ${
          isHomolog
            ? `
          <div class="qr-placeholder">
            <div style="color:var(--accent-emerald); opacity:0.8; margin-bottom:12px;">
              ${Icons.qrCode(48)}
            </div>
            <strong style="display:block; color:var(--text-main); font-size:0.95rem; margin-bottom:4px;">
              O QR Code será exibido aqui em cobranças reais.
            </strong>
            <p style="font-size:0.78rem; color:var(--text-muted); max-width:320px; margin:0 auto; line-height:1.4;">
              Em ambiente de homologação, nenhum código Pix Copia e Cola ou QR Code dinâmico é sintetizado.
            </p>
          </div>
        `
            : `
          <div class="qr-placeholder">
            <div style="color:var(--accent-amber); opacity:0.8; margin-bottom:12px;">
              ${Icons.alertTriangle(40)}
            </div>
            <p style="font-size:0.85rem; color:#fde68a; line-height:1.4;">
              ${MSG_EM_BREVE}
            </p>
          </div>
        `
        }

        <!-- DETALHES ADICIONAIS SOMENTE LEITURA (SEM BOTÕES DE AÇÃO) -->
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:6px; font-size:0.78rem; color:var(--text-muted);">
          <div style="display:flex; justify-content:space-between;">
            <span>Identificador da Ordem:</span>
            <code style="font-family:monospace; color:var(--text-main);">${charge.id}</code>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Criado em:</span>
            <span style="color:var(--text-main);">${formatDate(charge.createdAt)}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Protocolo de Liquidação:</span>
            <span style="color:var(--accent-emerald); font-weight:600;">Liquid Network DePix</span>
          </div>
        </div>
      </div>
    </div>
  `
}
