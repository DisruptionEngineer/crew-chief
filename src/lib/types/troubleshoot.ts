// ============================================================
// Troubleshooting / Diagnostic types
// ============================================================

export interface DiagnosticStep {
  id: string
  question: string
  options: DiagnosticOption[]
}

export interface DiagnosticOption {
  label: string
  description: string
  icon: string
  nextStepId?: string
  resultId?: string
}

export interface DiagnosticResult {
  id: string
  title: string
  subtitle: string
  adjustments: Adjustment[]
}

export interface Adjustment {
  priority: number
  category: string
  action: string
  amount: string
  explanation: string
}
