import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '#/components/ui/button'

export type ThemeMode = 'light' | 'dark' | 'system'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }

  if (stored === 'auto') {
    return 'system'
  }

  return 'system'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = resolved
}

export function getNextThemeMode(mode: ThemeMode): ThemeMode {
  if (mode === 'light') {
    return 'dark'
  }

  if (mode === 'dark') {
    return 'system'
  }

  return 'light'
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('system')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode = getNextThemeMode(mode)
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const label =
    mode === 'system'
      ? 'Theme mode: system. Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-full bg-card text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Button>
  )
}
