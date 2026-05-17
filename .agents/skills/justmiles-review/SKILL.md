---
name: justmiles-review
description: Adversarial code review checklist — 40+ items covering architecture, TypeScript, dark mode, mobile, shadcn, performance, a11y, JustMiles-specific rules
---

# Skill: justmiles-review

## Purpose
Project-specific adversarial code review checklist. Run after every story implementation. Find at minimum 10 issues — assume problems exist and hunt for them.

## Review Checklist

### Architecture Violations
- [ ] Any raw fetch/axios calls? → Replace with tRPC
- [ ] Any direct Prisma imports in components/routes? → Move to repository
- [ ] Any custom UI primitives that shadcn provides? → Replace with shadcn
- [ ] Any manual route configs? → Use file-router conventions
- [ ] Any business logic in components? → Extract to `src/lib/`

### TypeScript
- [ ] Any `any` types? → Replace with proper types
- [ ] Missing return types on exported functions? → Add explicit types
- [ ] Zod schema for every tRPC input? → Add if missing
- [ ] `as` casts that could be unsafe? → Use type guards instead

### Dark Mode
- [ ] Any hardcoded colors (white, black, gray)? → Use CSS variables
- [ ] Component tested in dark mode? → Verify in both modes
- [ ] Text readable on dark backgrounds? → Check contrast
- [ ] Borders visible in dark mode? → Use `border-border`

### Mobile Responsive
- [ ] Layout breaks at 375px? → Fix grid/stack
- [ ] Table overflows on mobile? → Add scrollable wrapper
- [ ] Text too small on mobile? → min 14px body, min 12px captions
- [ ] Touch targets ≥ 44px? → Check buttons/links
- [ ] Mobile menu works? → Test hamburger + drawer

### shadcn/ui Specific
- [ ] Components installed via CLI, not copied manually? → Use `pnpm dlx shadcn@latest add`
- [ ] Using `cn()` utility for className merging? → Import from `#/lib/utils`
- [ ] shadcn CSS variables intact? → Check `src/styles.css`
- [ ] Icons from lucide-react only? → No other icon libraries

### Performance
- [ ] Images have dimensions or aspect-ratio? → Prevent layout shift
- [ ] Large components memoized if needed? → `React.memo` for expensive renders
- [ ] Server data loaded in loader, not useEffect? → Use TanStack Start loader
- [ ] No unnecessary re-renders from inline objects? → Extract to const

### Accessibility
- [ ] All form inputs have labels? → Use shadcn Label or aria-label
- [ ] Icon-only buttons have aria-label? → Add descriptive label
- [ ] Keyboard navigation works? → Tab through interactive elements
- [ ] Focus visible on all interactive elements? → Check :focus-visible styles

### Error & Empty States
- [ ] Loading state shown? → Skeleton or spinner
- [ ] Empty state shown? → "No cards found" etc. with helpful message
- [ ] Error state handled? → Error boundary or inline error display
- [ ] Network errors show user-friendly message? → Not raw error objects

### JustMiles-Specific
- [ ] Calculator formula correct? → Verify: ceil(Amount/SpendPerPoint) × PointsEarned
- [ ] Rating thresholds correct? → Verify: Excellent ≤7500, VeryGood ≤12500, etc.
- [ ] Premium content gated? → Check article access for non-subscribers
- [ ] Card data matches ../reference.html? → Spot-check 3 cards
- [ ] Newsletter CTA present where expected? → Home, articles, listing pages

### Code Quality
- [ ] File size < 300 lines? → Split if larger
- [ ] One component per file (except co-located)? → Extract sub-components
- [ ] Import path uses `#/` alias? → Fix relative imports
- [ ] Unused imports removed? → ESLint should catch, verify
- [ ] Comments explain WHY, not WHAT? → Remove obvious comments

## Review Output Format
```markdown
## Code Review: [Story ID] — [Story Name]

### Issues Found (target ≥ 10)
1. **[HIGH/MED/LOW]** [Issue description] — [File]:[line]
2. ...

### Summary
- High: X | Medium: Y | Low: Z
- All issues addressed: [YES/NO]
- Ready for next story: [YES/NO]
```

## Verification
After fixes applied:
```bash
rtk pnpm lint && rtk pnpm check && rtk pnpm build && rtk pnpm test
```
All must pass.
