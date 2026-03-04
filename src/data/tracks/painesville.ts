import type { Track } from '@/lib/types'

export const painesvilleSpeedway: Track = {
  id: 'painesville',
  name: 'Painesville Speedway',
  location: '500 Fairport Nursery Rd, Painesville, OH 44077',
  length: '1/5 mile',
  surface: 'mixed',
  surfaceDetails: 'Asphalt straightaways with concrete corners. The grip differential between surfaces is a key setup factor.',
  banking: 5,
  shape: 'Oval with Figure 8 crossover',
  elevation: 631,
  notes: 'Smallest track associated with NASCAR. Only weekly Figure 8 venue in Ohio. Concrete corners have less grip than asphalt straights — car may push entering corners. 2026 under new management (Scott Skufca). Radio frequency: 469.5000 (receive only).',
}

export const painesvilleSchedule2026 = [
  { date: '2026-04-04', event: 'Practice/Tech', classes: ['Street Stocks', 'Figure 8 Ironmen', 'Compacts'] },
  { date: '2026-04-08', event: 'Practice/Tech', classes: ['Street Stocks', 'Figure 8 Ironmen', 'Compacts'] },
  { date: '2026-04-11', event: 'Practice/Tech', classes: ['Street Stocks', 'Figure 8 Ironmen', 'Compacts', 'Old School Figure 8'] },
  { date: '2026-04-15', event: 'Practice/Tech', classes: ['Street Stocks', 'Figure 8 Ironmen', 'Compacts', 'Old School Figure 8'] },
  { date: '2026-04-18', event: 'Practice/Tech', classes: ['Street Stocks', 'Figure 8 Ironmen', 'Compacts', 'Old School Figure 8'] },
]

export const painesvilleGateTimes = {
  pitGates: '1:00 PM',
  hotLaps: '2:00 PM',
  mainGate: '3:00 PM',
  racing: '6:00 PM',
}

export const painesvilleGatePrices = {
  pits: 25,
  adults: 10,
  seniors: 5,
  kids6to12: 5,
  kids5under: 0,
}
