/**
 * View: Início (#/inicio)
 * Conversão exclusiva Pix → DePix (Liquid):
 * - Banner "Em breve" fixo
 * - Card "Valores Liquidados" com R$ 0,00 e nota
 * - Card informativo da conversão exclusiva Pix entra, DePix sai na sua carteira Liquid
 * - Ações rápidas diretas (Nova Cobrança, Meus Links, Pagar Contas, Saque, Carteiras Liquid)
 * - Últimas movimentações (vazio ilustrado)
 */

import { Icons } from '../icons.js'
import { MSG_EM_BREVE, formatBrl, formatDate } from '../utils.js'
import { Store } from '../store.js'

export function renderInicioView(currentUser) {
  const isAdmin = Boolean(currentUser && currentUser.isAdmin)
  const activities = Store.getActivities(currentUser.id).slice(0, 5)

  return `
    <div style="display:flex; flex-direction:column; gap:24px;">
      <!-- BANNER "EM BREVE" FIXO NO TOPO -->
      <div class="banner-amber">
        ${Icons.alertTriangle(22)}
        <div>
          <strong style="display:block; margin-bottom:2px; color:#fde68a;">Aviso importante</strong>
          <span>${MSG_EM_BREVE}</span>
        </div>
      </div>

      <!-- CARD VALORES LIQUIDADOS (NUNCA USAR TERMO "SALDO CUSTODIADO") -->
      <div class="card" style="background: linear-gradient(135deg, #0d1627 0%, #112038 100%); border-color: rgba(16, 185, 129, 0.35); box-shadow: 0 8px 32px -4px rgba(0,0,0,0.6), 0 0 28px -6px rgba(16, 185, 129, 0.2);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <span class="badge badge-green" style="margin-bottom:12px;"><span class="status-dot status-dot-green"></span>Carteira Liquid Conectada</span>
            <h2 style="font-size:1.15rem; color:var(--text-muted); font-weight:600;">Valores Liquidados</h2>
          </div>
          <div class="summary-icon-circle">
            ${Icons.wallet(28)}
          </div>
        </div>

        <div class="tabular-nums" style="font-size:3.2rem; font-weight:800; color:#ffffff; letter-spacing:-0.035em; margin: 4px 0 12px 0; text-shadow: 0 0 32px rgba(16, 185, 129, 0.25);">
          R$ 0,00
        </div>

        <p style="font-size:0.84rem; color:var(--text-muted); line-height:1.55;">
          Pix entra, DePix sai na sua carteira Liquid. Os valores aparecem aqui após a liquidação real das cobranças.
        </p>
      </div>

      <!-- CARD EXCLUSIVO PIX → DEPIX (LIQUID) -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <h3 class="card-title">${Icons.shield(20)} Liquidação Soberana</h3>
            <p class="card-desc" style="margin-bottom:0;">Pix entra, DePix sai na sua carteira Liquid.</p>
          </div>
          <span class="badge badge-green"><span class="status-dot status-dot-green"></span>Liquid Network</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:rgba(11, 18, 32, 0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:50%; background:rgba(16, 185, 129, 0.12); color:var(--accent-emerald); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.75rem;">
              DPX
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <strong style="font-size:0.95rem; color:var(--text-main);">DePix</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">(BRL 1:1)</span>
              </div>
              <span style="font-size:0.75rem; color:var(--text-faint);">Rede Liquid • Sidechain Bitcoin</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            <div style="text-align:right;">
              <span style="display:block; font-size:0.95rem; font-weight:700; color:var(--text-main);">R$ 0,00</span>
              <span style="font-size:0.7rem; color:var(--text-faint);">0.00 DePix</span>
            </div>
            <span class="badge badge-green" style="font-size:0.65rem;">Ativo Único</span>
          </div>
        </div>
      </div>

      <!-- AÇÕES RÁPIDAS -->
      <div>
        <h3 style="margin-bottom:14px; font-size:1rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">
          Ações Rápidas
        </h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px;">
          <a href="#/nova-cobranca" class="card" style="padding:18px; text-decoration:none; display:flex; align-items:center; gap:14px; transition:all 0.15s ease;">
            <div style="color:var(--accent-emerald); background:var(--accent-emerald-subtle); padding:10px; border-radius:var(--radius-md);">
              ${Icons.plusCircle(22)}
            </div>
            <div>
              <strong style="display:block; color:var(--text-main); font-size:0.92rem;">Nova Cobrança</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Pix entra → DePix sai</span>
            </div>
          </a>

          <a href="#/links" class="card" style="padding:18px; text-decoration:none; display:flex; align-items:center; gap:14px; transition:all 0.15s ease;">
            <div style="color:var(--accent-blue); background:var(--accent-blue-subtle); padding:10px; border-radius:var(--radius-md);">
              ${Icons.link(22)}
            </div>
            <div>
              <strong style="display:block; color:var(--text-main); font-size:0.92rem;">Meus Links</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Links e QR fixo</span>
            </div>
          </a>

          <a href="#/pagar-contas" class="card" style="padding:18px; text-decoration:none; display:flex; align-items:center; gap:14px; transition:all 0.15s ease;">
            <div style="color:var(--accent-emerald); background:var(--accent-emerald-subtle); padding:10px; border-radius:var(--radius-md);">
              ${Icons.receipt(22)}
            </div>
            <div>
              <strong style="display:block; color:var(--text-main); font-size:0.92rem;">Pagar Contas</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Boletos & Pix</span>
            </div>
          </a>

          <a href="#/saques" class="card" style="padding:18px; text-decoration:none; display:flex; align-items:center; gap:14px; transition:all 0.15s ease;">
            <div style="color:var(--accent-amber); background:var(--accent-amber-subtle); padding:10px; border-radius:var(--radius-md);">
              ${Icons.withdraw(22)}
            </div>
            <div>
              <strong style="display:block; color:var(--text-main); font-size:0.92rem;">Saque</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">DePix → Chave Pix</span>
            </div>
          </a>

          <a href="#/carteiras" class="card" style="padding:18px; text-decoration:none; display:flex; align-items:center; gap:14px; transition:all 0.15s ease;">
            <div style="color:var(--accent-emerald); background:var(--accent-emerald-subtle); padding:10px; border-radius:var(--radius-md);">
              ${Icons.wallet(22)}
            </div>
            <div>
              <strong style="display:block; color:var(--text-main); font-size:0.92rem;">Carteiras Liquid</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Gerenciar endereços</span>
            </div>
          </a>

          ${
            isAdmin
              ? `
            <a href="#/homologacao" class="card" style="padding:18px; text-decoration:none; display:flex; align-items:center; gap:14px; border-color:rgba(245, 158, 11, 0.3); background:rgba(245, 158, 11, 0.04);">
              <div style="color:var(--accent-amber); background:var(--accent-amber-subtle); padding:10px; border-radius:var(--radius-md);">
                ${Icons.flask(22)}
              </div>
              <div>
                <strong style="display:block; color:var(--accent-amber); font-size:0.92rem;">Homologação</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">Painel de testes admin</span>
              </div>
            </a>
          `
              : ''
          }
        </div>
      </div>

      <!-- ÚLTIMAS MOVIMENTAÇÕES -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h3 class="card-title">Últimas movimentações</h3>
            <p class="card-desc" style="margin-bottom:0;">Movimentações mais recentes na sua conta</p>
          </div>
          <a href="#/historico" class="btn btn-outline btn-sm">Ver todas</a>
        </div>

        ${
          activities.length === 0
            ? `
          <div class="empty-state">
            ${Icons.emptyCoins(64)}
            <h4 class="empty-state-title">Nenhuma movimentação ainda</h4>
            <p class="empty-state-desc">Suas movimentações aparecerão aqui após a liquidação real das cobranças.</p>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${activities
              .map(
                (act) => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(11, 18, 32, 0.5); border-radius:var(--radius-md);">
                <div>
                  <strong style="display:block; font-size:0.9rem;">${act.descricao || 'Operação'}</strong>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${formatDate(act.createdAt)}</span>
                </div>
                <div style="font-weight:700; color:var(--accent-emerald);">
                  ${formatBrl(act.valor)}
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
