// ============================================================
// Rules & Tech Inspection types
// ============================================================

export interface Rule {
  id: string
  section: string
  number: string
  text: string
  category: RuleCategory
}

export type RuleCategory =
  | 'weight'
  | 'engine'
  | 'suspension'
  | 'tires'
  | 'safety'
  | 'body'
  | 'drivetrain'
  | 'electrical'
  | 'fuel'
  | 'general'

export interface TechCheckItem {
  id: string
  category: string
  label: string
  rule: string
  checked: boolean
}
