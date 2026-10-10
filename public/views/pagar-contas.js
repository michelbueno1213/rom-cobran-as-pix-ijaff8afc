/**
 * View: Pagar Contas (#/pagar-contas)
 * Boletos e Pix Cobrança / QR Code pagos com DePix na rede Liquid
 * Duas abas: "Boletos" (código de barras / 47 dígitos FEBRABAN) e "Pix Cobrança / QR Code"
 * Pagamento com DePix na carteira Liquid
 * Botão "Pagar Agora" -> Mensagem exata "Em breve" (toast âmbar + banner)
 * Estado vazio ilustrado
 */

import { Icons } from '../icons.js'
import { attachBrlMask } from '../utils.js'
import { Store } from '../store.js'
import { showEmBreveToast } from '../toast.js'

let activeTab = 'boletos' // 'boletos' | 'pix'

export function renderPagarContasView(currentUser) {
  const payments = Store.getBillPayments(currentUser.id)

  return `
    <div style="max-width:760px; margin:0 auto; display:flex; flex-direction:column; gap:22px;">
      <div>
        <h1 style="margin-bottom:6px;">Pagar Contas</h1>
        <p>Pague boletos e QR Codes Pix direto da sua carteira, sem sair da ROM.</p>
      </div>

      <!-- BANNER EXPLICATIVO -->
      <div class="banner-amber">
        ${Icons.alertTriangle(22)}
        <div>
          <strong style="display:block; margin-bottom:2px; color:#fde68a;">Pagamentos de contas e convênios</strong>
          <span>Pague boletos e QR Codes Pix direto da sua carteira, sem sair da ROM. Em breve: geração de cobranças Pix. Estamos finalizando nossa integração com a provedora de pagamentos.</span>
        </div>
      </div>

      <!-- ABAS -->
      <div style="display:flex; border-bottom:1px solid var(--border-subtle); gap:16px;">
        <button
          type="button"
          id="tab-btn-boletos"
          class="btn"
          style="background:transparent; border:none; border-bottom:2px solid ${
            activeTab === 'boletos' ? 'var(--accent-emerald)' : 'transparent'
          }; border-radius:0; color:${activeTab === 'boletos' ? 'var(--accent-emerald)' : 'var(--text-muted)'}; padding:10px 16px; font-weight:600;"
        >
          ${Icons.receipt(18)} Boletos
        </button>
        <button
          type="button"
          id="tab-btn-pix"
          class="btn"
          style="background:transparent; border:none; border-bottom:2px solid ${
            activeTab === 'pix' ? 'var(--accent-emerald)' : 'transparent'
          }; border-radius:0; color:${activeTab === 'pix' ? 'var(--accent-emerald)' : 'var(--text-muted)'}; padding:10px 16px; font-weight:600;"
        >
          ${Icons.qrCode(18)} Pix Cobrança / QR Code
        </button>
      </div>

      <!-- CARD DO FORMULÁRIO -->
      <div class="card">
        ${
          activeTab === 'boletos'
            ? `
          <h2 class="card-title">${Icons.receipt(20)} Pagamento de Boleto Bancário</h2>
          <p class="card-desc">Digite ou cole a linha digitável do boleto (47 dígitos FEBRABAN).</p>

          <form id="form-pagar-boleto" novalidate>
            <div class="form-group">
              <label class="form-label" for="boleto-codigo">Linha digitável / Código de barras</label>
              <input
                type="text"
                id="boleto-codigo"
                class="form-input"
                placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000"
                maxlength="54"
                required
              />
              <span class="form-hint">Aceita boletos de cobrança e convênios (água, luz, telefone, tributos).</span>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;" class="config-grid">
              <div class="form-group">
                <label class="form-label" for="boleto-valor">Valor a pagar (R$)</label>
                <input type="text" id="boleto-valor" class="form-input" value="R$ 0,00" required />
              </div>

              <div class="form-group">
                <label class="form-label">Pagar com</label>
                <div style="display:flex; align-items:center; height:42px; padding:0 14px; background:rgba(11, 18, 32, 0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md); font-weight:600; font-size:0.9rem; color:var(--text-main);">
                  DePix (Liquid)
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; height:46px; margin-top:12px; font-size:0.95rem;">
              Pagar Agora
            </button>
          </form>
        `
            : `
          <h2 class="card-title">${Icons.qrCode(20)} Pagamento de Pix Cobrança</h2>
          <p class="card-desc">Cole o código Pix Copia e Cola ou informe a chave Pix da cobrança.</p>

          <form id="form-pagar-pix" novalidate>
            <div class="form-group">
              <label class="form-label" for="pix-payload">Código Pix Copia e Cola / Payload</label>
              <textarea
                id="pix-payload"
                class="form-textarea"
                rows="3"
                placeholder="00020126580014br.gov.bcb.pix..."
                required
              ></textarea>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;" class="config-grid">
              <div class="form-group">
                <label class="form-label" for="pix-valor">Valor (R$)</label>
                <input type="text" id="pix-valor" class="form-input" value="R$ 0,00" required />
              </div>

              <div class="form-group">
                <label class="form-label">Pagar com</label>
                <div style="display:flex; align-items:center; height:42px; padding:0 14px; background:rgba(11, 18, 32, 0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md); font-weight:600; font-size:0.9rem; color:var(--text-main);">
                  DePix (Liquid)
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; height:46px; margin-top:12px; font-size:0.95rem;">
              Pagar Agora
            </button>
          </form>
        `
        }
      </div>

      <!-- LISTA DE PAGAMENTOS REALIZADOS (ESTADO VAZIO) -->
      <div class="card">
        <h3 class="card-title">Histórico de pagamentos de contas</h3>
        <p class="card-desc">Boletos e Pix liquidados diretamente em DePix da sua carteira Liquid</p>

        ${
          payments.length === 0
            ? `
          <div class="empty-state">
            ${Icons.emptyCoins(64)}
            <h4 class="empty-state-title">Nenhum pagamento realizado</h4>
            <p class="empty-state-desc">Nenhum pagamento realizado. Quando a integração estiver ativa, os pagamentos aparecem aqui.</p>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${payments
              .map(
                (p) => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(11, 18, 32, 0.5); border-radius:var(--radius-md);">
                <div>
                  <strong style="display:block; font-size:0.9rem;">${p.descricao || 'Boleto'}</strong>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${p.codigo || '-'}</span>
                </div>
                <div style="text-align:right;">
                  <strong style="color:var(--text-main);">${p.valor}</strong>
                  <span class="badge badge-amber" style="display:block; margin-top:4px;">Aguardando Envio</span>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        `
        }
      </div>
    </div>
  `
}

export function initPagarContasEvents(currentUser, reRender) {
  const tabBoletos = document.getElementById('tab-btn-boletos')
  const tabPix = document.getElementById('tab-btn-pix')

  if (tabBoletos) {
    tabBoletos.addEventListener('click', () => {
      activeTab = 'boletos'
      reRender()
    })
  }
  if (tabPix) {
    tabPix.addEventListener('click', () => {
      activeTab = 'pix'
      reRender()
    })
  }

  const boletoValor = document.getElementById('boleto-valor')
  if (boletoValor) attachBrlMask(boletoValor)

  const pixValor = document.getElementById('pix-valor')
  if (pixValor) attachBrlMask(pixValor)

  // Máscara linha digitável do boleto
  const boletoCodigo = document.getElementById('boleto-codigo')
  if (boletoCodigo) {
    boletoCodigo.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '')
      if (v.length > 47) v = v.slice(0, 47)
      // Formata em blocos: 5-5 5-6 5-6 1 14
      if (v.length > 33) {
        v = `${v.slice(0, 5)}.${v.slice(5, 10)} ${v.slice(10, 15)}.${v.slice(15, 21)} ${v.slice(21, 26)}.${v.slice(26, 32)} ${v.slice(32, 33)} ${v.slice(33)}`
      } else if (v.length > 21) {
        v = `${v.slice(0, 5)}.${v.slice(5, 10)} ${v.slice(10, 15)}.${v.slice(15, 21)} ${v.slice(21, 26)}.${v.slice(26)}`
      } else if (v.length > 10) {
        v = `${v.slice(0, 5)}.${v.slice(5, 10)} ${v.slice(10, 15)}.${v.slice(15)}`
      } else if (v.length > 5) {
        v = `${v.slice(0, 5)}.${v.slice(5)}`
      }
      e.target.value = v
    })
  }

  // Submissão bloqueada com mensagem exata
  const formBoleto = document.getElementById('form-pagar-boleto')
  if (formBoleto) {
    formBoleto.addEventListener('submit', (e) => {
      e.preventDefault()
      showEmBreveToast()
    })
  }

  const formPix = document.getElementById('form-pagar-pix')
  if (formPix) {
    formPix.addEventListener('submit', (e) => {
      e.preventDefault()
      showEmBreveToast()
    })
  }
}
