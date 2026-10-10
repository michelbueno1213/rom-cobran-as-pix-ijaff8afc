/**
 * View: Meus Links (#/links)
 * Abas: "Links de Pagamento" e "QR Fixo"
 * Atualização paridade DeFlow:
 * - Opção de tipo de QR (Estático / Dinâmico)
 * - Para QR dinâmico: campo de expiração (15 min / 1 hora / 24 horas / sem expiração)
 * Criação bloqueada com a mensagem "Em breve" exata (toast + banner)
 * NUNCA gerar link ou QR fictício; lista com estado vazio ilustrado
 */

import { Icons } from '../icons.js'
import { attachBrlMask } from '../utils.js'
import { showEmBreveToast } from '../toast.js'

let activeTab = 'links' // 'links' | 'qr'
let qrType = 'estatico' // 'estatico' | 'dinamico'

export function renderLinksView() {
  return `
    <div style="max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:22px;">
      <div>
        <h1 style="margin-bottom:6px;">Meus Links</h1>
        <p>Links reutilizáveis e QR Codes fixos para recebimento ágil de pagamentos Pix.</p>
      </div>

      <!-- BANNER AVISO EM BREVE -->
      <div class="banner-amber">
        ${Icons.alertTriangle(22)}
        <div>
          <strong style="display:block; margin-bottom:2px; color:#fde68a;">Links de Pagamento e QR Code Pix</strong>
          <span>Em breve: geração de cobranças Pix. Estamos finalizando nossa integração com a provedora de pagamentos.</span>
        </div>
      </div>

      <!-- ABAS -->
      <div style="display:flex; border-bottom:1px solid var(--border-subtle); gap:16px;">
        <button
          type="button"
          id="tab-btn-links"
          class="btn"
          style="background:transparent; border:none; border-bottom:2px solid ${
            activeTab === 'links' ? 'var(--accent-emerald)' : 'transparent'
          }; border-radius:0; color:${activeTab === 'links' ? 'var(--accent-emerald)' : 'var(--text-muted)'}; padding:10px 16px; font-weight:600;"
        >
          ${Icons.link(18)} Links de Pagamento
        </button>
        <button
          type="button"
          id="tab-btn-qr"
          class="btn"
          style="background:transparent; border:none; border-bottom:2px solid ${
            activeTab === 'qr' ? 'var(--accent-emerald)' : 'transparent'
          }; border-radius:0; color:${activeTab === 'qr' ? 'var(--accent-emerald)' : 'var(--text-muted)'}; padding:10px 16px; font-weight:600;"
        >
          ${Icons.qrCode(18)} QR Fixo
        </button>
      </div>

      ${
        activeTab === 'links'
          ? `
        <!-- ABA LINKS DE PAGAMENTO -->
        <div class="card">
          <h2 class="card-title">${Icons.link(20)} Novo Link de Pagamento</h2>
          <p class="card-desc">Crie um link compartilhável para enviar a clientes por WhatsApp ou redes sociais.</p>

          <form id="form-link-pagamento" novalidate>
            <div class="form-group">
              <label class="form-label" for="link-titulo">Título do link</label>
              <input type="text" id="link-titulo" class="form-input" placeholder="Ex: Produto VIP ou Taxa de Inscrição" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="link-preco">Preço (R$)</label>
              <input type="text" id="link-preco" class="form-input" value="R$ 0,00" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="link-tipo-qr">Tipo de QR do link</label>
              <select id="link-tipo-qr" class="form-select">
                <option value="estatico" ${qrType === 'estatico' ? 'selected' : ''}>Estático (mesmo QR para pagamentos recorrentes)</option>
                <option value="dinamico" ${qrType === 'dinamico' ? 'selected' : ''}>Dinâmico (um QR novo por tentativa com expiração)</option>
              </select>
            </div>

            ${
              qrType === 'dinamico'
                ? `
              <div class="form-group">
                <label class="form-label" for="link-expiracao">Tempo de expiração do QR dinâmico</label>
                <select id="link-expiracao" class="form-select">
                  <option value="15m">15 minutos</option>
                  <option value="1h">1 hora</option>
                  <option value="24h">24 horas</option>
                  <option value="sem">Sem expiração</option>
                </select>
              </div>
            `
                : ''
            }

            <div class="form-group">
              <label class="form-label" for="link-descricao">Descrição (opcional)</label>
              <textarea id="link-descricao" class="form-textarea" rows="2" placeholder="Detalhes do que está sendo cobrado"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top:10px;">
              Criar Link
            </button>
          </form>
        </div>

        <div class="card" style="margin-top:8px;">
          <h3 class="card-title">Links cadastrados</h3>
          <div class="empty-state">
            ${Icons.emptyBox(64)}
            <h4 class="empty-state-title">Nenhum link de pagamento criado</h4>
            <p class="empty-state-desc">Os links de pagamento que você criar aparecerão aqui quando a integração for concluída.</p>
          </div>
        </div>
      `
          : `
        <!-- ABA QR FIXO -->
        <div class="card">
          <h2 class="card-title">${Icons.qrCode(20)} Novo QR Fixo de Balcão</h2>
          <p class="card-desc">Ideal para display impresso em pontos de venda físicos.</p>

          <form id="form-qr-fixo" novalidate>
            <div class="form-group">
              <label class="form-label" for="qr-slug">Identificador / Slug</label>
              <div style="display:flex; align-items:center;">
                <span style="background:#090e1a; padding:11px 14px; border:1px solid var(--border-strong); border-right:none; border-radius:var(--radius-md) 0 0 var(--radius-md); color:var(--text-muted); font-size:0.9rem;">
                  rom.com/qr/
                </span>
                <input type="text" id="qr-slug" class="form-input" style="border-radius:0 var(--radius-md) var(--radius-md) 0;" placeholder="balcao-loja-1" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="qr-tipo-fixo">Tipo de QR</label>
              <select id="qr-tipo-fixo" class="form-select">
                <option value="estatico" ${qrType === 'estatico' ? 'selected' : ''}>Estático (QR impresso reutilizável)</option>
                <option value="dinamico" ${qrType === 'dinamico' ? 'selected' : ''}>Dinâmico (gera novo código a cada escaneamento)</option>
              </select>
            </div>

            ${
              qrType === 'dinamico'
                ? `
              <div class="form-group">
                <label class="form-label" for="qr-expiracao">Tempo de expiração</label>
                <select id="qr-expiracao" class="form-select">
                  <option value="15m">15 minutos</option>
                  <option value="1h">1 hora</option>
                  <option value="24h">24 horas</option>
                  <option value="sem">Sem expiração</option>
                </select>
              </div>
            `
                : ''
            }

            <div class="form-group">
              <label class="form-label" for="qr-valor">Valor padrão (R$, opcional)</label>
              <input type="text" id="qr-valor" class="form-input" value="R$ 0,00" />
              <span class="form-hint">Se deixar zerado, o pagador poderá digitar o valor no momento do Pix.</span>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top:10px;">
              Gerar QR Fixo
            </button>
          </form>
        </div>

        <div class="card" style="margin-top:8px;">
          <h3 class="card-title">QR Codes fixos</h3>
          <div class="empty-state">
            ${Icons.emptyBox(64)}
            <h4 class="empty-state-title">Nenhum QR fixo cadastrado</h4>
            <p class="empty-state-desc">Seus QR Codes fixos aparecerão aqui após a homologação da integração de pagamentos.</p>
          </div>
        </div>
      `
      }
    </div>
  `
}

export function initLinksEvents(currentUser, reRender) {
  const tabLinks = document.getElementById('tab-btn-links')
  const tabQr = document.getElementById('tab-btn-qr')

  if (tabLinks) {
    tabLinks.addEventListener('click', () => {
      activeTab = 'links'
      reRender()
    })
  }

  if (tabQr) {
    tabQr.addEventListener('click', () => {
      activeTab = 'qr'
      reRender()
    })
  }

  const selectLinkTipoQr = document.getElementById('link-tipo-qr')
  if (selectLinkTipoQr) {
    selectLinkTipoQr.addEventListener('change', (e) => {
      qrType = e.target.value
      reRender()
    })
  }

  const selectQrTipoFixo = document.getElementById('qr-tipo-fixo')
  if (selectQrTipoFixo) {
    selectQrTipoFixo.addEventListener('change', (e) => {
      qrType = e.target.value
      reRender()
    })
  }

  const precoInput = document.getElementById('link-preco')
  if (precoInput) attachBrlMask(precoInput)

  const qrValorInput = document.getElementById('qr-valor')
  if (qrValorInput) attachBrlMask(qrValorInput)

  // Submissão do formulário de Links: SEMPRE bloqueia com a mensagem exata
  const formLink = document.getElementById('form-link-pagamento')
  if (formLink) {
    formLink.addEventListener('submit', (e) => {
      e.preventDefault()
      showEmBreveToast()
    })
  }

  // Submissão do formulário de QR Fixo: SEMPRE bloqueia com a mensagem exata
  const formQr = document.getElementById('form-qr-fixo')
  if (formQr) {
    formQr.addEventListener('submit', (e) => {
      e.preventDefault()
      showEmBreveToast()
    })
  }
}
