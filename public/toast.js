/**
 * Sistema Global de Toast
 */
import { Icons } from './icons.js'

export function showToast(message, type = 'warning', durationMs = 4000) {
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    document.body.appendChild(container)
  }

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`

  let iconSvg = Icons.alertTriangle(20)
  if (type === 'success') {
    iconSvg = Icons.checkCircle(20)
  } else if (type === 'error') {
    iconSvg = Icons.alertTriangle(20)
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <div class="toast-body">${message}</div>
    <button class="toast-close" aria-label="Fechar notificação">${Icons.close(16)}</button>
  `

  const closeBtn = toast.querySelector('.toast-close')
  const dismiss = () => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(-10px)'
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast)
      }
    }, 200)
  }

  closeBtn.addEventListener('click', dismiss)

  if (durationMs > 0) {
    setTimeout(dismiss, durationMs)
  }

  container.appendChild(toast)
}

/**
 * Atalho para a mensagem exata de "Em breve" exigida pela especificação
 */
export function showEmBreveToast() {
  showToast(
    'Em breve: geração de cobranças Pix. Estamos finalizando nossa integração com a provedora de pagamentos.',
    'warning',
    4000,
  )
}
