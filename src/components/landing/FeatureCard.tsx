interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-6 hover:border-[#FF6B00]/30 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center mb-4 text-[#FF6B00] group-hover:bg-[#FF6B00]/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[#7A7A90] leading-relaxed">{description}</p>
    </div>
  )
}
