/**
 * View: Trocar / Swap (#/trocar)
 * Paridade DeFlow: Troca instantânea entre cripto dentro da ROM (BTC, USDT, USDC, DePix)
 * Formulário: "Você troca" (ativo+rede) → "Você recebe" (ativo+rede) → valor em R$ com máscara BRL → resumo estimado
 * Botão "Trocar" -> Mensagem exata "Em breve" (toast âmbar + banner)
 * Histórico de trocas com estado vazio ilustrado
 */

import { Icons } from '../icons.js'
import { MULTI_ASSETS, attachBrlMask } from '../utils.js'
import { Store } from '../store.js'
import { showEmBreveToast } from '../toast.js'

export function renderTrocarView(currentUser) {
  const swaps = Store.getSwaps(currentUser.id)

  return `
    <div style="max-width:680px; margin:0 auto; display:flex; flex-direction:column; gap:22px;">
      <div>
        <h1 style="margin-bottom:6px;">Trocar Ativos (Swap)</h1>
        <p>Troque entre cripto (BTC, USDT, USDC, DePix) dentro da ROM, sem sair.</p>
      </div>

      <!-- BANNER EXPLICATIVO -->
      <div class="banner-amber">
        ${Icons.alertTriangle(22)}
        <div>
          <strong style="display:block; margin-bottom:2px; color:#fde68a;">Troca instantânea entre redes</strong>
          <span>Troque entre cripto (BTC, USDT, USDC, DePix) dentro da ROM, sem sair. Em breve: geração de cobranças Pix. Estamos finalizando nossa integração com a provedora de pagamentos.</span>
        </div>
      </div>

      <!-- CARD DO SWAP -->
      <div class="card">
        <h2 class="card-title">${Icons.repeat(20)} Conversão Direta</h2>
        <p class="card-desc">Execute conversões com taxas transparentes e liquidação na sua carteira.</p>

        <form id="form-swap" novalidate>
          <!-- VOCÊ TROCA -->
          <div class="form-group">
            <label class="form-label" for="swap-from-asset">Você troca (origem)</label>
            <select id="swap-from-asset" class="form-select">
              ${MULTI_ASSETS.map(
                (a) =>
                  `<option value="${a.id}" ${a.id === 'depix_liquid' ? 'selected' : ''}>${a.label}</option>`,
              ).join('')}
            </select>
          </div>

          <!-- VALOR DA TROCA -->
          <div class="form-group">
            <label class="form-label" for="swap-valor">Valor estimado em R$</label>
            <input
              type="text"
              id="swap-valor"
              class="form-input"
              value="R$ 100,00"
              style="font-size:1.4rem; font-weight:700; height:50px; color:var(--accent-emerald);"
              required
            />
          </div>

          <!-- ÍCONE SEPARADOR -->
          <div style="display:flex; justify-content:center; margin:10px 0;">
            <div style="color:var(--accent-emerald); background:var(--accent-emerald-subtle); padding:10px; border-radius:50%;">
              ${Icons.repeat(20)}
            </div>
          </div>

          <!-- VOCÊ RECEBE -->
          <div class="form-group">
            <label class="form-label" for="swap-to-asset">Você recebe (destino)</label>
            <select id="swap-to-asset" class="form-select">
              ${MULTI_ASSETS.map(
                (a) =>
                  `<option value="${a.id}" ${a.id === 'usdt_polygon' ? 'selected' : ''}>${a.label}</option>`,
              ).join('')}
            </select>
          </div>

          <!-- RESUMO ESTIMADO -->
          <div style="padding:16px; background:rgba(11, 18, 32, 0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); margin-top:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
              <span style="color:var(--text-muted);">Estimativa de recebimento:</span>
              <strong style="color:var(--text-main);" id="swap-resumo">≈ R$ 0,00 (estimativa — cotação real no momento da troca)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-faint);">
              <span>Taxa de swap:</span>
              <span>0,0% na fase beta</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; height:48px; margin-top:20px; font-size:0.95rem;">
            Trocar
          </button>
        </form>
      </div>

      <!-- HISTÓRICO DE TROCAS (ESTADO VAZIO) -->
      <div class="card">
        <h3 class="card-title">Histórico de trocas</h3>
        <p class="card-desc">Registro de swaps executados entre suas carteiras</p>

        ${
          swaps.length === 0
            ? `
          <div class="empty-state">
            ${Icons.emptyCoins(64)}
            <h4 class="empty-state-title">Nenhuma troca realizada</h4>
            <p class="empty-state-desc">Suas trocas aparecerão aqui após a liberação da conectividade de liquidação.</p>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${swaps
              .map(
                (s) => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(11, 18, 32, 0.5); border-radius:var(--radius-md);">
                <div>
                  <strong style="display:block; font-size:0.9rem;">${s.from} → ${s.to}</strong>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${s.valor}</span>
                </div>
                <span class="badge badge-green">Concluída</span>
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

export function initTrocarEvents(currentUser, reRender) {
  const swapValor = document.getElementById('swap-valor')
  const swapResumo = document.getElementById('swap-resumo')

  if (swapValor) {
    attachBrlMask(swapValor, (floatVal) => {
      if (swapResumo) {
        swapResumo.textContent = `≈ R$ ${floatVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (estimativa — cotação real no momento da troca)`
      }
    })
  }

  const form = document.getElementById('form-swap')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      showEmBreveToast()
    })
  }
}
