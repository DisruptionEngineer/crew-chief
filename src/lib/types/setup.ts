// ============================================================
// Setup Recommendation types
// ============================================================

export interface SetupRecommendation {
  parameter: string
  label: string
  valueLF?: number | string
  valueRF?: number | string
  valueLR?: number | string
  valueRR?: number | string
  value?: number | string
  unit: string
  rangeLow?: number
  rangeHigh?: number
  explanation: string
}

export interface SetupRecommendations {
  springs: SetupRecommendation[]
  alignment: SetupRecommendation[]
  tirePressures: SetupRecommendation[]
  weight: SetupRecommendation[]
  other: SetupRecommendation[]
}
