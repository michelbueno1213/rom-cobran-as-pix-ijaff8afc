/**
 * View: Histórico (#/historico)
 * Lista unificada cobranças + saques com filtro: Todas / Cobranças / Saques
 * Badges de cobrança:
 *   - Aguardando Pagamento (âmbar)
 *   - Em Análise (azul)
 *   - Pix Confirmado (verde)
 *   - DePix Enviado (verde)
 *   - Atrasada (vermelho)
 *   - Estornada, Cancelada, Expirada (cinza)
 *   - Erro (vermelho)
 * Badges de saque:
 *   - Aguardando Envio (âmbar)
 *   - Enviando (azul)
 *   - Pix Enviado (verde)
 *   - Em Revisão (azul)
 *   - Estornado (cinza)
 *   - Erro (vermelho)
 * Exibe estado vazio caso não haja itens
 */

import { Icons } from '../icons.js'
import { formatBrl, formatDate } from '../utils.js'
import { Store } from '../store.js'

let filterType = 'todas' // 'todas' | 'cobrancas' | 'saques'

export function getChargeBadge(status) {
  switch (status) {
    case 'Aguardando Pagamento':
      return `<span class="badge badge-amber">${status}</span>`
    case 'Em Análise':
      return `<span class="badge badge-blue">${status}</span>`
    case 'Pix Confirmado':
    case 'DePix Enviado':
      return `<span class="badge badge-green">${status}</span>`
    case 'Atrasada':
    case 'Erro':
      return `<span class="badge badge-red">${status}</span>`
    case 'Estornada':
    case 'Cancelada':
    case 'Expirada':
    default:
      return `<span class="badge badge-gray">${status}</span>`
  }
}

export function getWithdrawalBadge(status) {
  switch (status) {
    case 'Aguardando Envio':
      return `<span class="badge badge-amber">${status}</span>`
    case 'Enviando':
    case 'Em Revisão':
      return `<span class="badge badge-blue">${status}</span>`
    case 'Pix Enviado':
      return `<span class="badge badge-green">${status}</span>`
    case 'Erro':
      return `<span class="badge badge-red">${status}</span>`
    case 'Estornado':
    default:
      return `<span class="badge badge-gray">${status}</span>`
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

  let unified = [...charges, ...withdrawals]

  if (filterType === 'cobrancas') {
    unified = unified.filter((i) => i.tipo === 'cobranca')
  } else if (filterType === 'saques') {
    unified = unified.filter((i) => i.tipo === 'saque')
  }

  // Ordena por data decrescente
  unified.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
        <div>
          <h1 style="margin-bottom:6px;">Histórico de Movimentações</h1>
          <p>Visão unificada de todas as cobranças emitidas e saques solicitados.</p>
        </div>

        <!-- FILTRO POR TIPO -->
        <div style="display:inline-flex; background:rgba(19, 28, 46, 0.8); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:3px;">
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
            <p class="empty-state-desc">Suas cobranças e saques aparecerão aqui quando forem gerados.</p>
          </div>
        `
            : `
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-subtle); background:rgba(11, 18, 32, 0.4); color:var(--text-muted); font-size:0.78rem; text-transform:uppercase;">
                  <th style="padding:14px 20px;">Data</th>
                  <th style="padding:14px 20px;">Tipo</th>
                  <th style="padding:14px 20px;">Descrição / Destino</th>
                  <th style="padding:14px 20px;">Status</th>
                  <th style="padding:14px 20px; text-align:right;">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${unified
                  .map((item) => {
                    const isCobranca = item.tipo === 'cobranca'
                    const badgeHtml = isCobranca
                      ? getChargeBadge(item.status || 'Aguardando Pagamento')
                      : getWithdrawalBadge(item.status || 'Aguardando Envio')
                    return `
                    <tr style="border-bottom:1px solid rgba(30, 41, 59, 0.5);">
                      <td style="padding:14px 20px; white-space:nowrap; color:var(--text-muted);">
                        ${formatDate(item.createdAt)}
                      </td>
                      <td style="padding:14px 20px;">
                        <span class="badge ${isCobranca ? 'badge-blue' : 'badge-amber'}" style="font-size:0.7rem;">
                          ${isCobranca ? 'Cobrança Pix' : 'Saque DePix'}
                        </span>
                      </td>
                      <td style="padding:14px 20px;">
                        <strong style="display:block; color:var(--text-main);">${item.descricao || (isCobranca ? 'Cobrança Avulsa' : 'Saque Pix')}</strong>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${item.cliente || item.chavePix || '-'}</span>
                      </td>
                      <td style="padding:14px 20px;">
                        ${badgeHtml}
                      </td>
                      <td style="padding:14px 20px; text-align:right; font-weight:700; color:${isCobranca ? 'var(--accent-emerald)' : '#cbd5e1'};">
                        ${formatBrl(item.valor)}
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
}
