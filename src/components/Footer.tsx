import { Instagram, Mail, Plane, Send, Youtube } from 'lucide-react'

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const footerColumns: FooterColumn[] = [
  {
    title: 'Tools',
    links: [
      { label: 'Calculator', href: '/calculator' },
      { label: 'Compare Cards', href: '/compare' },
      { label: 'Advisor Quiz', href: '/quiz' },
    ],
  },
  {
    title: 'Konten',
    links: [
      { label: 'News', href: '/news' },
      { label: 'Guides', href: '/guides' },
      { label: 'Reviews', href: '/reviews/flight' },
      { label: 'Deals', href: '/deals' },
    ],
  },
  {
    title: 'Layanan',
    links: [
      { label: 'Credit Cards', href: '/credit-cards' },
      { label: 'Membership', href: '/membership' },
      { label: 'Consulting', href: '/consulting' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/justmiles.id',
    icon: Instagram,
  },
  { label: 'YouTube', href: 'https://youtube.com/@justmiles', icon: Youtube },
  { label: 'Telegram', href: 'https://t.me/justmiles', icon: Send },
  { label: 'Email', href: 'mailto:hello@justmiles.id', icon: Mail },
] as const

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary px-4 text-primary-foreground">
      <div className="page-wrap py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-primary-foreground no-underline"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Plane className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold tracking-normal">
                JustMiles
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/60">
              Indonesia's Points & Miles Advisor + Travel Media
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
                {column.title}
              </h3>
              <div className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-primary-foreground/60 no-underline transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-primary-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-sm text-primary-foreground/50">
            &copy; {year} JustMiles. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-primary-foreground/55 no-underline transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <span className="sr-only">{link.label}</span>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
