import { toast } from 'sonner'

export const useNotifications = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      closeButton: true,
      ...options
    })
  }

  const showError = (message, options = {}) => {
    toast.error(message, {
      duration: 6000,
      position: 'top-right',
      closeButton: true,
      ...options
    })
  }

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      duration: 4000,
      position: 'top-right',
      closeButton: true,
      ...options
    })
  }

  const showWarning = (message, options = {}) => {
    toast.warning(message, {
      duration: 5000,
      position: 'top-right',
      closeButton: true,
      ...options
    })
  }

  const showLoading = (message) => {
    return toast.loading(message, {
      position: 'top-right',
      closeButton: true
    })
  }

  const showProgress = (message, progress) => {
    return toast.loading(message, {
      position: 'top-right',
      closeButton: true,
      description: `${Math.round(progress)}%`
    })
  }

  const dismiss = (toastId) => {
    toast.dismiss(toastId)
  }

  const showTopLeft = (message, type = 'info') => {
    const toastFunction = toast[type] || toast.info
    return toastFunction(message, {
      position: 'top-left',
      duration: 3000,
      closeButton: true
    })
  }

  const showBottomRight = (message, type = 'info') => {
    const toastFunction = toast[type] || toast.info
    return toastFunction(message, {
      position: 'bottom-right',
      duration: 3000,
      closeButton: true
    })
  }

  const showBottomLeft = (message, type = 'info') => {
    const toastFunction = toast[type] || toast.info
    return toastFunction(message, {
      position: 'bottom-left',
      duration: 3000,
      closeButton: true
    })
  }

  const updateToast = (toastId, message, type = 'success') => {
    toast.dismiss(toastId)
    if (type === 'success') {
      toast.success(message, { 
        position: 'top-right',
        closeButton: true
      })
    } else if (type === 'error') {
      toast.error(message, { 
        position: 'top-right',
        closeButton: true
      })
    }
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    showProgress,
    showTopLeft,
    showBottomRight,
    showBottomLeft,
    dismiss,
    updateToast
  }
}
