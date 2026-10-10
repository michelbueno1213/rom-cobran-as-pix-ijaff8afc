/**
 * View: Cupons (#/cupons)
 * Paridade DeFlow: Códigos promocionais para desconto em links de pagamento
 * Formulário: Código (maiúsculas, sem espaços), Tipo (Percentual / Valor fixo), Valor, Limite de usos (opcional), Validade (opcional)
 * Criação bloqueada com mensagem exata "Em breve" (toast âmbar + banner)
 * Estado vazio: "Crie cupons para dar desconto em links de pagamento — em breve."
 */

import { Icons } from '../icons.js'
import { attachBrlMask } from '../utils.js'
import { Store } from '../store.js'
import { showEmBreveToast } from '../toast.js'

let isFormOpen = false
let couponType = 'percentual' // 'percentual' | 'fixo'

export function renderCuponsView(currentUser) {
  const coupons = Store.getCoupons(currentUser.id)

  return `
    <div style="max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:22px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
        <div>
          <h1 style="margin-bottom:6px;">Cupons Promocionais</h1>
          <p>Crie códigos promocionais para aplicar descontos em cobranças e links de pagamento.</p>
        </div>

        <button type="button" id="btn-toggle-coupon-form" class="btn btn-primary btn-sm">
          ${Icons.tag(16)}
          ${isFormOpen ? 'Fechar formulário' : 'Criar cupom'}
        </button>
      </div>

      <!-- BANNER EXPLICATIVO -->
      <div class="banner-amber">
        ${Icons.alertTriangle(22)}
        <div>
          <strong style="display:block; margin-bottom:2px; color:#fde68a;">Módulo de cupons</strong>
          <span>Crie cupons para dar desconto em links de pagamento — em breve. Em breve: geração de cobranças Pix. Estamos finalizando nossa integração com a provedora de pagamentos.</span>
        </div>
      </div>

      <!-- FORMULÁRIO DE CRIAÇÃO -->
      ${
        isFormOpen
          ? `
        <div class="card">
          <h2 class="card-title">${Icons.tag(20)} Novo Cupom de Desconto</h2>
          <p class="card-desc">Defina o código e as regras de desconto para seus compradores.</p>

          <form id="form-novo-cupom" novalidate>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;" class="config-grid">
              <div class="form-group">
                <label class="form-label" for="cupom-codigo">Código do cupom</label>
                <input
                  type="text"
                  id="cupom-codigo"
                  class="form-input"
                  placeholder="EX: PROMO10 ou SOBERANO"
                  style="text-transform:uppercase; font-weight:700; letter-spacing:0.05em;"
                  required
                />
                <span class="form-hint">Apenas letras maiúsculas e números, sem espaços.</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="cupom-tipo">Tipo de desconto</label>
                <select id="cupom-tipo" class="form-select">
                  <option value="percentual" ${couponType === 'percentual' ? 'selected' : ''}>Percentual (%)</option>
                  <option value="fixo" ${couponType === 'fixo' ? 'selected' : ''}>Valor fixo (R$)</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:14px;" class="homolog-form-grid">
              <div class="form-group">
                <label class="form-label" for="cupom-valor">
                  ${couponType === 'percentual' ? 'Percentual de desconto (%)' : 'Valor de desconto (R$)'}
                </label>
                <input
                  type="text"
                  id="cupom-valor"
                  class="form-input"
                  value="${couponType === 'percentual' ? '10%' : 'R$ 10,00'}"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="cupom-limite">Limite de usos (opcional)</label>
                <input type="number" id="cupom-limite" class="form-input" placeholder="Ilimitado" min="1" />
              </div>

              <div class="form-group">
                <label class="form-label" for="cupom-validade">Validade (opcional)</label>
                <input type="date" id="cupom-validade" class="form-input" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top:10px;">
              Salvar Cupom
            </button>
          </form>
        </div>
      `
          : ''
      }

      <!-- LISTA DE CUPONS (ESTADO VAZIO) -->
      <div class="card">
        <h3 class="card-title">Cupons ativos</h3>
        <p class="card-desc">Lista de cupons disponíveis para seus clientes</p>

        ${
          coupons.length === 0
            ? `
          <div class="empty-state">
            ${Icons.emptyBox(64)}
            <h4 class="empty-state-title">Nenhum cupom cadastrado</h4>
            <p class="empty-state-desc">Crie cupons para dar desconto em links de pagamento — em breve.</p>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${coupons
              .map(
                (c) => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(11, 18, 32, 0.5); border-radius:var(--radius-md);">
                <div>
                  <strong style="display:block; font-size:0.95rem; font-family:monospace; color:var(--accent-emerald);">${c.codigo}</strong>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${c.tipo} &bull; ${c.valor}</span>
                </div>
                <span class="badge badge-amber">Em breve</span>
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

export function initCuponsEvents(currentUser, reRender) {
  const btnToggle = document.getElementById('btn-toggle-coupon-form')
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      isFormOpen = !isFormOpen
      reRender()
    })
  }

  const selectTipo = document.getElementById('cupom-tipo')
  if (selectTipo) {
    selectTipo.addEventListener('change', (e) => {
      couponType = e.target.value
      reRender()
    })
  }

  const codigoInput = document.getElementById('cupom-codigo')
  if (codigoInput) {
    codigoInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    })
  }

  const cupomValor = document.getElementById('cupom-valor')
  if (cupomValor && couponType === 'fixo') {
    attachBrlMask(cupomValor)
  }

  const form = document.getElementById('form-novo-cupom')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      showEmBreveToast()
    })
  }
}
