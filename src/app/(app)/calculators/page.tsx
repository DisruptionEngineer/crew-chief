'use client'

import Link from 'next/link'

const calculators = [
  {
    href: '/calculators/corner-weight',
    title: 'Corner Weight',
    description: 'Calculate cross-weight percentage, left/rear bias, and load bolt adjustments to hit your target.',
    icon: (
      <svg className="w-8 h-8 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
      </svg>
    ),
    color: '#00B4FF',
  },
  {
    href: '/calculators/rim-offset',
    title: 'Rim Offset',
    description: 'Convert backspacing to offset, calculate scrub radius change, and check for clearance issues.',
    icon: (
      <svg className="w-8 h-8 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
    color: '#00B4FF',
  },
  {
    href: '/calculators/transmission',
    title: 'Transmission Advisor',
    description: 'Find the best transmission for your engine, rear gear, and division. Scores options on cost, weight, and compatibility.',
    icon: (
      <svg className="w-8 h-8 text-[#00E676]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="19" cy="12" r="2" />
        <circle cx="5" cy="12" r="2" />
        <line x1="14" y1="12" x2="17" y2="12" />
        <line x1="7" y1="12" x2="9" y2="12" />
      </svg>
    ),
    color: '#00E676',
  },
  {
    href: '/calculators/gear-ratio',
    title: 'Gear Ratio',
    description: 'See RPM at every speed in every gear. Match peak torque to corner exit and peak HP to end-of-straight.',
    icon: (
      <svg className="w-8 h-8 text-[#FF6B00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: '#FF6B00',
  },
]

export default function CalculatorsHub() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Calculators</h1>
        <p className="text-sm text-[#555570] mt-1">Tools for the serious short track racer</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {calculators.map((calc, i) => (
          <Link
            key={calc.href}
            href={calc.href}
            className={`group bg-[#14141F] border border-[#2A2A3A] rounded-lg p-5 card-hover animate-fade-up stagger-${i + 1}`}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${calc.color}10` }}
              >
                {calc.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#D4D4E0] group-hover:text-[#00B4FF] transition-colors">
                  {calc.title}
                </h2>
                <p className="text-[12px] text-[#555570] mt-1.5 leading-relaxed">{calc.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] text-[#3A3A4A] group-hover:text-[#7A7A90] transition-all">
              <span>Open calculator</span>
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
