---
name: shadcn-development
description: shadcn/ui component usage — installation, theming, dark mode, block integration, business component patterns
---

# Skill: shadcn-development

## Purpose
shadcn/ui component usage patterns, theme system, dark mode, block integration. Activate when building ANY UI component.

## Patterns

### Component Installation
```bash
rtk pnpm dlx shadcn@latest add button
rtk pnpm dlx shadcn@latest add dialog select input textarea label
rtk pnpm dlx shadcn@latest add table card badge separator breadcrumb
rtk pnpm dlx shadcn@latest add sonner   # toast notifications
rtk pnpm dlx shadcn@latest add chart    # recharts wrapper
```

### cn() Utility
```tsx
import { cn } from '#/lib/utils'

// Merge classes, handle conditionals
<div className={cn(
  'base-class',
  isActive && 'active-class',
  className // from props
)} />
```

### Dark Mode in Components
```tsx
// Every component must handle dark mode
<div className="bg-card text-card-foreground border border-border">
  <h2 className="text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>

// Use CSS variables — NEVER hardcode hex
// ✅ bg-card text-foreground
// ❌ bg-white text-gray-900 dark:bg-gray-900 dark:text-white
```

### Business Component Pattern
```tsx
// src/components/cards/CreditCardCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'
import type { CreditCard } from '#/server/repositories/cards.repo'

interface CreditCardCardProps {
  card: CreditCard
  className?: string
}

export function CreditCardCard({ card, className }: CreditCardCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader>
        <Badge variant="secondary">{card.bank}</Badge>
        <CardTitle className="font-display">{card.shortName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{card.bestFor}</p>
      </CardContent>
    </Card>
  )
}
```

### Block Integration
shadcn blocks (dashboard-01, login-01, signup-01) are installed as components.
Customize them by:
1. Install block: `rtk pnpm dlx shadcn@latest add dashboard-01`
2. Find in `src/components/`
3. Edit text, branding, colors to match JustMiles theme
4. Keep the structure — blocks handle responsive + dark mode automatically

### Chart Components
```tsx
// Follow https://ui.shadcn.com/charts
import { AreaChart, BarChart, LineChart } from '#/components/charts'

// Charts use Recharts internally
// Always test in both light and dark mode
```

## Anti-patterns
- ❌ Copy-pasting from shadcn docs instead of using CLI
- ❌ Building custom modal/dialog/select from scratch
- ❌ Using non-lucide icons (no FontAwesome, no Material Icons)
- ❌ Modifying `src/components/ui/*.tsx` directly
- ❌ Hardcoding colors — always use Tailwind classes or CSS variables
- ❌ Forgetting dark mode on any component

## Verification
```bash
rtk pnpm dev  # Visual check: both light and dark modes
```
