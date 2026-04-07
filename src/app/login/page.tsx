'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#18181A',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#FAFAF7' }}>
            Redac<span style={{ fontStyle: 'italic', color: '#C9A96E', fontWeight: 300 }}>-Immo</span>
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6B65', marginTop: '6px' }}>
            Espace client
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(193,18,31,0.1)', borderLeft: '3px solid #C1121F', color: '#f87171', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6B65' }}>
              Adresse e-mail
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="vous@agence.fr"
              style={{ background: '#222224', border: '1px solid #333', color: '#FAFAF7', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', padding: '12px 14px', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6B65' }}>
              Mot de passe
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={{ background: '#222224', border: '1px solid #333', color: '#FAFAF7', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', padding: '12px 14px', outline: 'none', width: '100%' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            marginTop: '8px', background: loading ? '#9A7A48' : '#C9A96E',
            color: '#18181A', border: 'none', padding: '14px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#6B6B65' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: '#C9A96E', textDecoration: 'none' }}>
            Créer un compte
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}