import { Toaster } from '#/components/ui/sonner'

import type { ReactElement } from 'react'

export function ToastViewport(): ReactElement {
  return (
    <Toaster
      closeButton
      richColors
      expand
      position="bottom-right"
      duration={3000}
    />
  )
}
