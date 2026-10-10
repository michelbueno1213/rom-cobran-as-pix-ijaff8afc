/**
 * View: Suporte (#/suporte)
 * Contato (e-mail e WhatsApp como texto/ícone)
 * FAQ em acordeão com 3 perguntas exigidas:
 * 1. "O que é DePix?"
 * 2. "O que é a rede Liquid?"
 * 3. "Quando poderei gerar cobranças?"
 */

import { Icons } from '../icons.js'

let openFaqIdx = null

export function renderSuporteView() {
  const faqs = [
    {
      q: 'O que é DePix?',
      a: 'DePix é a versão do Pix na rede Liquid. É um token lastreado 1:1 em reais (BRL), permitindo transferências soberanas, confidencialidade criptográfica e liquidação direta sem custódia bancária tradicional.',
    },
    {
      q: 'O que é a rede Liquid?',
      a: 'A rede Liquid é uma sidechain do Bitcoin desenvolvida pela Blockstream. Ela oferece transferências praticamente instantâneas, taxas previsíveis, suporte a ativos emitidos (como DePix e stablecoins) e transações confidenciais que protegem os valores negociados.',
    },
    {
      q: 'Quando poderei gerar cobranças?',
      a: 'Estamos finalizando nossa integração com a provedora de pagamentos. Assim que as credenciais forem liberadas e validadas, a emissão real de cobranças Pix e a liquidação em DePix estarão plenamente operacionais.',
    },
  ]

  return `
    <div style="max-width:760px; margin:0 auto; display:flex; flex-direction:column; gap:24px;">
      <div>
        <h1 style="margin-bottom:6px;">Suporte & Atendimento</h1>
        <p>Tire suas dúvidas sobre o funcionamento do ecossistema Pix → DePix e contate nosso time.</p>
      </div>

      <!-- CANAIS DE CONTATO -->
      <div class="card">
        <h2 class="card-title">${Icons.helpCircle(20)} Canais Oficiais</h2>
        <p class="card-desc">Nosso suporte atende de segunda a sexta, das 09h às 18h (horário de Brasília).</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
          <div style="padding:16px; background:rgba(11, 18, 32, 0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; align-items:center; gap:14px;">
            <div style="color:var(--accent-emerald); background:var(--accent-emerald-subtle); padding:10px; border-radius:var(--radius-md);">
              ${Icons.mail(20)}
            </div>
            <div>
              <span style="display:block; font-size:0.78rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">E-mail de Suporte</span>
              <strong style="color:var(--text-main); font-size:0.95rem;">suporte@romdepix.com</strong>
            </div>
          </div>

          <div style="padding:16px; background:rgba(11, 18, 32, 0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; align-items:center; gap:14px;">
            <div style="color:var(--accent-emerald); background:var(--accent-emerald-subtle); padding:10px; border-radius:var(--radius-md);">
              ${Icons.phone(20)}
            </div>
            <div>
              <span style="display:block; font-size:0.78rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">WhatsApp Direto</span>
              <strong style="color:var(--text-main); font-size:0.95rem;">+55 (11) 98765-4321</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ EM ACORDEÃO -->
      <div class="card">
        <h2 class="card-title">${Icons.zap(20)} Perguntas Frequentes (FAQ)</h2>
        <p class="card-desc">Respostas diretas sobre tecnologia, liquidação e cronograma do ROM.</p>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${faqs
            .map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return `
              <div style="border:1px solid var(--border-subtle); border-radius:var(--radius-md); background:rgba(11, 18, 32, 0.5); overflow:hidden;">
                <button
                  type="button"
                  class="btn-faq"
                  data-idx="${idx}"
                  style="width:100%; text-align:left; background:transparent; border:none; padding:16px 18px; color:var(--text-main); font-weight:600; font-size:0.95rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer;"
                >
                  <span>${faq.q}</span>
                  <span style="color:var(--accent-emerald); transform:rotate(${isOpen ? '180deg' : '0deg'}); transition:transform 0.2s ease;">
                    ${Icons.chevronDown(18)}
                  </span>
                </button>
                ${
                  isOpen
                    ? `
                  <div style="padding:0 18px 16px 18px; font-size:0.88rem; color:var(--text-muted); line-height:1.6; border-top:1px solid rgba(30, 41, 59, 0.4); padding-top:12px;">
                    ${faq.a}
                  </div>
                `
                    : ''
                }
              </div>
            `
            })
            .join('')}
        </div>
      </div>
    </div>
  `
}

export function initSuporteEvents(currentUser, reRender) {
  document.querySelectorAll('.btn-faq').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10)
      openFaqIdx = openFaqIdx === idx ? null : idx
      reRender()
    })
  })
}
