import Nav from '@/components/landing/Nav'
import Hero from '@/components/landing/Hero'
import DemoWindow from '@/components/landing/DemoWindow'
import { HowItWorks, Methode, SampleListings, Features, Pricing, EarlyAccess } from '@/components/landing/Sections'
import FAQ from '@/components/landing/FAQ'
import { CtaFinal, Footer } from '@/components/landing/CtaFooter'

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
