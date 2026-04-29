'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Formule, GenerateResponse, UserCredits } from '@/types'
import ImageUploader from '@/components/ImageUploader'
import { T } from '@/lib/design-tokens'

type FormData = {
  type: string
  surface: string
  terrain: string
  pieces: string
  chambres: string
  localisation: string
  prix: string
  pointsForts: string
  infoCompl: string
}

const EMPTY_FORM: FormData = {
  type: 'Appartement',
  surface: '', terrain: '', pieces: '', chambres: '',
  localisation: '', prix: '', pointsForts: '', infoCompl: '',
}

const PORTAILS = [
  { name: 'LeBonCoin', url: 'https://www.leboncoin.fr/deposer-une-annonce' },
  { name: 'SeLoger', url: 'https://www.seloger.com/deposer-une-annonce' },
  { name: 'Bien\'ici', url: 'https://www.bienici.com/deposer-une-annonce' },
  { name: 'PAP', url: 'https://www.pap.fr/annonce/deposer' },
  { name: 'Logic-Immo', url: 'https://www.logic-immo.com/deposer-une-annonce' },
  { name: 'Meilleurs Agents', url: 'https://www.meilleursagents.com/deposer-une-annonce' },
]

export default function AppPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [formule, setFormule] = useState<Formule>('essentiel')
  const [persona, setPersona] = useState<string>('Élise')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<(GenerateResponse & { bien: string; prix: string }) | null>(null)
  const [activeTab, setActiveTab] = useState<'fr' | 'en' | 'short'>('fr')
  const [toast, setToast] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const editableRef = useRef<HTMLDivElement>(null)

  const [images, setImages] = useState<string[]>([])
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [profile, setProfile] = useState<{ plan: Formule } | null>(null)

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFormule(profileData.plan)
      }

      try {
        const res = await fetch('/api/credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })
        const data = await res.json()
        
        setCredits({
          credits_remaining: data.credits_remaining ?? 0,
          plan: profileData?.plan || 'basique',
          isUnlimited: profileData?.plan === 'agence' || profileData?.plan === 'fondateur',
        })
      } catch (err) {
        console.error('Erreur chargement crédits:', err)
        setCredits({
          credits_remaining: 0,
          plan: profileData?.plan || 'basique',
          isUnlimited: profileData?.plan === 'agence' || profileData?.plan === 'fondateur',
        })
      }
    }

    loadUserData()
  }, [])

  function update(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleGenerate() {
    if (!form.surface || !form.localisation || !form.prix) {
      showToast('Remplissez les champs obligatoires : surface, localisation, prix')
      return
    }

    if (credits && !credits.isUnlimited && credits.credits_remaining === 0) {
      showToast('Aucun crédit disponible. Veuillez recharger.')
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, formule, persona, images }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'Erreur serveur')
      }
      const data = await response.json()
      setResult({ fr: data.fr, en: data.en, short: data.short, bien: `${form.type} — ${form.localisation}`, prix: form.prix })
      setActiveTab('fr')

      if (credits && !credits.isUnlimited) {
        setCredits({
          ...credits,
          credits_remaining: credits.credits_remaining - 1,
        })
      }

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e: any) {
      showToast(e.message ?? 'Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
    showToast('Texte copié')
  }

  function getEditedText(): string {
    if (editableRef.current) {
      return editableRef.current.innerText || ''
    }
    return ''
  }

  function execFormat(command: string, value?: string) {
    document.execCommand(command, false, value)
    editableRef.current?.focus()
  }

  function copyAndOpen(url: string) {
    const text = getEditedText() || (activeTab === 'fr' ? result?.fr : activeTab === 'en' ? result?.en : result?.short) || ''
    navigator.clipboard.writeText(text)
    window.open(url, '_blank')
    showToast('Texte copié · Ouverture du portail')
  }

  function downloadTxt() {
    if (!result) return
    const editedText = getEditedText() || result.fr
    let content = `ANNONCE — ${result.bien}\nPrix : ${result.prix}\n${'─'.repeat(60)}\n\n`
    content += `VERSION FRANÇAISE\n\n${editedText}\n\n`
    if (result.en) content += `${'─'.repeat(60)}\n\nENGLISH VERSION\n\n${result.en}\n\n`
    if (result.short) content += `${'─'.repeat(60)}\n\nRÉSEAUX SOCIAUX\n\n${result.short}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `annonce_${result.bien.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    a.click()
  }

  const getActiveText = useCallback(() => {
    if (!result) return ''
    if (activeTab === 'fr') return result.fr
    if (activeTab === 'en') return result.en || '— Non disponible pour la formule Basique'
    return result.short || '— Non disponible pour la formule Basique'
  }, [result, activeTab])

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.dark, fontFamily: "'DM Sans', sans-serif", fontSize: '13px', outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: T.gold, marginBottom: '8px', display: 'block',
  }

  const isGenerateDisabled = loading || (credits ? (!credits.isUnlimited && credits.credits_remaining === 0) : false)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      <aside style={{ background: T.bg, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', color: T.dark }}>Redac</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontStyle: 'italic', color: T.gold, fontWeight: 300 }}>-Immo</span>
          </div>
          <Link href="/dashboard" style={{ fontSize: '11px', color: T.mid, textDecoration: 'none', letterSpacing: '0.1em' }}>← Dashboard</Link>
        </div>

        <div style={{
          background: T.surface,
          border: `2px solid ${T.gold}`,
          padding: '16px',
          borderRadius: '4px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: T.mid, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Formule actuelle
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: T.gold, textTransform: 'uppercase' }}>
              {profile?.plan || 'Chargement...'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: T.mid, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Crédits
            </span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: credits?.isUnlimited ? T.ok : T.dark }}>
              {credits?.isUnlimited ? 'Illimités' : credits?.credits_remaining ?? '—'}
            </span>
          </div>
          <Link
            href="/dashboard?section=commande"
            style={{
              display: 'block', marginTop: '12px', padding: '8px 12px',
              background: 'transparent', border: `1px solid ${T.border}`,
              color: T.gold, fontSize: '11px', textAlign: 'center',
              textDecoration: 'none', textTransform: 'uppercase',
              letterSpacing: '0.1em', transition: 'all 0.2s',
            }}
          >
            Changer de formule
          </Link>
        </div>

        <div>
          <span style={labelStyle}>Rédacteur</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(['Élise', 'Thomas', 'Marc', 'Sofia', 'Lucas', 'Claire'] as const).map(p => (
              <button key={p} onClick={() => setPersona(p)} style={{
                padding: '9px 14px',
                background: persona === p ? T.goldBg : 'transparent',
                border: `1px solid ${persona === p ? T.gold : T.border}`,
                color: persona === p ? T.gold : T.mid,
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {p}
                <span style={{ fontSize: '10px', opacity: 0.7 }}>
                  {p === 'Élise' ? 'Prestige' : p === 'Thomas' ? 'Résidentiel' : p === 'Marc' ? 'Caractère' : p === 'Sofia' ? 'Neuf' : p === 'Lucas' ? 'Location' : 'Investissement'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span style={labelStyle}>Type de bien</span>
          <select value={form.type} onChange={e => update('type', e.target.value)} style={inputStyle}>
            <option>Appartement</option>
            <option>Maison / Villa</option>
            <option>Château / Propriété</option>
            <option>Local commercial</option>
            <option>Terrain</option>
            <option>Immeuble</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div><span style={labelStyle}>Surface (m²) *</span><input type="number" value={form.surface} onChange={e => update('surface', e.target.value)} style={inputStyle} placeholder="85" /></div>
          <div><span style={labelStyle}>Terrain (m²)</span><input type="number" value={form.terrain} onChange={e => update('terrain', e.target.value)} style={inputStyle} placeholder="500" /></div>
          <div><span style={labelStyle}>Pièces</span><input type="number" value={form.pieces} onChange={e => update('pieces', e.target.value)} style={inputStyle} placeholder="4" /></div>
          <div><span style={labelStyle}>Chambres</span><input type="number" value={form.chambres} onChange={e => update('chambres', e.target.value)} style={inputStyle} placeholder="2" /></div>
        </div>

        <div><span style={labelStyle}>Localisation *</span><input type="text" value={form.localisation} onChange={e => update('localisation', e.target.value)} style={inputStyle} placeholder="Lyon 6ème, Rhône" /></div>
        <div><span style={labelStyle}>Prix *</span><input type="text" value={form.prix} onChange={e => update('prix', e.target.value)} style={inputStyle} placeholder="450 000 €" /></div>
        <div><span style={labelStyle}>Points forts</span><textarea value={form.pointsForts} onChange={e => update('pointsForts', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Vue, parquet chêne, cave…" /></div>
        <div><span style={labelStyle}>Infos complémentaires</span><textarea value={form.infoCompl} onChange={e => update('infoCompl', e.target.value)} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="DPE, charges, travaux récents…" /></div>

        <ImageUploader onImagesChange={setImages} maxImages={5} maxSizeMB={6} />

        <button
          onClick={handleGenerate}
          disabled={isGenerateDisabled}
          title={credits && !credits.isUnlimited && credits.credits_remaining === 0 ? 'Aucun crédit disponible' : undefined}
          style={{
            padding: '16px', background: isGenerateDisabled ? T.goldDim : T.gold, color: T.bg,
            border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            cursor: isGenerateDisabled ? 'not-allowed' : 'pointer', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: isGenerateDisabled ? 0.6 : 1,
          }}
        >
          {loading ? (
            <>
              <span style={{ width: '12px', height: '12px', border: '2px solid rgba(24,24,26,0.3)', borderTopColor: T.bg, borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Génération…
            </>
          ) : credits && !credits.isUnlimited && credits.credits_remaining === 0 ? 'Aucun crédit' : "Générer l'annonce"}
        </button>

      </aside>

      {/* ✅ MODIFICATION 1 — Fond du main plus sombre */}
      <main style={{ background: '#EAEAE6', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        {!result && !loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
            <div style={{ textAlign: 'center', color: '#6B6B65' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '64px', color: '#E8E8E4', marginBottom: '20px' }}>✦</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 300, color: '#18181A', marginBottom: '8px' }}>Prêt à rédiger</div>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>Remplissez le formulaire et cliquez sur Générer.</div>
            </div>
          </div>
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '2px solid #E8E8E4', borderTopColor: '#C9A96E', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#18181A' }}>Rédaction en cours…</div>
            </div>
          </div>
        )}
        {result && (
          <div ref={resultRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ✅ MODIFICATION 3 — En-tête fond blanc + ombre */}
            <div style={{ background: '#FFFFFF', borderTop: '3px solid #C9A96E', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 500 }}>{result.bien}</div>
                <div style={{ fontSize: '11px', color: '#6B6B65', marginTop: '4px' }}>{result.prix} · Formule {formule}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => copyText(getEditedText() || getActiveText())} style={{ padding: '8px 18px', background: '#C9A96E', color: '#18181A', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}>Copier</button>
                <button onClick={downloadTxt} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #E8E8E4', color: '#6B6B65', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Télécharger</button>
              </div>
            </div>

            {/* ✅ MODIFICATION 2 — Zone éditable fond blanc + ombre + bordure gauche dorée */}
            <div style={{ background: '#FFFFFF', border: '1px solid #D8D8D4', borderLeft: '3px solid #C9A96E', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #E8E8E4' }}>
                {(['fr', 'en', 'short'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 20px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? '#C9A96E' : 'transparent'}`, color: activeTab === tab ? '#C9A96E' : '#6B6B65', fontFamily: "'DM Sans', sans-serif", marginBottom: '-1px' } as React.CSSProperties}>{tab === 'fr' ? 'Français' : tab === 'en' ? 'English' : 'Réseaux'}</button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', borderBottom: '1px solid #E8E8E4', flexWrap: 'wrap' }}>
                <button onClick={() => execFormat('bold')} style={toolBtnStyle} title="Gras"><strong>G</strong></button>
                <button onClick={() => execFormat('italic')} style={toolBtnStyle} title="Italique"><em>I</em></button>
                <button onClick={() => execFormat('underline')} style={toolBtnStyle} title="Souligné"><u>S</u></button>
                <span style={{ width: '1px', background: '#E8E8E4', margin: '0 8px' }} />
                <button onClick={() => execFormat('insertUnorderedList')} style={toolBtnStyle} title="Liste à puces">• Liste</button>
                <button onClick={() => execFormat('removeFormat')} style={toolBtnStyle} title="Effacer la mise en forme">Effacer</button>
              </div>

              <div
                ref={editableRef}
                contentEditable
                suppressContentEditableWarning
                key={activeTab}
                dangerouslySetInnerHTML={{ __html: getActiveText().replace(/\n/g, '<br>') }}
                style={{
                  // ✅ MODIFICATION 4 — Padding plus généreux
                  padding: '32px 36px',
                  fontSize: '14px',
                  lineHeight: 1.85,
                  color: '#18181A',
                  minHeight: '200px',
                  outline: 'none',
                  whiteSpace: 'pre-wrap',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6B65' }}>
                Publier sur un portail
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {PORTAILS.map(portail => (
                  <button
                    key={portail.name}
                    onClick={() => copyAndOpen(portail.url)}
                    style={{
                      padding: '10px 12px',
                      background: '#18181A',
                      color: '#FAFAF7',
                      border: '1px solid #333336',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {portail.name} →
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999, background: T.bg, color: T.dark, padding: '14px 24px', fontSize: '13px', borderLeft: `3px solid ${T.gold}`, animation: 'slideUp 0.3s ease' }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  )
}

const toolBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  background: 'transparent',
  border: '1px solid #E8E8E4',
  color: '#6B6B65',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  cursor: 'pointer',
  borderRadius: '3px',
  transition: 'all 0.15s',
}