export default function DemoWindow() {
  return (
    <section style={{ padding: '0 60px 100px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div className="demo-window" style={{
        width: '100%', maxWidth: '900px',
        background: 'var(--cream)',
        border: '1px solid rgba(201,169,110,0.3)',
        borderTop: '2px solid var(--gold)',
      }}>
        {/* Browser bar */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--light)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
          <div style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: 'var(--mid)', letterSpacing: '0.08em' }}>
            redac-immo.fr/app
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '320px' }}
             className="demo-content">

          {/* Sidebar */}
          <div style={{
            borderRight: '1px solid var(--light)',
            padding: '24px 20px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <DemoField label="Type de bien" value="Appartement" />
            <DemoField label="Surface" value="87 m²" />
            <DemoField label="Localisation" value="Lyon 6ème" highlight />
            <DemoField label="Prix" value="520 000 €" highlight />
            <DemoField label="Persona" value="✦ Élise · Prestige" highlight />
            <div style={{
              height: '36px', background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--dark)', fontWeight: 500, marginTop: '4px',
            }}>
              ✦ Générer
            </div>
          </div>

          {/* Result */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--light)',
            }}>
              <span style={{ fontSize: '14px' }}>🇫🇷</span>
              <span style={{ fontSize: '11px', color: 'var(--mid)', letterSpacing: '0.1em' }}>
                Version française · Persona Élise
              </span>
              <div style={{
                marginLeft: 'auto',
                padding: '5px 14px',
                background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.3)',
                fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)',
              }}>
                Copier
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[92, 87, 94, 78, 89, 60].map((w, i) => (
                <div
                  key={i}
                  className="demo-line"
                  style={{ height: '9px', background: 'rgba(24,24,26,0.08)', borderRadius: '2px', width: `${w}%` }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .demo-content { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function DemoField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>
        {label}
      </div>
      <div style={{
        height: '32px', background: 'var(--bg2)',
        border: '1px solid var(--light)',
        display: 'flex', alignItems: 'center', padding: '0 10px',
      }}>
        <span style={{ fontSize: '11px', color: highlight ? 'var(--gold-light)' : '#666' }}>
          {value}
        </span>
      </div>
    </div>
  )
}
