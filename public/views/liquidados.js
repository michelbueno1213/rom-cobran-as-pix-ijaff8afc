/**
 * View: Valores Liquidados (#/liquidados)
 * Total geral R$ 0,00 com nota padrão
 * Resumo por carteira (cada uma R$ 0,00)
 * Filtro por período (Hoje, 7 dias, 30 dias, Este mês, Este ano, Tudo)
 */

import { Icons } from '../icons.js'
import { truncateAddress } from '../utils.js'
import { Store } from '../store.js'

let activePeriod = 'tudo'

export function renderLiquidadosView(currentUser) {
  const wallets = Store.getWallets(currentUser.id)

  const periods = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: '7 dias' },
    { id: '30d', label: '30 dias' },
    { id: 'mes', label: 'Este mês' },
    { id: 'ano', label: 'Este ano' },
    { id: 'tudo', label: 'Tudo' },
  ]

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
        <div>
          <h1 style="margin-bottom:6px;">Valores Liquidados</h1>
          <p>Consolidação do volume liquidado diretamente na rede Liquid.</p>
        </div>

        <!-- FILTRO POR PERÍODO -->
        <div style="display:inline-flex; background:rgba(19, 28, 46, 0.8); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:3px; flex-wrap:wrap;">
          ${periods
            .map(
              (p) => `
            <button
              type="button"
              class="btn btn-sm btn-period ${activePeriod === p.id ? 'btn-primary' : 'btn-outline'}"
              data-period="${p.id}"
              style="border:none;"
            >
              ${p.label}
            </button>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- CARD TOTAL GERAL -->
      <div class="card" style="background: linear-gradient(135deg, #0d1627 0%, #112038 100%); border-color: rgba(16, 185, 129, 0.35); box-shadow: 0 8px 32px -4px rgba(0,0,0,0.6), 0 0 28px -6px rgba(16, 185, 129, 0.2);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="badge badge-green" style="margin-bottom:12px;"><span class="status-dot status-dot-green"></span>Volume Total Liquidado</span>
            <div class="tabular-nums" style="font-size:3.4rem; font-weight:800; color:#ffffff; letter-spacing:-0.035em; margin: 4px 0 12px 0; text-shadow: 0 0 32px rgba(16, 185, 129, 0.25);">
              R$ 0,00
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0; line-height:1.55;">
              Os valores aparecem aqui após a liquidação real das cobranças.
            </p>
          </div>
          <div class="summary-icon-circle" style="width:64px; height:64px;">
            ${Icons.wallet(36)}
          </div>
        </div>
      </div>

      <!-- RESUMO POR CARTEIRA -->
      <div class="card">
        <h3 class="card-title">Resumo por Carteira Liquid</h3>
        <p class="card-desc">Volume liquidado individualmente em cada endereço cadastrado</p>

        ${
          wallets.length === 0
            ? `
          <div class="empty-state">
            ${Icons.emptyBox(64)}
            <h4 class="empty-state-title">Nenhuma carteira cadastrada</h4>
            <p class="empty-state-desc">Cadastre endereços Liquid na aba Carteiras para visualizar o resumo por endereço.</p>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${wallets
              .map(
                (w) => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; background:rgba(11, 18, 32, 0.5); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div style="display:flex; align-items:center; gap:12px;">
                  <span style="color:var(--accent-emerald);">${Icons.wallet(20)}</span>
                  <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <strong style="color:var(--text-main); font-size:0.92rem;">${w.apelido}</strong>
                      ${w.is_default ? '<span class="badge badge-green" style="font-size:0.65rem;">Padrão</span>' : ''}
                    </div>
                    <code style="font-family:monospace; font-size:0.75rem; color:var(--text-muted);">${truncateAddress(w.address, 14, 10)}</code>
                  </div>
                </div>

                <div style="text-align:right;">
                  <span style="display:block; font-size:1.15rem; font-weight:800; color:var(--text-main);">
                    R$ 0,00
                  </span>
                  <span style="font-size:0.72rem; color:var(--text-muted);">0 transações</span>
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

export function initLiquidadosEvents(currentUser, reRender) {
  document.querySelectorAll('.btn-period').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const period = e.currentTarget.getAttribute('data-period')
      if (period) {
        activePeriod = period
        reRender()
      }
    })
  })
}
