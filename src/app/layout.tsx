import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

// ─── FONTS ────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// ─── METADATA SEO ──────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Redac-Immo — Annonces immobilières professionnelles en 24h',
  description:
    'Redac-Immo rédige vos annonces immobilières professionnelles en français et en anglais, livrées sous 24h. Qualité premium, à partir de 5€ par annonce, sans abonnement.',
  keywords: [
    'rédaction annonce immobilière',
    'texte annonce immobilière professionnel',
    'description bien immobilier',
    'annonce immobilière anglais',
    'rédacteur immobilier',
  ],
  authors: [{ name: 'Redac-Immo' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://redac-immo.fr/',
  },
  openGraph: {
    type: 'website',
    url: 'https://redac-immo.fr/',
    title: 'Redac-Immo — Annonces immobilières professionnelles en 24h',
    description:
      'Des annonces au niveau des grandes agences — en français et en anglais, livrées sous 24h. À partir de 5€, sans abonnement.',
    images: [{ url: 'https://redac-immo.fr/og-image.jpg' }],
    locale: 'fr_FR',
    siteName: 'Redac-Immo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redac-Immo — Annonces immobilières professionnelles en 24h',
    description:
      'Des annonces au niveau des grandes agences — en français et en anglais, livrées sous 24h.',
    images: ['https://redac-immo.fr/og-image.jpg'],
  },
  // ✅ Google Search Console verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

// ─── LAYOUT ───────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body className="font-sans bg-cream text-dark overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}