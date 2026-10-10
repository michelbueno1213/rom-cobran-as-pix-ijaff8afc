/**
 * View: Histórico (#/historico)
 * Lista unificada com filtros:
 * - Todas / Cobranças / Saques / Contas e Boletos / Cupons
 * Badges de status por tipo coerentes com as cores existentes
 */

import { Icons } from '../icons.js'
import { formatBrl, formatDate } from '../utils.js'
import { Store } from '../store.js'

let filterType = 'todas' // 'todas' | 'cobrancas' | 'saques' | 'contas' | 'cupons'

export function getChargeBadge(status) {
  switch (status) {
    case 'Aguardando Pagamento':
      return `<span class="badge badge-amber"><span class="status-dot status-dot-amber"></span>${status}</span>`
    case 'Em Análise':
      return `<span class="badge badge-blue"><span class="status-dot status-dot-blue"></span>${status}</span>`
    case 'Pix Confirmado':
    case 'DePix Enviado':
      return `<span class="badge badge-green"><span class="status-dot status-dot-green"></span>${status}</span>`
    case 'Atrasada':
    case 'Erro':
      return `<span class="badge badge-red"><span class="status-dot status-dot-red"></span>${status}</span>`
    case 'Estornada':
    case 'Cancelada':
    case 'Expirada':
    default:
      return `<span class="badge badge-gray"><span class="status-dot status-dot-gray"></span>${status}</span>`
  }
}

export function getWithdrawalBadge(status) {
  switch (status) {
    case 'Aguardando Envio':
      return `<span class="badge badge-amber"><span class="status-dot status-dot-amber"></span>${status}</span>`
    case 'Enviando':
    case 'Em Revisão':
      return `<span class="badge badge-blue"><span class="status-dot status-dot-blue"></span>${status}</span>`
    case 'Pix Enviado':
      return `<span class="badge badge-green"><span class="status-dot status-dot-green"></span>${status}</span>`
    case 'Erro':
      return `<span class="badge badge-red"><span class="status-dot status-dot-red"></span>${status}</span>`
    case 'Estornado':
    default:
      return `<span class="badge badge-gray"><span class="status-dot status-dot-gray"></span>${status}</span>`
  }
}

export function getBillBadge(status) {
  switch (status) {
    case 'Aguardando Envio':
      return `<span class="badge badge-amber"><span class="status-dot status-dot-amber"></span>${status}</span>`
    case 'Enviando':
    case 'Em Revisão':
      return `<span class="badge badge-blue"><span class="status-dot status-dot-blue"></span>${status}</span>`
    case 'Conta Paga':
      return `<span class="badge badge-green"><span class="status-dot status-dot-green"></span>${status}</span>`
    case 'Erro':
      return `<span class="badge badge-red"><span class="status-dot status-dot-red"></span>${status}</span>`
    case 'Estornado':
    default:
      return `<span class="badge badge-gray"><span class="status-dot status-dot-gray"></span>${status}</span>`
  }
}

export function renderHistoricoView(currentUser) {
  const charges = Store.getCharges(currentUser.id).map((c) => ({
    ...c,
    tipo: 'cobranca',
  }))

  const withdrawals = Store.getWithdrawals(currentUser.id).map((w) => ({
    ...w,
    tipo: 'saque',
  }))

  const billPayments = Store.getBillPayments(currentUser.id).map((b) => ({
    ...b,
    tipo: 'conta',
  }))

  const coupons = Store.getCoupons(currentUser.id).map((cp) => ({
    ...cp,
    tipo: 'cupom',
  }))

  let unified = [...charges, ...withdrawals, ...billPayments, ...coupons]

  if (filterType === 'cobrancas') {
    unified = unified.filter((i) => i.tipo === 'cobranca')
  } else if (filterType === 'saques') {
    unified = unified.filter((i) => i.tipo === 'saque')
  } else if (filterType === 'contas') {
    unified = unified.filter((i) => i.tipo === 'conta')
  } else if (filterType === 'cupons') {
    unified = unified.filter((i) => i.tipo === 'cupom')
  }

  // Ordena por data decrescente
  unified.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
        <div>
          <h1 style="margin-bottom:6px;">Histórico de Movimentações</h1>
          <p>Visão unificada de cobranças Pix, saques DePix, pagamentos de contas e cupons.</p>
        </div>

        <!-- FILTRO POR TIPO -->
        <div style="display:inline-flex; background:rgba(19, 28, 46, 0.8); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:3px; flex-wrap:wrap; gap:2px;">
          <button
            type="button"
            id="filtro-todas"
            class="btn btn-sm ${filterType === 'todas' ? 'btn-primary' : 'btn-outline'}"
            style="border:none;"
          >
            Todas
          </button>
          <button
            type="button"
            id="filtro-cobrancas"
            class="btn btn-sm ${filterType === 'cobrancas' ? 'btn-primary' : 'btn-outline'}"
            style="border:none;"
          >
            Cobranças
          </button>
          <button
            type="button"
            id="filtro-saques"
            class="btn btn-sm ${filterType === 'saques' ? 'btn-primary' : 'btn-outline'}"
            style="border:none;"
          >
            Saques
          </button>
          <button
            type="button"
            id="filtro-contas"
            class="btn btn-sm ${filterType === 'contas' ? 'btn-primary' : 'btn-outline'}"
            style="border:none;"
          >
            Contas e Boletos
          </button>
          <button
            type="button"
            id="filtro-cupons"
            class="btn btn-sm ${filterType === 'cupons' ? 'btn-primary' : 'btn-outline'}"
            style="border:none;"
          >
            Cupons
          </button>
        </div>
      </div>

      <!-- LISTA / TABELA -->
      <div class="card" style="padding:0; overflow:hidden;">
        ${
          unified.length === 0
            ? `
          <div class="empty-state" style="padding:64px 24px;">
            ${Icons.emptyCoins(64)}
            <h4 class="empty-state-title">Nenhuma movimentação ainda</h4>
            <p class="empty-state-desc">Suas movimentações aparecerão aqui quando forem geradas na plataforma.</p>
          </div>
        `
            : `
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-subtle); background:rgba(11, 18, 32, 0.4); color:var(--text-muted); font-size:0.78rem; text-transform:uppercase;">
                  <th style="padding:14px 20px;">Data</th>
                  <th style="padding:14px 20px;">Tipo</th>
                  <th style="padding:14px 20px;">Descrição / Detalhes</th>
                  <th style="padding:14px 20px;">Status</th>
                  <th style="padding:14px 20px; text-align:right;">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${unified
                  .map((item) => {
                    let badgeHtml = ''
                    let tipoLabel = ''
                    let badgeClass = 'badge-blue'

                    if (item.tipo === 'cobranca') {
                      badgeHtml = getChargeBadge(item.status || 'Aguardando Pagamento')
                      tipoLabel = 'Cobrança Pix'
                      badgeClass = 'badge-blue'
                    } else if (item.tipo === 'saque') {
                      badgeHtml = getWithdrawalBadge(item.status || 'Aguardando Envio')
                      tipoLabel = 'Saque DePix'
                      badgeClass = 'badge-amber'
                    } else if (item.tipo === 'conta') {
                      badgeHtml = getBillBadge(item.status || 'Aguardando Envio')
                      tipoLabel = 'Pagamento de Conta'
                      badgeClass = 'badge-amber'
                    } else if (item.tipo === 'cupom') {
                      badgeHtml =
                        '<span class="badge badge-green"><span class="status-dot status-dot-green"></span>Ativo</span>'
                      tipoLabel = 'Cupom'
                      badgeClass = 'badge-green'
                    }

                    return `
                    <tr style="border-bottom:1px solid rgba(30, 41, 59, 0.5);">
                      <td style="padding:14px 20px; white-space:nowrap; color:var(--text-muted);">
                        ${formatDate(item.createdAt)}
                      </td>
                      <td style="padding:14px 20px;">
                        <span class="badge ${badgeClass}" style="font-size:0.7rem;">
                          ${tipoLabel}
                        </span>
                      </td>
                      <td style="padding:14px 20px;">
                        <strong style="display:block; color:var(--text-main);">${item.descricao || item.codigo || item.from || 'Operação'}</strong>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${item.cliente || item.chavePix || item.to || '-'}</span>
                      </td>
                      <td style="padding:14px 20px;">
                        ${badgeHtml}
                      </td>
                      <td style="padding:14px 20px; text-align:right; font-weight:700; color:var(--text-main);">
                        ${typeof item.valor === 'number' ? formatBrl(item.valor) : item.valor || '—'}
                      </td>
                    </tr>
                  `
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        `
        }
      </div>
    </div>
  `
}

export function initHistoricoEvents(currentUser, reRender) {
  const btnTodas = document.getElementById('filtro-todas')
  const btnCobrancas = document.getElementById('filtro-cobrancas')
  const btnSaques = document.getElementById('filtro-saques')
  const btnContas = document.getElementById('filtro-contas')
  const btnCupons = document.getElementById('filtro-cupons')

  if (btnTodas) {
    btnTodas.addEventListener('click', () => {
      filterType = 'todas'
      reRender()
    })
  }
  if (btnCobrancas) {
    btnCobrancas.addEventListener('click', () => {
      filterType = 'cobrancas'
      reRender()
    })
  }
  if (btnSaques) {
    btnSaques.addEventListener('click', () => {
      filterType = 'saques'
      reRender()
    })
  }
  if (btnContas) {
    btnContas.addEventListener('click', () => {
      filterType = 'contas'
      reRender()
    })
  }
  if (btnCupons) {
    btnCupons.addEventListener('click', () => {
      filterType = 'cupons'
      reRender()
    })
  }
}
