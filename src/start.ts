import { createMiddleware, createStart } from '@tanstack/react-start'
import { getResponse } from '@tanstack/react-start/server'
import { applySecurityHeaders } from '#/lib/security-headers'

const securityHeaders = createMiddleware().server(async ({ next }) => {
  const response = getResponse()
  applySecurityHeaders(response.headers)

  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeaders],
}))
