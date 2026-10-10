/**
 * View: Suporte (#/suporte)
 * Atualizada:
 * - Banner no topo com mensagem de privacidade:
 *   "Suporte que respeita sua privacidade. IA 24 horas para dúvidas rápidas e gente de verdade quando importa."
 * - Seção "Precisa de ajuda agora?" com botão "Falar com o assistente ROM" -> exibe estado "Em breve"
 * - FAQ em acordeão existente mantido + 2 novas perguntas:
 *   1. "Preciso de KYC para usar a ROM?"
 *   2. "Quais ativos a ROM suporta?"
 */

import { Icons } from '../icons.js'
import { showEmBreveToast } from '../toast.js'

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
    {
      q: 'Preciso de KYC para usar a ROM?',
      a: 'Não para começar. Você pode abrir sua conta e cadastrar suas carteiras sem expor dados sensíveis ou fotos de documentos. Procedimentos adicionais de KYC só ocorrerão se a provedora parceira de liquidação bancária vier a exigir por força regulatória, e você será previamente avisado.',
    },
    {
      q: 'Quais ativos a ROM suporta?',
      a: 'A ROM suporta DePix (Liquid), USDT (Polygon, Solana, Ethereum, Tron, Arbitrum, Liquid), USDC (Ethereum, Polygon, Solana, BNB Smart Chain, Base), BTC (Liquid, Onchain, Lightning) e USDG (xLayer).',
    },
  ]

  return `
    <div style="max-width:760px; margin:0 auto; display:flex; flex-direction:column; gap:24px;">
      <div>
        <h1 style="margin-bottom:6px;">Suporte & Atendimento</h1>
        <p>Tire suas dúvidas sobre o ecossistema Pix → DePix e contate nosso time.</p>
      </div>

      <!-- BANNER DE PRIVACIDADE NO TOPO -->
      <div class="banner-amber" style="border-left:4px solid var(--accent-emerald);">
        ${Icons.shield(22)}
        <div>
          <strong style="display:block; margin-bottom:2px; color:#fde68a;">Atendimento soberano</strong>
          <span>Suporte que respeita sua privacidade. IA 24 horas para dúvidas rápidas e gente de verdade quando importa.</span>
        </div>
      </div>

      <!-- SEÇÃO ASSISTENTE IA ROM -->
      <div class="card" style="background:linear-gradient(135deg, #131c2e 0%, #17243c 100%); border-color:rgba(59, 130, 246, 0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span class="badge badge-blue">Inteligência Artificial 24h</span>
            </div>
            <h3 style="font-size:1.15rem; margin-bottom:4px;">Precisa de ajuda agora?</h3>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0;">
              Nosso assistente virtual tira dúvidas sobre carteiras, redes e liquidação instantaneamente.
            </p>
          </div>

          <button type="button" id="btn-assistente-rom" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
            ${Icons.bot(18)}
            Falar com o assistente ROM
          </button>
        </div>
      </div>

      <!-- CANAIS DE CONTATO -->
      <div class="card">
        <h2 class="card-title">${Icons.helpCircle(20)} Canais Oficiais</h2>
        <p class="card-desc">Gente de verdade quando importa: atendimento de segunda a sexta, das 09h às 18h (horário de Brasília).</p>

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
        <p class="card-desc">Respostas diretas sobre tecnologia, liquidação, privacidade e cronograma do ROM.</p>

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
  // Botão assistente ROM dispara toast "Em breve"
  const btnAssistente = document.getElementById('btn-assistente-rom')
  if (btnAssistente) {
    btnAssistente.addEventListener('click', () => {
      showEmBreveToast()
    })
  }

  document.querySelectorAll('.btn-faq').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10)
      openFaqIdx = openFaqIdx === idx ? null : idx
      reRender()
    })
  })
}
