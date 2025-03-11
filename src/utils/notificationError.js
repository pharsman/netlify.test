import { createToastNotification } from 'master-components-react'
import close from '@/assets/icons/close.svg?raw'
import { notificationStyle } from '@/utils/notificationStyle'

export const notificationError = (error, text) => {
  if (error || text) {
    return createToastNotification(text, 3000, 'bottom-right', null, null, close, notificationStyle('error'))
  }

  return createToastNotification('Something went wrong', 3000, 'bottom-right', null, null, close, notificationStyle('error'))
}
