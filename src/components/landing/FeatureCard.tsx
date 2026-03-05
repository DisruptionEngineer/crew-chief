interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-[#FF8A00]/30 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center mb-4 text-[#FF8A00] group-hover:bg-[#FF8A00]/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[#888] leading-relaxed">{description}</p>
    </div>
  )
}
