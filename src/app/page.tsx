import Nav from '@/components/landing/Nav'
import Hero from '@/components/landing/Hero'
import DemoWindow from '@/components/landing/DemoWindow'
import { HowItWorks, Methode, SampleListings, Features, Pricing, EarlyAccess } from '@/components/landing/Sections'
import FAQ from '@/components/landing/FAQ'
import { CtaFinal, Footer } from '@/components/landing/CtaFooter'

// ✅ ISR : Revalidation toutes les heures (3600 secondes)
export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DemoWindow />
        <HowItWorks />
        <Methode />
        <SampleListings />
        <Features />
        <Pricing />
        <EarlyAccess />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </>
  )
}