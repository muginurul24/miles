import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
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

export function showToast(message: string): ReturnType<typeof toast.success> {
  return toast.success(message, {
    duration: 3000,
    icon: (
      <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
    ),
  })
}

export function showErrorToast(
  message: string,
): ReturnType<typeof toast.error> {
  return toast.error(message, {
    duration: 4000,
    icon: (
      <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
    ),
  })
}
