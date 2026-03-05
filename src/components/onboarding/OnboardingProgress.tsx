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
                  ? 'bg-[#FF8A00] text-[#0D0D0D]'
                  : i === currentStep
                  ? 'bg-[#FF8A00]/20 text-[#FF8A00] border-2 border-[#FF8A00]'
                  : 'bg-[#252525] text-[#666] border border-[#333]'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-medium uppercase tracking-wider ${
              i <= currentStep ? 'text-[#F5F5F5]' : 'text-[#666]'
            }`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 mb-4 ${i < currentStep ? 'bg-[#FF8A00]' : 'bg-[#333]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
