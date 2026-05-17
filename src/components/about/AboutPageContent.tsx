import { Link } from '@tanstack/react-router'
import { ArrowRight, Mail, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Badge, NewsletterCTA, PageHeader } from '#/components/shared'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { metrics, principles, services, teamMembers } from './about-content'

import type { Service, TeamMember } from './about-content'
import type { ReactElement } from 'react'

export function AboutPageContent(): ReactElement {
  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Tentang JustMiles"
        title="Points & miles Indonesia, dibuat lebih mudah diputuskan"
        description="JustMiles membantu traveler Indonesia memilih kartu kredit, menghitung value miles, membaca update yang relevan, dan membuat strategi redemption dengan asumsi yang jelas."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/calculator">
                Coba calculator
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/consulting">Lihat consulting</Link>
            </Button>
          </>
        }
      />

      <MetricGrid />
      <MissionSection />
      <ServicesSection />
      <TeamSection />
      <ContactSection />
      <NewsletterCTA className="mt-8" />
    </main>
  )
}

function MetricGrid(): ReactElement {
  return (
    <section className="page-wrap grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <p className="font-display text-3xl font-bold text-primary">
              {metric.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {metric.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

function MissionSection(): ReactElement {
  return (
    <section className="page-wrap mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <Badge tone="accent" size="md" className="w-fit">
            Mission
          </Badge>
          <CardTitle className="font-display text-3xl text-primary">
            Membuat keputusan miles lebih rasional, bukan lebih rumit
          </CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Banyak keputusan points and miles terlihat kecil: kartu mana yang
            dipakai, promo mana yang diambil, kapan transfer poin. Namun
            konsekuensinya bisa menyentuh jutaan rupiah, award seat langka, dan
            waktu perjalanan keluarga.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            JustMiles menyusun data kartu, kalkulator, media, membership, dan
            consulting dalam satu alur: pahami value, bandingkan opsi, putuskan
            dengan sadar, lalu simpan strategi yang bisa dieksekusi.
          </p>
          <Separator />
          <div className="grid gap-3">
            {principles.map((principle) => (
              <div key={principle} className="flex gap-3">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-light text-accent dark:text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <p className="m-0 text-sm leading-6 text-muted-foreground">
                  {principle}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-primary text-primary-foreground shadow-xs">
        <CardHeader>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-foreground/10">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <CardTitle className="font-display text-2xl">
            Untuk traveler yang sudah mulai serius
          </CardTitle>
          <CardDescription className="text-primary-foreground/70">
            Kalau kamu hanya ingin kartu cashback termudah, JustMiles mungkin
            terasa terlalu detail. Kalau targetmu business class, lounge,
            stopover, atau keluarga jalan lebih nyaman, detail itu yang
            menentukan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/quiz">
              Ambil advisor quiz
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

function ServicesSection(): ReactElement {
  return (
    <section className="page-wrap mt-8">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="island-kicker">Services</p>
          <h2 className="font-display text-3xl font-bold text-primary">
            Semua alat keputusan di satu tempat
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Setiap layanan saling tersambung: data kartu memberi konteks,
          calculator memberi angka, konten memberi timing, consulting memberi
          roadmap.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </section>
  )
}

function ServiceCard({ service }: { service: Service }): ReactElement {
  const Icon = service.icon

  return (
    <Card className="h-full border-border bg-card shadow-xs">
      <CardHeader>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <CardTitle className="font-display text-2xl text-primary">
          {service.title}
        </CardTitle>
        <CardDescription className="text-sm leading-6">
          {service.description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function TeamSection(): ReactElement {
  return (
    <section className="page-wrap mt-8">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-xs md:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div>
            <p className="island-kicker">Team</p>
            <h2 className="font-display text-3xl font-bold text-primary">
              Tim kecil dengan disiplin editorial dan data
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              Struktur tim JustMiles sengaja dipisah berdasarkan keputusan
              pengguna: membaca update, memilih kartu, dan mengeksekusi
              redemption. Ini menjaga rekomendasi tetap praktis.
            </p>
          </div>

          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamCard({ member }: { member: TeamMember }): ReactElement {
  const Icon = member.icon

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold text-primary">
            {member.name}
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
            {member.role}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {member.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function ContactSection(): ReactElement {
  return (
    <section className="page-wrap mt-8 grid gap-5 md:grid-cols-[1fr_22rem]">
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <Badge tone="info" size="md" className="w-fit">
            Contact
          </Badge>
          <CardTitle className="font-display text-2xl text-primary">
            Ada data kartu, promo, atau partnership yang perlu dicek?
          </CardTitle>
          <CardDescription>
            Kirim detail yang bisa diverifikasi. Untuk inquiry strategi
            personal, gunakan halaman consulting agar konteksnya lengkap.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="mailto:hello@justmiles.id">
              <Mail className="h-4 w-4" aria-hidden="true" />
              hello@justmiles.id
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/consulting">Kirim consulting inquiry</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <CardTitle className="font-display text-2xl text-primary">
            Dibangun untuk komunitas yang teliti
          </CardTitle>
          <CardDescription>
            Koreksi data, laporan perubahan benefit, dan pengalaman redemption
            membantu JustMiles tetap berguna.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  )
}
