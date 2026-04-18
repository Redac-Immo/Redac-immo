'use client'

import { useState } from 'react'
import type { PlanKey } from '@/lib/stripe/config'

/**
 * Hook pour déclencher une Checkout Session Stripe.
 * Redirige automatiquement vers Stripe Checkout.
 */
export function useCheckout() {
  const [loading, setLoading] = useState<PlanKey | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout(plan: PlanKey) {
    setLoading(plan)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erreur lors de la création du paiement')
        setLoading(null)
        return
      }

      // Redirection vers Stripe Checkout
      window.location.href = data.url

    } catch {
      setError('Erreur réseau — réessayez')
      setLoading(null)
    }
  }

  async function openPortal() {
    setLoading('agence')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error ?? 'Erreur portail')
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(null)
    }
  }

  return { startCheckout, openPortal, loading, error }
}
