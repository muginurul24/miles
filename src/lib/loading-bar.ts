import NProgress from 'nprogress'

NProgress.configure({
  showSpinner: false,
  speed: 200,
  trickleSpeed: 200,
  minimum: 0.08,
})

let completionTimer: ReturnType<typeof setTimeout> | undefined

export function startLoadingBar(): void {
  if (completionTimer) {
    clearTimeout(completionTimer)
    completionTimer = undefined
  }

  if (!NProgress.isStarted()) {
    NProgress.start()
  }
}

export function completeLoadingBar(): void {
  completionTimer = setTimeout(() => {
    NProgress.done()
    completionTimer = undefined
  }, 80)
}
