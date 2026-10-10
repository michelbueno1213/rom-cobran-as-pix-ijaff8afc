/**
 * View: Homologação (#/homologacao)
 * Visível SOMENTE para admins (controle rigoroso)
 * Badge âmbar "HOMOLOGAÇÃO"
 * Banner exato: "Ambiente privado de homologação — acessível somente a administradores. Os registros daqui são totalmente separados da produção."
 * Formulário de cobrança de teste (is_simulated = true) em namespace separado rom_homolog_charges_{userId}
 * Controle de teste por registro: "Marcar Pix Confirmado", "Marcar DePix Enviado", "Expirar", "Estornar", "Cancelar"
 * Botão "Ver página pública" -> navega a #/pagar/{id}
 * Botão "Limpar registros de homologação" com confirmação modal
 */

import { Icons } from '../icons.js'
import { attachBrlMask, formatBrl, formatDate } from '../utils.js'
import { Store } from '../store.js'
import { showToast } from '../toast.js'
import { getChargeBadge } from './historico.js'

let isClearModalOpen = false

export function renderHomologacaoView(currentUser) {
  const charges = Store.getHomologCharges(currentUser.id)

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <h1 style="margin:0;">Homologação</h1>
            <span class="badge badge-amber" style="font-size:0.75rem;">HOMOLOGAÇÃO</span>
          </div>
          <p>Painel de testes e validação de fluxos de pagamento para administradores.</p>
        </div>

        ${
          charges.length > 0
            ? `
          <button type="button" id="btn-open-clear-modal" class="btn btn-danger btn-sm">
            ${Icons.trash(14)}
            Limpar registros de homologação
          </button>
        `
            : ''
        }
      </div>

      <!-- BANNER EXATO REQUERIDO PELA ESPECIFICAÇÃO -->
      <div class="banner-amber" style="border-left:4px solid var(--accent-amber);">
        ${Icons.alertTriangle(22)}
        <div>
          <strong style="display:block; margin-bottom:2px; color:#fde68a;">Ambiente de Testes Isolado</strong>
          <span>Ambiente privado de homologação — acessível somente a administradores. Os registros daqui são totalmente separados da produção.</span>
        </div>
      </div>

      <!-- FORMULÁRIO DE COBRANÇA DE TESTE -->
      <div class="card">
        <h2 class="card-title">${Icons.flask(20)} Gerar Cobrança de Teste (Simulada)</h2>
        <p class="card-desc">Cria uma ordem marcada como <code>is_simulated = true</code> para testar a máquina de estados.</p>

        <form id="form-homolog-charge" novalidate>
          <div style="display:grid; grid-template-columns: 200px 1fr 1fr; gap:14px;" class="homolog-form-grid">
            <div class="form-group">
              <label class="form-label" for="homolog-valor">Valor (R$)</label>
              <input type="text" id="homolog-valor" class="form-input" value="R$ 50,00" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="homolog-cliente">Cliente (opcional)</label>
              <input type="text" id="homolog-cliente" class="form-input" placeholder="Ex: Cliente de Teste QA" />
            </div>

            <div class="form-group">
              <label class="form-label" for="homolog-descricao">Descrição (opcional)</label>
              <input type="text" id="homolog-descricao" class="form-input" placeholder="Ex: Teste de fluxo Pix→DePix" />
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:6px;">
            Gerar Cobrança de Teste
          </button>
        </form>
      </div>

      <!-- LISTA DE COBRANÇAS DE HOMOLOGAÇÃO COM CONTROLE DE TESTE -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h3 class="card-title">Registros de Homologação (${charges.length})</h3>
            <p class="card-desc" style="margin-bottom:0;">Controle manual de estados para simular as transições da rede</p>
          </div>
        </div>

        ${
          charges.length === 0
            ? `
          <div class="empty-state">
            ${Icons.emptyBox(64)}
            <h4 class="empty-state-title">Nenhuma cobrança de homologação</h4>
            <p class="empty-state-desc">Use o formulário acima para gerar a primeira cobrança simulada e testar a máquina de estados.</p>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${charges
              .map(
                (c) => `
              <div class="card" style="padding:18px; background:rgba(11, 18, 32, 0.7); border:1px solid var(--border-subtle);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid rgba(30, 41, 59, 0.6); padding-bottom:12px;">
                  <div>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <strong style="font-size:1.05rem; color:var(--text-main);">${formatBrl(c.valor)}</strong>
                      ${getChargeBadge(c.status)}
                      <span class="badge badge-amber" style="font-size:0.65rem;">is_simulated</span>
                    </div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                      ID: <code style="font-family:monospace; color:#cbd5e1;">${c.id}</code> &bull; Criada em ${formatDate(c.createdAt)}
                    </div>
                    ${
                      c.cliente || c.descricao
                        ? `
                      <div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">
                        ${c.cliente ? `Cliente: <strong>${c.cliente}</strong> &bull; ` : ''}
                        ${c.descricao ? `Descrição: <em>${c.descricao}</em>` : ''}
                      </div>
                    `
                        : ''
                    }
                  </div>

                  <a href="#/pagar/${c.id}" class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer" style="font-size:0.8rem;">
                    ${Icons.externalLink(14)}
                    Ver página pública
                  </a>
                </div>

                <!-- CONTROLE DE TESTE (MUDANÇA MANUAL DE STATUS) -->
                <div>
                  <span style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">
                    Controle de Teste — Alterar status:
                  </span>
                  <div style="display:flex; flex-wrap:wrap; gap:8px;">
                    <button type="button" class="btn btn-sm btn-outline btn-status-change" data-id="${c.id}" data-status="Pix Confirmado" style="border-color:rgba(16, 185, 129, 0.4); color:var(--accent-emerald);">
                      Marcar Pix Confirmado
                    </button>
                    <button type="button" class="btn btn-sm btn-outline btn-status-change" data-id="${c.id}" data-status="DePix Enviado" style="border-color:rgba(16, 185, 129, 0.4); color:var(--accent-emerald);">
                      Marcar DePix Enviado
                    </button>
                    <button type="button" class="btn btn-sm btn-outline btn-status-change" data-id="${c.id}" data-status="Expirada" style="border-color:var(--border-strong);">
                      Expirar
                    </button>
                    <button type="button" class="btn btn-sm btn-outline btn-status-change" data-id="${c.id}" data-status="Estornada" style="border-color:var(--border-strong);">
                      Estornar
                    </button>
                    <button type="button" class="btn btn-sm btn-outline btn-status-change" data-id="${c.id}" data-status="Cancelar" style="border-color:rgba(239, 68, 68, 0.4); color:var(--accent-red);">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        `
        }
      </div>

      <!-- MODAL CONFIRMAÇÃO LIMPAR REGISTROS -->
      <div id="modal-clear-homolog" class="modal-backdrop" style="display:${isClearModalOpen ? 'flex' : 'none'};">
        <div class="modal-content">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <div style="color:var(--accent-red); background:var(--accent-red-subtle); padding:10px; border-radius:50%;">
              ${Icons.trash(22)}
            </div>
            <h3>Limpar todos os registros de homologação?</h3>
          </div>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5;">
            Esta ação removerá todas as cobranças de teste simuladas. Os dados de produção e configurações do usuário não serão afetados.
          </p>
          <div class="modal-actions">
            <button type="button" id="btn-cancel-clear" class="btn btn-outline">Cancelar</button>
            <button type="button" id="btn-confirm-clear" class="btn btn-danger">Sim, limpar registros</button>
          </div>
        </div>
      </div>
    </div>
  `
}

export function initHomologacaoEvents(currentUser, reRender) {
  const homologValor = document.getElementById('homolog-valor')
  if (homologValor) attachBrlMask(homologValor)

  // Gerar cobrança simulada
  const form = document.getElementById('form-homolog-charge')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const clienteInput = document.getElementById('homolog-cliente')
      const descInput = document.getElementById('homolog-descricao')
      const valorStr = homologValor ? homologValor.value : 'R$ 0,00'
      const cleanDigits = valorStr.replace(/\D/g, '')
      const valor = (parseInt(cleanDigits, 10) || 0) / 100

      if (valor <= 0) {
        showToast('Informe um valor maior que zero.', 'warning')
        return
      }

      Store.addHomologCharge(currentUser.id, {
        valor,
        cliente: clienteInput ? clienteInput.value : '',
        descricao: descInput ? descInput.value : '',
      })

      showToast('Cobrança de teste simulada criada com sucesso.', 'success')
      reRender()
    })
  }

  // Mudança manual de status
  document.querySelectorAll('.btn-status-change').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const chargeId = e.currentTarget.getAttribute('data-id')
      let newStatus = e.currentTarget.getAttribute('data-status')
      if (newStatus === 'Cancelar') newStatus = 'Cancelada'

      try {
        Store.updateHomologStatus(currentUser.id, chargeId, newStatus)
        showToast(`Status atualizado para: ${newStatus}`, 'success', 2500)
        reRender()
      } catch (err) {
        showToast(err.message || 'Erro ao alterar status.', 'error')
      }
    })
  })

  // Modal de limpeza
  const btnOpenClear = document.getElementById('btn-open-clear-modal')
  if (btnOpenClear) {
    btnOpenClear.addEventListener('click', () => {
      isClearModalOpen = true
      reRender()
    })
  }

  const btnCancelClear = document.getElementById('btn-cancel-clear')
  if (btnCancelClear) {
    btnCancelClear.addEventListener('click', () => {
      isClearModalOpen = false
      reRender()
    })
  }

  const btnConfirmClear = document.getElementById('btn-confirm-clear')
  if (btnConfirmClear) {
    btnConfirmClear.addEventListener('click', () => {
      Store.clearHomologCharges(currentUser.id)
      isClearModalOpen = false
      showToast('Registros de homologação removidos.', 'success')
      reRender()
    })
  }
}
