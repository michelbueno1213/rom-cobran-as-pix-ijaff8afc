/**
 * Utilitários do ROM
 * - Máscara e formatação BRL
 * - Formatação de datas
 * - Geração de UUID
 * - Validação de endereço Liquid (lq1 ou ex1)
 * - Mensagens padrão
 */

export const MSG_EM_BREVE =
  'Em breve: geração de cobranças Pix. Estamos finalizando nossa integração com a provedora de pagamentos.'

export const MSG_RODAPE =
  'Emissão real de cobranças habilitada somente após aprovação da provedora e implantação das credenciais.'

/**
 * Ativo único oficial: DePix na rede Liquid
 * A plataforma opera exclusivamente com Pix entra e DePix sai na carteira Liquid.
 */
export const PRIMARY_ASSET = {
  id: 'depix_liquid',
  symbol: 'DePix',
  name: 'DePix',
  network: 'Liquid',
  label: 'DePix (Liquid)',
}

export const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatBrl(centsOrValue) {
  const num = typeof centsOrValue === 'number' ? centsOrValue : Number(centsOrValue) || 0
  return brlFormatter.format(num)
}

export function formatDate(dateInput) {
  if (!dateInput) return '-'
  try {
    const d =
      typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput
    return dateFormatter.format(d)
  } catch {
    return '-'
  }
}

export function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Valida se o endereço Liquid começa com lq1 ou ex1
 */
export function isValidLiquidAddress(address) {
  if (!address || typeof address !== 'string') return false
  const trimmed = address.trim().toLowerCase()
  return (trimmed.startsWith('lq1') || trimmed.startsWith('ex1')) && trimmed.length >= 10
}

/**
 * Aplica máscara BRL dinâmica em um input de texto
 * Converte dígitos digitados em centavos e formata como R$ 0,00
 */
export function attachBrlMask(inputElement, onValueChange) {
  if (!inputElement) return

  const formatRawDigits = (digitsStr) => {
    const cleanDigits = digitsStr.replace(/\D/g, '')
    if (!cleanDigits) {
      return { formatted: 'R$ 0,00', cents: 0, floatValue: 0 }
    }
    const cents = parseInt(cleanDigits, 10)
    const floatValue = cents / 100
    return {
      formatted: brlFormatter.format(floatValue),
      cents,
      floatValue,
    }
  }

  // Inicializa
  if (!inputElement.value) {
    inputElement.value = 'R$ 0,00'
  }

  const handleInput = (e) => {
    const res = formatRawDigits(e.target.value)
    inputElement.value = res.formatted
    if (onValueChange) {
      onValueChange(res.floatValue, res.cents)
    }
  }

  inputElement.addEventListener('input', handleInput)
  return () => {
    inputElement.removeEventListener('input', handleInput)
  }
}

export function parseBrlValue(valueStr) {
  if (typeof valueStr === 'number') return valueStr
  if (!valueStr) return 0
  const cleanDigits = String(valueStr).replace(/\D/g, '')
  if (!cleanDigits) return 0
  return parseInt(cleanDigits, 10) / 100
}

export function truncateAddress(addr, head = 10, tail = 8) {
  if (!addr) return ''
  if (addr.length <= head + tail + 3) return addr
  return `${addr.slice(0, head)}...${addr.slice(-tail)}`
}
