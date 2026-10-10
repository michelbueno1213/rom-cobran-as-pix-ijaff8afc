/**
 * View: Configurações (#/config)
 * Dados do comerciante: nome, e-mail (desabilitado), telefone, CNPJ opcional
 * Botão "Salvar" com toast "Dados salvos."
 * Seção "Integração & API" com nota exata: "Chaves de API e webhooks serão liberadas junto com a integração de pagamentos."
 */

import { Icons } from '../icons.js'
import { Store } from '../store.js'
import { showToast } from '../toast.js'

export function renderConfigView(currentUser) {
  const settings = currentUser.settings || {}

  return `
    <div style="max-width:760px; margin:0 auto; display:flex; flex-direction:column; gap:24px;">
      <div>
        <h1 style="margin-bottom:6px;">Configurações</h1>
        <p>Gerencie os dados da sua conta de comerciante e credenciais de acesso.</p>
      </div>

      <!-- DADOS DO COMERCIANTE -->
      <div class="card">
        <h2 class="card-title">${Icons.settings(20)} Dados do Comerciante</h2>
        <p class="card-desc">Informações cadastrais exibidas no comprovante e na conta.</p>

        <form id="form-config" novalidate>
          <div class="form-group">
            <label class="form-label" for="config-nome">Nome do comerciante / Razão Social</label>
            <input type="text" id="config-nome" class="form-input" value="${currentUser.nome || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="config-email">E-mail da conta (identificador único)</label>
            <input type="email" id="config-email" class="form-input" value="${currentUser.email || ''}" disabled />
            <span class="form-hint">O e-mail não pode ser alterado após o cadastro inicial.</span>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;" class="config-grid">
            <div class="form-group">
              <label class="form-label" for="config-telefone">Telefone / WhatsApp</label>
              <input type="text" id="config-telefone" class="form-input" placeholder="(11) 98765-4321" value="${settings.telefone || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label" for="config-cnpj">CNPJ (opcional)</label>
              <input type="text" id="config-cnpj" class="form-input" placeholder="00.000.000/0001-00" value="${settings.cnpj || ''}" />
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:10px;">
            Salvar
          </button>
        </form>
      </div>

      <!-- INTEGRAÇÃO & API -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <h2 class="card-title">${Icons.zap(20)} Integração & API</h2>
            <p class="card-desc" style="margin-bottom:0;">Conecte seus sistemas de e-commerce e PDV via REST API</p>
          </div>
          <span class="badge badge-amber">Em Breve</span>
        </div>

        <div class="banner-amber" style="margin-top:14px;">
          ${Icons.alertTriangle(18)}
          <!-- NOTA EXATA REQUERIDA PELA ESPECIFICAÇÃO -->
          <span>Chaves de API e webhooks serão liberadas junto com a integração de pagamentos.</span>
        </div>

        <div style="margin-top:20px; display:flex; flex-direction:column; gap:12px; opacity:0.6;">
          <div class="form-group">
            <label class="form-label">Chave de Produção (API Key)</label>
            <input type="text" class="form-input" value="rom_live_••••••••••••••••••••••••" disabled />
          </div>

          <div class="form-group">
            <label class="form-label">Endpoint de Webhook</label>
            <input type="text" class="form-input" placeholder="https://seu-sistema.com/webhook/pix" disabled />
          </div>
        </div>
      </div>
    </div>
  `
}

export function initConfigEvents(currentUser, reRender) {
  const form = document.getElementById('form-config')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const nomeInput = document.getElementById('config-nome')
      const telInput = document.getElementById('config-telefone')
      const cnpjInput = document.getElementById('config-cnpj')

      const nome = nomeInput.value.trim()
      const telefone = telInput.value.trim()
      const cnpj = cnpjInput.value.trim()

      try {
        Store.updateUserSettings(currentUser.id, { nome, telefone, cnpj })
        showToast('Dados salvos.', 'success', 2500)
        reRender()
      } catch (err) {
        showToast(err.message || 'Erro ao salvar dados.', 'error')
      }
    })
  }
}
