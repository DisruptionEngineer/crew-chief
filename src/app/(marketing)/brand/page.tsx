'use client'

import { TenthsLogo, TenthsWordmark } from '@/components/shared/TenthsLogo'

const colors = {
  core: [
    { name: 'Void', hex: '#0A0A0F', var: '--background', role: 'Background' },
    { name: 'Carbon', hex: '#14141F', var: '--card', role: 'Card / Surface' },
    { name: 'Cockpit', hex: '#1A1A28', var: '--secondary', role: 'Elevated Surface' },
    { name: 'Gunmetal', hex: '#252535', var: '--muted', role: 'Muted / Disabled' },
    { name: 'Alloy', hex: '#2A2A3A', var: '--border', role: 'Borders / Inputs' },
    { name: 'Silver', hex: '#D4D4E0', var: '--foreground', role: 'Primary Text' },
    { name: 'Titanium', hex: '#7A7A90', var: '--muted-foreground', role: 'Secondary Text' },
  ],
  brand: [
    { name: 'Telemetry Blue', hex: '#00B4FF', var: '--primary', role: 'Primary / CTA' },
    { name: 'Warm Amber', hex: '#FF6B00', var: '--accent', role: 'Accent / Highlight' },
  ],
  status: [
    { name: 'Optimal', hex: '#00E676', role: 'Good / In Range' },
    { name: 'Warning', hex: '#FF6B00', role: 'Caution / Elevated' },
    { name: 'Critical', hex: '#FF1744', role: 'Alert / Out of Range' },
    { name: 'Info', hex: '#00B4FF', role: 'Informational' },
  ],
}

function ColorSwatch({ name, hex, role, large }: { name: string; hex: string; role: string; large?: boolean }) {
  return (
    <div className="group">
      <div
        className={`${large ? 'h-28' : 'h-20'} rounded-lg border border-[#2A2A3A] mb-3 transition-all group-hover:scale-[1.02]`}
        style={{ backgroundColor: hex }}
      />
      <p className="text-sm font-semibold text-[#D4D4E0]">{name}</p>
      <p className="text-xs font-mono text-[#7A7A90] mt-0.5">{hex}</p>
      <p className="text-xs text-[#555] mt-0.5">{role}</p>
    </div>
  )
}

export default function BrandPage() {
  return (
    <div className="min-h-screen">
      {/* ═══ HEADER ═══ */}
      <header className="border-b border-[#2A2A3A]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TenthsLogo size={36} />
            <TenthsWordmark className="text-lg" />
          </div>
          <span className="text-xs font-mono text-[#7A7A90] tracking-wider uppercase">Brand System v2.0</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* ═══ HERO — BRAND STATEMENT ═══ */}
        <section className="relative">
          <div className="absolute -inset-x-6 inset-y-0 bg-gradient-to-b from-[#00B4FF]/[0.03] to-transparent rounded-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold text-[#00B4FF] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Carbon Fiber Edition
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6 text-[#D4D4E0]">
              Precision{' '}
              <span className="text-[#00B4FF]">Engineered</span>
              <br />
              for the{' '}
              <span className="text-[#FF6B00]">Track.</span>
            </h1>
            <p className="text-lg text-[#7A7A90] leading-relaxed max-w-2xl">
              Tenths is a telemetry-grade toolkit built for racers who wrench their own cars.
              The brand reflects the precision, depth, and technical clarity of professional
              racing systems — made accessible for the grassroots garage.
            </p>
          </div>
        </section>

        {/* ═══ LOGO SYSTEM ═══ */}
        <section>
          <SectionLabel>01 — Logo</SectionLabel>
          <h2 className="text-3xl font-bold text-[#D4D4E0] mb-2">Logo System</h2>
          <p className="text-[#7A7A90] mb-10 max-w-xl">
            The mark is a precision-cut &quot;T&quot; set in a carbon-bodied shell with a brushed metal edge.
            The amber accent anchors the warm/cool duality of the brand.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Dark background */}
            <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-8 flex flex-col items-center justify-center gap-4">
              <TenthsLogo size={64} />
              <span className="text-xs text-[#7A7A90] font-mono">On Dark</span>
            </div>
            {/* Card background */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8 flex flex-col items-center justify-center gap-4">
              <TenthsLogo size={64} />
              <span className="text-xs text-[#7A7A90] font-mono">On Surface</span>
            </div>
            {/* Wordmark */}
            <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-8 flex flex-col items-center justify-center gap-4">
              <TenthsWordmark className="text-2xl" />
              <span className="text-xs text-[#7A7A90] font-mono">Wordmark</span>
            </div>
            {/* Logo + Wordmark */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <TenthsLogo size={36} />
                <TenthsWordmark className="text-lg" />
              </div>
              <span className="text-xs text-[#7A7A90] font-mono">Lockup</span>
            </div>
          </div>

          {/* Size variants */}
          <div className="mt-8 bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
            <p className="text-xs text-[#7A7A90] font-mono uppercase tracking-wider mb-6">Size Scale</p>
            <div className="flex items-end gap-8 flex-wrap">
              {[16, 24, 32, 40, 48, 64, 80].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <TenthsLogo size={s} />
                  <span className="text-[10px] font-mono text-[#555]">{s}px</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COLOR PALETTE ═══ */}
        <section>
          <SectionLabel>02 — Color</SectionLabel>
          <h2 className="text-3xl font-bold text-[#D4D4E0] mb-2">Color System</h2>
          <p className="text-[#7A7A90] mb-10 max-w-xl">
            A cool-toned void palette anchored by telemetry blue as the primary signal color,
            with warm amber as the accent that grounds the system in racing heritage.
          </p>

          {/* Brand colors — hero display */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {colors.brand.map((c) => (
              <div key={c.hex} className="group">
                <div
                  className="h-36 rounded-xl border border-[#2A2A3A] mb-3 transition-all group-hover:scale-[1.01] relative overflow-hidden"
                  style={{ backgroundColor: c.hex }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-sm font-bold text-white/90">{c.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-[#D4D4E0]">{c.hex}</span>
                  <span className="text-xs text-[#555]">{c.var}</span>
                  <span className="text-xs text-[#555]">— {c.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Core surface colors */}
          <p className="text-xs font-semibold text-[#00B4FF] uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Surface Palette
          </p>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-10">
            {colors.core.map((c) => (
              <ColorSwatch key={c.hex} {...c} />
            ))}
          </div>

          {/* Status colors */}
          <p className="text-xs font-semibold text-[#00B4FF] uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Status / Data Colors
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.status.map((c) => (
              <ColorSwatch key={c.hex} {...c} />
            ))}
          </div>
        </section>

        {/* ═══ TYPOGRAPHY ═══ */}
        <section>
          <SectionLabel>03 — Typography</SectionLabel>
          <h2 className="text-3xl font-bold text-[#D4D4E0] mb-2">Type System</h2>
          <p className="text-[#7A7A90] mb-10 max-w-xl">
            Three typefaces form a clear hierarchy: Chakra Petch for angular display headings,
            Outfit for clean body text, and Victor Mono for precision data.
          </p>

          <div className="space-y-8">
            {/* Display font */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider">Display — Chakra Petch</span>
                <span className="text-xs font-mono text-[#555]">var(--font-heading)</span>
              </div>
              <div className="space-y-4" style={{ fontFamily: 'var(--font-heading)' }}>
                <p className="text-6xl font-bold text-[#D4D4E0] leading-tight">Every Tenth Matters</p>
                <p className="text-4xl font-semibold text-[#D4D4E0]">Setup Calculator</p>
                <p className="text-2xl font-medium text-[#7A7A90]">Engine Build Simulator</p>
                <p className="text-lg text-[#555]">ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</p>
              </div>
            </div>

            {/* Body font */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider">Body — Outfit</span>
                <span className="text-xs font-mono text-[#555]">var(--font-sans)</span>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-[#D4D4E0] leading-relaxed max-w-2xl">
                  Tenths was built by racers who got tired of guessing. We wanted real setup data,
                  real diagnostics, and a real log of what works — without needing a professional crew.
                </p>
                <p className="text-sm text-[#7A7A90] leading-relaxed max-w-2xl">
                  Whether you run street stock, modified, late model, or figure 8 — if you wrench your own car
                  and want to find your tenths, this is for you. The app provides setup recommendations,
                  engine build simulation, session logging, and troubleshooting diagnostics.
                </p>
                <p className="text-xs text-[#555]">abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</p>
              </div>
            </div>

            {/* Mono/Data font */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider">Data — Victor Mono</span>
                <span className="text-xs font-mono text-[#555]">var(--font-mono)</span>
              </div>
              <div className="space-y-4" style={{ fontFamily: 'var(--font-mono)' }}>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-xs text-[#555] uppercase tracking-wider mb-1">Lap Time</p>
                    <p className="text-4xl font-semibold text-[#00B4FF]">14.832</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#555] uppercase tracking-wider mb-1">Cross Weight</p>
                    <p className="text-4xl font-semibold text-[#00E676]">52.4%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#555] uppercase tracking-wider mb-1">Spring Rate</p>
                    <p className="text-4xl font-semibold text-[#FF6B00]">1100</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#555] uppercase tracking-wider mb-1">Tire Temp</p>
                    <p className="text-4xl font-semibold text-[#FF1744]">238&deg;F</p>
                  </div>
                </div>
                <p className="text-xs text-[#555] mt-4">0123456789 . : % &deg; / - + = # @</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TEXTURES & EFFECTS ═══ */}
        <section>
          <SectionLabel>04 — Texture</SectionLabel>
          <h2 className="text-3xl font-bold text-[#D4D4E0] mb-2">Textures & Effects</h2>
          <p className="text-[#7A7A90] mb-10 max-w-xl">
            Layered surfaces create depth. Carbon weave patterns, scan-line overlays, brushed metal borders,
            and telemetry glows give the interface tactile materiality.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Carbon weave */}
            <div className="relative rounded-xl border border-[#2A2A3A] overflow-hidden h-48 bg-[#14141F] carbon-texture flex items-end p-5">
              <div>
                <p className="text-sm font-semibold text-[#D4D4E0]">Carbon Weave</p>
                <p className="text-xs text-[#555] mt-1">.carbon-texture</p>
              </div>
            </div>

            {/* Scan lines */}
            <div className="relative rounded-xl border border-[#2A2A3A] overflow-hidden h-48 bg-[#14141F] scan-lines flex items-end p-5">
              <div>
                <p className="text-sm font-semibold text-[#D4D4E0]">Scan Lines</p>
                <p className="text-xs text-[#555] mt-1">.scan-lines</p>
              </div>
            </div>

            {/* Telemetry glow */}
            <div className="rounded-xl border border-[#2A2A3A] overflow-hidden h-48 bg-[#14141F] glow-primary flex items-end p-5">
              <div>
                <p className="text-sm font-semibold text-[#D4D4E0]">Telemetry Glow</p>
                <p className="text-xs text-[#555] mt-1">.glow-primary</p>
              </div>
            </div>
          </div>

          {/* Dividers */}
          <div className="mt-10 space-y-6">
            <div>
              <p className="text-xs text-[#555] font-mono mb-3">.checkered-divider</p>
              <div className="checkered-divider" />
            </div>
            <div>
              <p className="text-xs text-[#555] font-mono mb-3">.checkered-divider-rich</p>
              <div className="checkered-divider-rich" />
            </div>
          </div>
        </section>

        {/* ═══ COMPONENTS ═══ */}
        <section>
          <SectionLabel>05 — Components</SectionLabel>
          <h2 className="text-3xl font-bold text-[#D4D4E0] mb-2">Component Samples</h2>
          <p className="text-[#7A7A90] mb-10 max-w-xl">
            Core UI patterns reflecting the Carbon Fiber system.
          </p>

          <div className="space-y-8">
            {/* Buttons */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <p className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider mb-6">Buttons</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#00B4FF] text-[#0A0A0F] font-bold px-6 py-3 rounded-lg hover:bg-[#33C4FF] transition-colors text-sm">
                  Primary Action
                </button>
                <button className="bg-[#FF6B00] text-[#0A0A0F] font-bold px-6 py-3 rounded-lg hover:bg-[#FF8533] transition-colors text-sm">
                  Accent Action
                </button>
                <button className="border border-[#2A2A3A] text-[#D4D4E0] font-semibold px-6 py-3 rounded-lg hover:bg-[#1A1A28] transition-colors text-sm">
                  Secondary
                </button>
                <button className="bg-[#252535] text-[#7A7A90] font-semibold px-6 py-3 rounded-lg text-sm cursor-not-allowed opacity-50">
                  Disabled
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <p className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider mb-6">Badges</p>
              <div className="flex flex-wrap gap-3">
                <span className="badge badge-blue">Telemetry</span>
                <span className="badge badge-orange">Warning</span>
                <span className="badge badge-green">Optimal</span>
                <span className="badge badge-red">Critical</span>
                <span className="badge badge-muted">Inactive</span>
              </div>
            </div>

            {/* Pill Buttons */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <p className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider mb-6">Pill Selectors</p>
              <div className="flex flex-wrap gap-2">
                <button className="pill-btn active">Street Stock</button>
                <button className="pill-btn">Modified</button>
                <button className="pill-btn">Late Model</button>
                <button className="pill-btn">Sportsman</button>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <p className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider mb-6">Cards</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#1A1A28] border border-[#2A2A3A] rounded-lg p-5 card-hover">
                  <p className="text-xs text-[#00B4FF] uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Front Left</p>
                  <p className="text-3xl font-semibold text-[#D4D4E0]" style={{ fontFamily: 'var(--font-mono)' }}>1100</p>
                  <p className="text-xs text-[#555] mt-1">Spring Rate (lbs)</p>
                </div>
                <div className="bg-[#1A1A28] border border-[#2A2A3A] rounded-lg p-5 card-hover card-accent-green">
                  <p className="text-xs text-[#00E676] uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Cross Weight</p>
                  <p className="text-3xl font-semibold text-[#00E676]" style={{ fontFamily: 'var(--font-mono)' }}>52.4%</p>
                  <p className="text-xs text-[#555] mt-1">In range (51-54%)</p>
                </div>
                <div className="bg-[#1A1A28] border border-[#2A2A3A] rounded-lg p-5 card-hover card-accent-red">
                  <p className="text-xs text-[#FF1744] uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Tire Pressure</p>
                  <p className="text-3xl font-semibold text-[#FF1744]" style={{ fontFamily: 'var(--font-mono)' }}>22 psi</p>
                  <p className="text-xs text-[#555] mt-1">Above target (18-20)</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <p className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider mb-6">Progress</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-[#7A7A90]">Session Progress</span>
                    <span className="text-xs font-mono text-[#00B4FF]">72%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill bg-[#00B4FF]" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-[#7A7A90]">Compliance</span>
                    <span className="text-xs font-mono text-[#00E676]">100%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill bg-[#00E676]" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-[#7A7A90]">Tire Wear</span>
                    <span className="text-xs font-mono text-[#FF6B00]">38%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill bg-[#FF6B00]" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Glows */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-8">
              <p className="text-xs font-mono text-[#00B4FF] uppercase tracking-wider mb-6">Glow States</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="h-20 rounded-lg bg-[#1A1A28] border border-[#2A2A3A] glow-blue flex items-center justify-center text-xs text-[#7A7A90]">.glow-blue</div>
                <div className="h-20 rounded-lg bg-[#1A1A28] border border-[#2A2A3A] glow-green flex items-center justify-center text-xs text-[#7A7A90]">.glow-green</div>
                <div className="h-20 rounded-lg bg-[#1A1A28] border border-[#2A2A3A] glow-yellow flex items-center justify-center text-xs text-[#7A7A90]">.glow-yellow</div>
                <div className="h-20 rounded-lg bg-[#1A1A28] border border-[#2A2A3A] glow-red flex items-center justify-center text-xs text-[#7A7A90]">.glow-red</div>
                <div className="h-20 rounded-lg bg-[#1A1A28] border border-[#2A2A3A] glow-primary flex items-center justify-center text-xs text-[#7A7A90]">.glow-primary</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BRAND VOICE ═══ */}
        <section>
          <SectionLabel>06 — Voice</SectionLabel>
          <h2 className="text-3xl font-bold text-[#D4D4E0] mb-2">Brand Voice</h2>
          <p className="text-[#7A7A90] mb-10 max-w-xl">
            Tenths speaks like the smartest person at the track — precise, direct, no bullshit. Technical
            confidence without arrogance. Data-driven but human.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-6">
              <p className="text-xs text-[#00E676] font-mono uppercase tracking-wider mb-4">Do</p>
              <ul className="space-y-3 text-sm text-[#D4D4E0]">
                <li>&quot;Your cross weight is 2.1% low. Bump RF 25 lbs.&quot;</li>
                <li>&quot;Based on track temp, drop tire pressure 1.5 psi.&quot;</li>
                <li>&quot;This build makes 412 HP — 8 under the 420 cap.&quot;</li>
              </ul>
            </div>
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-6">
              <p className="text-xs text-[#FF1744] font-mono uppercase tracking-wider mb-4">Don&apos;t</p>
              <ul className="space-y-3 text-sm text-[#7A7A90]">
                <li>&quot;You might want to consider adjusting your springs!&quot;</li>
                <li>&quot;The AI suggests a possible tire pressure change.&quot;</li>
                <li>&quot;Great news! Your engine build is looking awesome!&quot;</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-[#2A2A3A] pt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TenthsLogo size={28} />
              <span className="text-sm text-[#555]">Tenths Brand System</span>
            </div>
            <span className="text-xs text-[#555] font-mono">Carbon Fiber v2.0</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-xs font-mono text-[#00B4FF] uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-heading)' }}>
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#00B4FF]/20 to-transparent" />
    </div>
  )
}
