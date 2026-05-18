import { Suspense, lazy } from 'react'

import type { ReactElement } from 'react'

const ToastViewport = lazy(async () => {
  const module = await import('./ToastViewport')
  return { default: module.ToastViewport }
})

export function LazyToastViewport(): ReactElement {
  return (
    <Suspense fallback={null}>
      <ToastViewport />
    </Suspense>
  )
}
