interface StepConfirmProps {
  data: {
    displayName: string
    experienceLevel: string
    carYear: string
    carMake: string
    carModel: string
    carWeight: string
    engineType: string
    raceClass: string
    trackName: string
    trackSurface: string
    trackLength: string
    trackBanking: string
  }
}

export function StepConfirm({ data }: StepConfirmProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Ready to Race</h2>
        <p className="text-sm text-[#888]">Here&apos;s your profile. Hit the button to start.</p>
      </div>

      {/* Driver */}
      <Section title="Driver">
        <Row label="Name" value={data.displayName} />
        <Row label="Experience" value={data.experienceLevel} />
      </Section>

      {/* Car */}
      <Section title="Car">
        <Row label="Vehicle" value={`${data.carYear} ${data.carMake} ${data.carModel}`} />
        <Row label="Weight" value={data.carWeight ? `${Number(data.carWeight).toLocaleString()} lbs` : '—'} />
        <Row label="Engine" value={data.engineType || '—'} />
        <Row label="Class" value={data.raceClass ? data.raceClass.replace(/-/g, ' ') : '—'} />
      </Section>

      {/* Track */}
      <Section title="Home Track">
        <Row label="Track" value={data.trackName || '—'} />
        <Row label="Surface" value={data.trackSurface || '—'} />
        <Row label="Length" value={data.trackLength || '—'} />
        <Row label="Banking" value={data.trackBanking ? `${data.trackBanking}°` : '—'} />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
      <h3 className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#666]">{label}</span>
      <span className="text-[#F5F5F5] font-medium capitalize">{value}</span>
    </div>
  )
}
