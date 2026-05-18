import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { RouteErrorState } from '#/components/shared/RouteErrorState'
import { RoutePendingSkeleton } from '#/components/shared/RoutePendingSkeleton'
import {
  done as doneLoadingBar,
  start as startLoadingBar,
} from '#/lib/loading-bar'

import type { ReactNode } from 'react'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import TanstackQueryProvider, {
  getContext,
} from './integrations/tanstack-query/root-provider'

export function getRouter() {
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: RouteErrorState,
    defaultPendingComponent: RoutePendingSkeleton,

    Wrap: (props: { children: ReactNode }) => {
      return (
        <TanstackQueryProvider context={context}>
          {props.children}
        </TanstackQueryProvider>
      )
    },
  })

  router.subscribe('onBeforeLoad', (event) => {
    if (event.hrefChanged) {
      startLoadingBar()
    }
  })

  router.subscribe('onResolved', () => {
    doneLoadingBar()
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
