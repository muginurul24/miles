import { ArrowRight, Calculator, CreditCard } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-8rem)] overflow-hidden">
      <img
        src="/images/hero-airport.jpg"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-primary/70 dark:bg-background/75" />

      <div className="page-wrap flex items-center py-14 sm:py-20">
        <div className="max-w-3xl text-accent-foreground">
          <p className="mb-5 inline-flex w-fit items-center rounded-md bg-accent px-3 py-1.5 text-xs font-bold tracking-normal text-accent-foreground shadow-sm">
            Points & Miles Advisor
          </p>
          <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-normal text-accent-foreground sm:text-6xl lg:text-7xl">
            Maksimalkan Poin & Miles Kamu
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-accent-foreground/85 sm:text-lg">
            Temukan kartu kredit, program miles, dan strategi redemption yang
            paling masuk akal untuk rute, gaya belanja, dan target perjalananmu.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent-hover"
            >
              <a href="/calculator" className="no-underline">
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Hitung Miles Kamu
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-accent-foreground/45 bg-accent-foreground/10 text-accent-foreground hover:bg-accent-foreground/20 hover:text-accent-foreground"
            >
              <a href="/credit-cards" className="no-underline">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Bandingkan Kartu Kredit
              </a>
            </Button>
          </div>

          <a
            href="/guides"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground no-underline hover:text-accent-foreground/80"
          >
            atau mulai dari Guide Pemula
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
