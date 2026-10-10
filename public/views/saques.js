/**
 * View: Saques (#/saques)
 * Texto exato: "Você envia DePix da sua carteira Liquid para o endereço do saque e o valor equivalente cai na chave Pix informada."
 * Atualização paridade DeFlow:
 * - Dropdown "Ativo de saque" (multi-ativos, padrão DePix Liquid)
 * Valor (R$) com máscara BRL
 * Chave Pix com tipo (CPF, CNPJ, e-mail, telefone, aleatória) + favorecido opcional
 * Botão "Solicitar Saque" dispara "Em breve" (bloqueado)
 * Histórico de saques vazio ilustrado
 */

import { Icons } from '../icons.js'
import { attachBrlMask, MULTI_ASSETS } from '../utils.js'
import { showEmBreveToast } from '../toast.js'

export function renderSaquesView() {
  return `
    <div style="max-width:720px; margin:0 auto; display:flex; flex-direction:column; gap:22px;">
      <div>
        <h1 style="margin-bottom:6px;">Saques</h1>
        <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.5;">
          Você envia DePix da sua carteira Liquid para o endereço do saque e o valor equivalente cai na chave Pix informada.
        </p>
      </div>

      <!-- FORMULÁRIO DE SAQUE -->
      <div class="card">
        <h2 class="card-title">${Icons.withdraw(20)} Solicitar Conversão Cripto → Pix</h2>
        <p class="card-desc">Informe o ativo de origem, o valor e a chave Pix bancária de destino.</p>

        <form id="form-saque" novalidate>
          <!-- ATIVO DE ORIGEM DO SAQUE -->
          <div class="form-group">
            <label class="form-label" for="saque-asset">Ativo de origem</label>
            <select id="saque-asset" class="form-select">
              ${MULTI_ASSETS.map(
                (a) =>
                  `<option value="${a.id}" ${a.id === 'depix_liquid' ? 'selected' : ''}>${a.label}</option>`,
              ).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="saque-valor">Valor (R$)</label>
            <input
              type="text"
              id="saque-valor"
              class="form-input"
              value="R$ 0,00"
              style="font-size:1.4rem; font-weight:700; height:50px;"
              required
            />
          </div>

          <div style="display:grid; grid-template-columns: 160px 1fr; gap:12px;" class="saque-grid">
            <div class="form-group">
              <label class="form-label" for="saque-tipo-chave">Tipo de chave</label>
              <select id="saque-tipo-chave" class="form-select">
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="telefone">Telefone</option>
                <option value="aleatoria">Chave aleatória</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="saque-chave">Chave Pix</label>
              <input type="text" id="saque-chave" class="form-input" placeholder="Informe a chave Pix" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="saque-favorecido">Favorecido (opcional)</label>
            <input type="text" id="saque-favorecido" class="form-input" placeholder="Nome completo do titular da conta" />
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; height:46px; margin-top:12px; font-size:0.95rem;">
            Solicitar Saque
          </button>
        </form>
      </div>

      <!-- HISTÓRICO DE SAQUES -->
      <div class="card">
        <h3 class="card-title">Histórico de saques</h3>
        <p class="card-desc">Registro das conversões solicitadas para sua conta bancária</p>

        <div class="empty-state">
          ${Icons.emptyCoins(64)}
          <h4 class="empty-state-title">Nenhum saque solicitado</h4>
          <p class="empty-state-desc">Os saques solicitados aparecerão aqui após a liberação da conexão bancária.</p>
        </div>
      </div>
    </div>
  `
}

export function initSaquesEvents() {
  const saqueValor = document.getElementById('saque-valor')
  if (saqueValor) attachBrlMask(saqueValor)

  const form = document.getElementById('form-saque')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      // Dispara toast com a mensagem exata requerida pela especificação
      showEmBreveToast()
    })
  }
}
