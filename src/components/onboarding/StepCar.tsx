interface StepCarProps {
  carYear: string
  carMake: string
  carModel: string
  carWeight: string
  engineType: string
  raceClass: string
  onChange: (field: string, value: string) => void
}

const presets = [
  { label: '1988 Monte Carlo SS', year: '1988', make: 'Chevrolet', model: 'Monte Carlo', weight: '3200', engine: 'GM 350', cls: 'street-stock' },
  { label: '2005 Impala', year: '2005', make: 'Chevrolet', model: 'Impala', weight: '3400', engine: 'GM LS', cls: 'modified' },
]

export function StepCar({ carYear, carMake, carModel, carWeight, engineType, raceClass, onChange }: StepCarProps) {
  const fillPreset = (p: typeof presets[0]) => {
    onChange('carYear', p.year)
    onChange('carMake', p.make)
    onChange('carModel', p.model)
    onChange('carWeight', p.weight)
    onChange('engineType', p.engine)
    onChange('raceClass', p.cls)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Your Race Car</h2>
        <p className="text-sm text-[#888]">Tell us about your ride.</p>
      </div>

      {/* Quick-select presets */}
      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Quick Select</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => fillPreset(p)}
              className={`p-3 rounded-lg border text-left transition-all text-sm ${
                carModel === p.model && carYear === p.year
                  ? 'bg-[#FF8A00]/10 border-[#FF8A00] text-[#F5F5F5]'
                  : 'bg-[#1A1A1A] border-[#333] text-[#888] hover:border-[#555]'
              }`}
            >
              <span className="font-semibold">{p.label}</span>
              <p className="text-[10px] text-[#666] mt-0.5">{p.cls.replace(/-/g, ' ')}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Year" value={carYear} field="carYear" onChange={onChange} placeholder="1975" />
        <Field label="Make" value={carMake} field="carMake" onChange={onChange} placeholder="Chevrolet" />
        <Field label="Model" value={carModel} field="carModel" onChange={onChange} placeholder="Monte Carlo" />
        <Field label="Weight (lbs)" value={carWeight} field="carWeight" onChange={onChange} placeholder="3300" type="number" />
        <Field label="Engine" value={engineType} field="engineType" onChange={onChange} placeholder="GM 350" />
        <div>
          <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Class</label>
          <select
            value={raceClass}
            onChange={(e) => onChange('raceClass', e.target.value)}
            className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          >
            <option value="">Select...</option>
            <option value="street-stock">Street Stock</option>
            <option value="modified">Modified</option>
            <option value="late-model">Late Model</option>
            <option value="sportsman">Sportsman</option>
            <option value="hobby-stock">Hobby Stock</option>
            <option value="legend-car">Legend Car</option>
            <option value="enduro">Enduro</option>
            <option value="figure-8">Figure 8</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, field, onChange, placeholder, type = 'text' }: {
  label: string; value: string; field: string; onChange: (f: string, v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
      />
    </div>
  )
}
