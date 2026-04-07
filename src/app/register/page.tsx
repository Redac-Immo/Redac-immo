'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', password: '', agence: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: { prenom: form.prenom, nom: form.nom },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        prenom: form.prenom,
        nom: form.nom,
        agence: form.agence || null,
        plan: 'basique',
        role: 'client',
      })
    }

    setSuccess(true)
    setLoading(false)
  }

  const inputStyle = {
    background: '#222224', border: '1px solid #333',
    color: '#FAFAF7', fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px', padding: '12px 14px', outline: 'none', width: '100%',
  } as const

  const labelStyle = {
    fontSize: '10px', letterSpacing: '0.18em',
    textTransform: 'uppercase' as const, color: '#6B6B65',
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#18181A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>✦</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#FAFAF7', marginBottom: '12px' }}>
            Vérifiez votre e-mail
          </div>
          <div style={{ fontSize: '13px', color: '#6B6B65', lineHeight: 1.7 }}>
            Un lien de confirmation a été envoyé à <strong style={{ color: '#FAFAF7' }}>{form.email}</strong>.
            <br />Cliquez sur le lien pour activer votre compte.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#18181A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#FAFAF7' }}>
            Redac<span style={{ fontStyle: 'italic', color: '#C9A96E', fontWeight: 300 }}>-Immo</span>
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6B65', marginTop: '6px' }}>
            Créer un compte
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(193,18,31,0.1)', borderLeft: '3px solid #C1121F', color: '#f87171', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label style={labelStyle}>Prénom</label>
              <input type="text" required value={form.prenom} onChange={e => handleChange('prenom', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label style={labelStyle}>Nom</label>
              <input type="text" required value={form.nom} onChange={e => handleChange('nom', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={labelStyle}>Adresse e-mail</label>
            <input type="email" required value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="vous@agence.fr" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={labelStyle}>Agence (optionnel)</label>
            <input type="text" value={form.agence} onChange={e => handleChange('agence', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={labelStyle}>Mot de passe</label>
            <input type="password" required value={form.password} onChange={e => handleChange('password', e.target.value)} placeholder="8 caractères minimum" style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={{
            marginTop: '8px', background: loading ? '#9A7A48' : '#C9A96E',
            color: '#18181A', border: 'none', padding: '14px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>

        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#6B6B65' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: '#C9A96E', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  )
}