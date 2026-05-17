import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'

import type { LinkProps, RegisteredRouter } from '@tanstack/react-router'
import type { ReactElement, ReactNode } from 'react'

type BreadcrumbTo = NonNullable<
  LinkProps<'a', RegisteredRouter, string, string>['to']
>

export interface BreadcrumbEntry {
  label: string
  to?: BreadcrumbTo
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbEntry[]
  className?: string
}

export function Breadcrumb({
  items,
  className,
}: BreadcrumbProps): ReactElement | null {
  if (items.length === 0) {
    return null
  }

  return (
    <BreadcrumbRoot className={className}>
      <BreadcrumbList className="gap-1 text-xs sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const linkContent: ReactNode = item.to ? (
            <Link
              to={item.to}
              className="max-w-[12rem] truncate text-muted-foreground no-underline hover:text-accent"
            >
              {item.label}
            </Link>
          ) : (
            <a
              href={item.href ?? '#'}
              className="max-w-[12rem] truncate text-muted-foreground no-underline hover:text-accent"
            >
              {item.label}
            </a>
          )

          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="max-w-[16rem] truncate font-medium">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>{linkContent}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
