/**
 * View: Carteiras Liquid (#/carteiras)
 * Aviso exato: "Os pagamentos são liquidados diretamente na sua carteira. A ROM não custodia valores."
 * Cadastro apelido (opcional) + endereço (validação lq1/ex1, erro inline)
 * LIMITE DE 3 CARTEIRAS por conta com aviso "Limite de 3 carteiras por conta." ao atingir
 * Carteira padrão com badge "Padrão" e botão "Tornar padrão" nas outras
 * Copiar endereço (navigator.clipboard + toast "Endereço copiado.")
 * Excluir com confirmação (ao excluir a padrão, promove a primeira restante)
 */

import { Icons } from '../icons.js'
import { isValidLiquidAddress, truncateAddress } from '../utils.js'
import { Store } from '../store.js'
import { showToast } from '../toast.js'

let walletToDelete = null

export function renderCarteirasView(currentUser) {
  const wallets = Store.getWallets(currentUser.id)
  const isLimitReached = wallets.length >= 3

  return `
    <div style="max-width:820px; margin:0 auto; display:flex; flex-direction:column; gap:22px;">
      <div>
        <h1 style="margin-bottom:6px;">Carteiras Liquid</h1>
        <!-- AVISO EXATO REQUERIDO -->
        <p style="color:#cbd5e1; font-size:0.95rem;">
          Os pagamentos são liquidados diretamente na sua carteira. A ROM não custodia valores.
        </p>
      </div>

      <!-- FORMULÁRIO DE CADASTRO -->
      <div class="card">
        <h2 class="card-title">${Icons.wallet(20)} Adicionar Carteira Liquid</h2>
        <p class="card-desc">Endereços da rede Liquid iniciam obrigatoriamente com <code>lq1</code> ou <code>ex1</code>.</p>

        ${
          isLimitReached
            ? `
          <div class="banner-amber" style="margin-bottom:12px;">
            ${Icons.alertTriangle(18)}
            <span><strong>Limite de 3 carteiras por conta.</strong> Para cadastrar um novo endereço, exclua uma das carteiras existentes abaixo.</span>
          </div>
        `
            : `
          <form id="form-add-carteira" novalidate>
            <div style="display:grid; grid-template-columns: 240px 1fr; gap:14px;" class="wallet-form-grid">
              <div class="form-group">
                <label class="form-label" for="carteira-apelido">Apelido (opcional)</label>
                <input type="text" id="carteira-apelido" class="form-input" placeholder="Ex: Carteira Loja ou Pessoal" />
              </div>

              <div class="form-group">
                <label class="form-label" for="carteira-endereco">Endereço Liquid (lq1 ou ex1)</label>
                <input type="text" id="carteira-endereco" class="form-input" placeholder="lq1... ou ex1..." required />
                <div id="carteira-error" class="form-error" style="display:none;"></div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top:6px;">
              Adicionar carteira
            </button>
          </form>
        `
        }
      </div>

      <!-- LISTA DE CARTEIRAS -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h3 class="card-title">Carteiras cadastradas (${wallets.length}/3)</h3>
            <p class="card-desc" style="margin-bottom:0;">A carteira definida como padrão recebe as liquidações automáticas.</p>
          </div>
        </div>

        ${
          wallets.length === 0
            ? `
          <div class="empty-state">
            ${Icons.emptyBox(64)}
            <h4 class="empty-state-title">Nenhuma carteira cadastrada</h4>
            <p class="empty-state-desc">Cadastre sua primeira carteira Liquid para habilitar o recebimento de cobranças.</p>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${wallets
              .map(
                (w) => `
              <div class="card" style="padding:16px 20px; background:rgba(11, 18, 32, 0.6); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-color:${w.is_default ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'};">
                <div style="display:flex; align-items:flex-start; gap:12px;">
                  <span style="color:${w.is_default ? 'var(--accent-emerald)' : 'var(--text-muted)'}; margin-top:2px;">
                    ${Icons.wallet(22)}
                  </span>
                  <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <strong style="font-size:0.95rem; color:var(--text-main);">${w.apelido}</strong>
                      ${w.is_default ? '<span class="badge badge-green">Padrão</span>' : ''}
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                      <code style="font-family:monospace; font-size:0.8rem; color:var(--text-muted); background:rgba(255,255,255,0.03); padding:2px 6px; border-radius:4px;">
                        ${truncateAddress(w.address, 16, 12)}
                      </code>
                      <button type="button" class="btn-icon btn-copiar-addr" data-addr="${w.address}" title="Copiar endereço" aria-label="Copiar endereço" style="padding:4px;">
                        ${Icons.copy(14)}
                      </button>
                    </div>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:8px;">
                  ${
                    !w.is_default
                      ? `
                    <button type="button" class="btn btn-outline btn-sm btn-tornar-padrao" data-id="${w.id}">
                      Tornar padrão
                    </button>
                  `
                      : ''
                  }
                  <button type="button" class="btn-icon btn-excluir-carteira" data-id="${w.id}" data-alias="${w.apelido}" title="Excluir carteira" aria-label="Excluir carteira">
                    ${Icons.trash(16)}
                  </button>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        `
        }
      </div>

      <!-- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO -->
      <div id="modal-delete-wallet" class="modal-backdrop" style="display:none;">
        <div class="modal-content">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <div style="color:var(--accent-red); background:var(--accent-red-subtle); padding:10px; border-radius:50%;">
              ${Icons.alertTriangle(22)}
            </div>
            <h3>Excluir carteira?</h3>
          </div>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5;">
            Tem certeza de que deseja excluir a carteira <strong id="delete-wallet-name" style="color:var(--text-main);"></strong>? Se esta for a carteira padrão, a próxima restante será promovida a padrão.
          </p>
          <div class="modal-actions">
            <button type="button" id="btn-cancel-delete" class="btn btn-outline">Cancelar</button>
            <button type="button" id="btn-confirm-delete" class="btn btn-danger">Excluir carteira</button>
          </div>
        </div>
      </div>
    </div>
  `
}

export function initCarteirasEvents(currentUser, reRender) {
  // Submissão do formulário
  const form = document.getElementById('form-add-carteira')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const aliasInput = document.getElementById('carteira-apelido')
      const addrInput = document.getElementById('carteira-endereco')
      const errDiv = document.getElementById('carteira-error')

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
        showToast('Carteira adicionada com sucesso.', 'success')
        reRender()
      } catch (err) {
        errDiv.textContent = err.message || 'Erro ao adicionar carteira.'
        errDiv.style.display = 'block'
      }
    })
  }

  // Copiar endereço
  document.querySelectorAll('.btn-copiar-addr').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const addr = e.currentTarget.getAttribute('data-addr')
      if (!addr) return
      try {
        await navigator.clipboard.writeText(addr)
        showToast('Endereço copiado.', 'success', 2500)
      } catch {
        showToast('Não foi possível copiar o endereço.', 'error')
      }
    })
  })

  // Tornar padrão
  document.querySelectorAll('.btn-tornar-padrao').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id')
      if (!id) return
      Store.setDefaultWallet(currentUser.id, id)
      showToast('Carteira padrão atualizada.', 'success')
      reRender()
    })
  })

  // Excluir carteira (abre modal)
  const modal = document.getElementById('modal-delete-wallet')
  const walletNameEl = document.getElementById('delete-wallet-name')

  document.querySelectorAll('.btn-excluir-carteira').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id')
      const alias = e.currentTarget.getAttribute('data-alias')
      walletToDelete = id
      if (walletNameEl) walletNameEl.textContent = alias || 'selecionada'
      if (modal) modal.style.display = 'flex'
    })
  })

  const btnCancel = document.getElementById('btn-cancel-delete')
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      walletToDelete = null
      if (modal) modal.style.display = 'none'
    })
  }

  const btnConfirm = document.getElementById('btn-confirm-delete')
  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      if (walletToDelete) {
        Store.deleteWallet(currentUser.id, walletToDelete)
        showToast('Carteira excluída com sucesso.', 'success')
        walletToDelete = null
      }
      if (modal) modal.style.display = 'none'
      reRender()
    })
  }
}
