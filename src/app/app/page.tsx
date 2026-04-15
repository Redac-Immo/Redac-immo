'use client'

import { useState, useRef } from 'react'
import type { Formule, GenerateResponse } from '@/types'

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

export default function AppPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [formule, setFormule] = useState<Formule>('essentiel')
  const [persona, setPersona] = useState<string>('Élise')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<(GenerateResponse & { bien: string; prix: string }) | null>(null)
  const [activeTab, setActiveTab] = useState<'fr' | 'en' | 'short'>('fr')
  const [toast, setToast] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

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
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, formule, persona }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'Erreur serveur')
      }
      const data = await response.json()
      setResult({ fr: data.fr, en: data.en, short: data.short, bien: `${form.type} — ${form.localisation}`, prix: form.prix })
      setActiveTab('fr')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e: any) {
      showToast(e.message ?? 'Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
    showToast('✓ Texte copié')
  }

  function downloadTxt() {
    if (!result) return
    let content = `ANNONCE — ${result.bien}\nPrix : ${result.prix}\n${'─'.repeat(60)}\n\n`
    content += `VERSION FRANÇAISE\n\n${result.fr}\n\n`
    if (result.en) content += `${'─'.repeat(60)}\n\nENGLISH VERSION\n\n${result.en}\n\n`
    if (result.short) content += `${'─'.repeat(60)}\n\nRÉSEAUX SOCIAUX\n\n${result.short}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `annonce_${result.bien.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    a.click()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: '#2A2A2C', border: '1px solid #3A3A3C',
    color: '#FAFAF7', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: '#C9A96E', marginBottom: '8px', display: 'block',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      <aside style={{ background: '#18181A', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', color: '#FAFAF7' }}>Redac</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontStyle: 'italic', color: '#C9A96E', fontWeight: 300 }}>-Immo</span>
          </div>
          <a href="/dashboard" style={{ fontSize: '11px', color: '#6B6B65', textDecoration: 'none', letterSpacing: '0.1em' }}>← Dashboard</a>
        </div>

        <div>
          <span style={labelStyle}>Formule</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(['basique', 'essentiel', 'agence'] as Formule[]).map(f => (
              <button key={f} onClick={() => setFormule(f)} style={{
                padding: '10px 14px',
                background: formule === f ? 'rgba(201,169,110,0.12)' : 'transparent',
                border: `1px solid ${formule === f ? '#C9A96E' : '#333'}`,
                color: formule === f ? '#C9A96E' : '#6B6B65',
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span>{f === 'basique' ? '5€' : f === 'essentiel' ? '9,99€' : '65€/mois'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PERSONA */}
        <div>
          <span style={labelStyle}>Persona</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(['Élise', 'Thomas', 'Marc', 'Sofia', 'Lucas', 'Claire'] as const).map(p => (
              <button key={p} onClick={() => setPersona(p)} style={{
                padding: '9px 14px',
                background: persona === p ? 'rgba(201,169,110,0.12)' : 'transparent',
                border: `1px solid ${persona === p ? '#C9A96E' : '#333'}`,
                color: persona === p ? '#C9A96E' : '#6B6B65',
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
          <div>
            <span style={labelStyle}>Surface (m²) *</span>
            <input type="number" value={form.surface} onChange={e => update('surface', e.target.value)} style={inputStyle} placeholder="85" />
          </div>
          <div>
            <span style={labelStyle}>Terrain (m²)</span>
            <input type="number" value={form.terrain} onChange={e => update('terrain', e.target.value)} style={inputStyle} placeholder="500" />
          </div>
          <div>
            <span style={labelStyle}>Pièces</span>
            <input type="number" value={form.pieces} onChange={e => update('pieces', e.target.value)} style={inputStyle} placeholder="4" />
          </div>
          <div>
            <span style={labelStyle}>Chambres</span>
            <input type="number" value={form.chambres} onChange={e => update('chambres', e.target.value)} style={inputStyle} placeholder="2" />
          </div>
        </div>

        <div>
          <span style={labelStyle}>Localisation *</span>
          <input type="text" value={form.localisation} onChange={e => update('localisation', e.target.value)} style={inputStyle} placeholder="Lyon 6ème, Rhône" />
        </div>

        <div>
          <span style={labelStyle}>Prix *</span>
          <input type="text" value={form.prix} onChange={e => update('prix', e.target.value)} style={inputStyle} placeholder="450 000 €" />
        </div>

        <div>
          <span style={labelStyle}>Points forts</span>
          <textarea value={form.pointsForts} onChange={e => update('pointsForts', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Vue mer, parquet chêne, cave…" />
        </div>

        <div>
          <span style={labelStyle}>Infos complémentaires</span>
          <textarea value={form.infoCompl} onChange={e => update('infoCompl', e.target.value)} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="DPE, charges, travaux récents…" />
        </div>

        <button onClick={handleGenerate} disabled={loading} style={{
          padding: '16px', background: loading ? '#9A7A48' : '#C9A96E', color: '#18181A',
          border: 'none', fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          {loading ? (
            <>
              <span style={{ width: '12px', height: '12px', border: '2px solid rgba(24,24,26,0.3)', borderTopColor: '#18181A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Génération…
            </>
          ) : '✦ Générer l\'annonce'}
        </button>

      </aside>

      <main style={{ background: '#F2F2EE', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>

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
            <div style={{ background: '#FAFAF7', borderTop: '3px solid #C9A96E', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 500 }}>{result.bien}</div>
                <div style={{ fontSize: '11px', color: '#6B6B65', marginTop: '4px' }}>{result.prix} · Formule {formule}</div>
              </div>
              <button onClick={downloadTxt} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #E8E8E4', color: '#6B6B65', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                ⬇ Télécharger
              </button>
            </div>

            <div style={{ background: '#FAFAF7', border: '1px solid #E8E8E4' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #E8E8E4' }}>
                {(['fr', 'en', 'short'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: '12px 20px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
                    cursor: 'pointer', background: 'none', border: 'none',
                    borderBottom: `2px solid ${activeTab === tab ? '#C9A96E' : 'transparent'}`,
                    color: activeTab === tab ? '#C9A96E' : '#6B6B65',
                    fontFamily: "'DM Sans', sans-serif", marginBottom: '-1px',
                  } as React.CSSProperties}>
                    {tab === 'fr' ? '🇫🇷 Français' : tab === 'en' ? '🇬🇧 English' : '📱 Réseaux'}
                  </button>
                ))}
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', lineHeight: 1.85, whiteSpace: 'pre-wrap', color: '#18181A', minHeight: '160px' }}>
                  {activeTab === 'fr' ? result.fr : activeTab === 'en' ? (result.en || '— Non disponible pour la formule Basique') : (result.short || '— Non disponible pour la formule Basique')}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => copyText(activeTab === 'fr' ? result.fr : activeTab === 'en' ? result.en : result.short)} style={{ padding: '9px 20px', background: '#C9A96E', color: '#18181A', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}>
                    Copier
                  </button>
                  {activeTab === 'fr' && (
                    <>
                      <button onClick={() => { copyText(result.fr); window.open('https://www.leboncoin.fr/deposer-une-annonce', '_blank') }} style={{ padding: '9px 16px', background: 'transparent', border: '1px solid #E8E8E4', color: '#6B6B65', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', cursor: 'pointer' }}>
                        LeBonCoin →
                      </button>
                      <button onClick={() => { copyText(result.fr); window.open('https://www.pap.fr/annonce/deposer', '_blank') }} style={{ padding: '9px 16px', background: 'transparent', border: '1px solid #E8E8E4', color: '#6B6B65', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', cursor: 'pointer' }}>
                        PAP.fr →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999, background: '#18181A', color: '#FAFAF7', padding: '14px 24px', fontSize: '13px', borderLeft: '3px solid #C9A96E', animation: 'slideUp 0.3s ease' }}>
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