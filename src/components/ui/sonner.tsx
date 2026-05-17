import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Toaster as Sonner } from 'sonner'

import type { CSSProperties, ReactElement } from 'react'
import type { ToasterProps } from 'sonner'

const toasterStyle = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius)',
} as CSSProperties

const toastIcons = {
  success: <CircleCheckIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error: <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
} satisfies ToasterProps['icons']

function Toaster({ theme = 'system', ...props }: ToasterProps): ReactElement {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={toastIcons}
      style={toasterStyle}
      {...props}
    />
  )
}

export { Toaster }
