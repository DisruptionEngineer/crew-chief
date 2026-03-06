const steps = ['Driver', 'Car', 'Track', 'Confirm']

export function OnboardingProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentStep
                  ? 'bg-[#00B4FF] text-[#0A0A0F]'
                  : i === currentStep
                  ? 'bg-[#00B4FF]/20 text-[#00B4FF] border-2 border-[#00B4FF]'
                  : 'bg-[#1A1A28] text-[#555570] border border-[#2A2A3A]'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-medium uppercase tracking-wider ${
              i <= currentStep ? 'text-[#D4D4E0]' : 'text-[#555570]'
            }`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 mb-4 ${i < currentStep ? 'bg-[#00B4FF]' : 'bg-[#2A2A3A]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
