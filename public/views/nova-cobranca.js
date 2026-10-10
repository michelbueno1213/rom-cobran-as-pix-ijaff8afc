/**
 * View: Nova Cobrança (#/nova-cobranca)
 * Valor com máscara BRL
 * Carteira de recebimento: chip se houver padrão, formulário inline validando lq1/ex1 se não houver
 * Ativo fixo: DePix (Liquid) — Pix entra, DePix sai na sua carteira Liquid
 * Cliente e descrição opcionais
 * Botão "Gerar Cobrança Pix" dispara TOAST "Em breve" e NUNCA gera QR fictício
 */

import { Icons } from '../icons.js'
import { attachBrlMask, isValidLiquidAddress } from '../utils.js'
import { Store } from '../store.js'
import { showEmBreveToast, showToast } from '../toast.js'

let stateInlineWalletOpen = false

export function renderNovaCobrancaView(currentUser) {
  const defaultWallet = Store.getDefaultWallet(currentUser.id)
  const hasDefault = Boolean(defaultWallet && !stateInlineWalletOpen)

  return `
    <div style="max-width:680px; margin:0 auto; display:flex; flex-direction:column; gap:22px;">
      <div>
        <h1 style="margin-bottom:6px;">Nova Cobrança</h1>
        <p>Pix entra, DePix sai na sua carteira Liquid.</p>
      </div>

      <div class="card">
        <form id="form-nova-cobranca" novalidate>
          <!-- VALOR COM MÁSCARA BRL -->
          <div class="form-group">
            <label class="form-label" for="cobranca-valor">Valor da cobrança (R$)</label>
            <input
              type="text"
              id="cobranca-valor"
              class="form-input"
              value="R$ 0,00"
              style="font-size:1.6rem; font-weight:800; color:var(--accent-emerald); height:56px;"
              required
            />
            <span class="form-hint">Pix entra, DePix sai na sua carteira Liquid (paridade 1:1 BRL).</span>
          </div>

          <!-- ATIVO FIXO DE LIQUIDAÇÃO: DEPIX (LIQUID) -->
          <div class="form-group" style="margin-top:16px;">
            <label class="form-label">Liquidação exclusiva</label>
            <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:rgba(11, 18, 32, 0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:var(--accent-emerald);">${Icons.shield(18)}</span>
                <span style="font-weight:600; font-size:0.92rem; color:var(--text-main);">DePix (Rede Liquid)</span>
              </div>
              <span class="badge badge-green">Pix entra → DePix sai</span>
            </div>
            <span class="form-hint">A conversão é exclusivamente de Pix para DePix na sua carteira Liquid.</span>
          </div>

          <!-- SEÇÃO CARTEIRA DE RECEBIMENTO -->
          <div class="form-group" style="margin-top:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <label class="form-label">Carteira Liquid de recebimento</label>
              ${
                hasDefault
                  ? `<button type="button" id="btn-trocar-carteira" class="btn btn-outline btn-sm" style="font-size:0.75rem; padding:3px 8px;">Usar outra carteira</button>`
                  : ''
              }
            </div>

            ${
              hasDefault
                ? `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:var(--radius-md);">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="color:var(--accent-emerald);">${Icons.wallet(20)}</span>
                  <div>
                    <span style="display:inline-block; font-weight:600; font-size:0.9rem; color:var(--text-main);">
                      Usando: ${defaultWallet.apelido} — padrão
                    </span>
                    <span style="display:block; font-family:monospace; font-size:0.75rem; color:var(--text-muted);">
                      ${defaultWallet.address}
                    </span>
                  </div>
                </div>
                <span class="badge badge-green">Padrão</span>
              </div>
            `
                : `
              <div style="background:rgba(11, 18, 32, 0.6); border:1px dashed var(--border-strong); border-radius:var(--radius-md); padding:16px;">
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">
                  Nenhuma carteira padrão selecionada. Cadastre agora a carteira Liquid que receberá os fundos:
                </p>

                <div class="form-group">
                  <label class="form-label" for="inline-wallet-alias">Apelido da carteira (opcional)</label>
                  <input type="text" id="inline-wallet-alias" class="form-input" placeholder="Ex: Minha Liquid Principal" />
                </div>

                <div class="form-group">
                  <label class="form-label" for="inline-wallet-addr">Endereço Liquid (lq1 ou ex1)</label>
                  <input type="text" id="inline-wallet-addr" class="form-input" placeholder="lq1... ou ex1..." />
                  <div id="inline-wallet-error" class="form-error" style="display:none;"></div>
                </div>

                <button type="button" id="btn-cadastrar-inline-wallet" class="btn btn-secondary btn-sm" style="margin-top:6px;">
                  Cadastrar e usar esta carteira
                </button>
              </div>
            `
            }
          </div>

          <!-- CLIENTE (OPCIONAL) -->
          <div class="form-group" style="margin-top:20px;">
            <label class="form-label" for="cobranca-cliente">Cliente (opcional)</label>
            <input type="text" id="cobranca-cliente" class="form-input" placeholder="Nome ou identificador do cliente" />
          </div>

          <!-- DESCRIÇÃO (OPCIONAL) -->
          <div class="form-group">
            <label class="form-label" for="cobranca-descricao">Descrição da cobrança (opcional)</label>
            <input type="text" id="cobranca-descricao" class="form-input" placeholder="Ex: Pedido #1042 — Serviço de consultoria" />
          </div>

          <!-- BOTÃO GERAR COBRANÇA PIX -->
          <div style="margin-top:28px;">
            <button type="submit" id="btn-gerar-cobranca" class="btn btn-primary" style="width:100%; height:48px; font-size:1rem;">
              Gerar Cobrança Pix
            </button>
            <p style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-top:8px;">
              A geração de cobranças reais está bloqueada até a liberação das credenciais bancárias.
            </p>
          </div>
        </form>
      </div>
    </div>
  `
}

export function initNovaCobrancaEvents(currentUser, reRender) {
  const valorInput = document.getElementById('cobranca-valor')
  if (valorInput) {
    attachBrlMask(valorInput)
  }

  // Botão trocar carteira
  const btnTrocar = document.getElementById('btn-trocar-carteira')
  if (btnTrocar) {
    btnTrocar.addEventListener('click', () => {
      stateInlineWalletOpen = true
      reRender()
    })
  }

  // Cadastrar carteira inline
  const btnCadastrarInline = document.getElementById('btn-cadastrar-inline-wallet')
  if (btnCadastrarInline) {
    btnCadastrarInline.addEventListener('click', () => {
      const aliasInput = document.getElementById('inline-wallet-alias')
      const addrInput = document.getElementById('inline-wallet-addr')
      const errDiv = document.getElementById('inline-wallet-error')

      errDiv.style.display = 'none'

      const addr = addrInput.value.trim()
      const alias = aliasInput.value.trim()

      if (!isValidLiquidAddress(addr)) {
        errDiv.textContent = 'Endereço Liquid inválido. Deve começar com lq1 ou ex1.'
        errDiv.style.display = 'block'
        return
      }

      try {
        Store.addWallet(currentUser.id, { apelido: alias, address: addr })
        showToast('Carteira cadastrada com sucesso.', 'success')
        stateInlineWalletOpen = false
        reRender()
      } catch (err) {
        errDiv.textContent = err.message || 'Erro ao cadastrar carteira.'
        errDiv.style.display = 'block'
      }
    })
  }

  // Submit do formulário: dispara estritamente o toast "Em breve" e NÃO gera QR/código
  const form = document.getElementById('form-nova-cobranca')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      showEmBreveToast()
    })
  }
}
