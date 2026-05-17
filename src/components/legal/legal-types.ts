export interface LegalSection {
  id: string
  title: string
  body: string[]
  bullets?: string[]
}

export interface LegalSource {
  label: string
  href: string
}

export interface LegalPageContent {
  eyebrow: string
  title: string
  description: string
  lastUpdated: string
  summary: string
  notice: string
  sections: LegalSection[]
  contact: {
    title: string
    description: string
    subject: string
  }
  source?: LegalSource
}
