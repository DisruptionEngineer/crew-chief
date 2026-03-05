'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { StepDriver } from '@/components/onboarding/StepDriver'
import { StepCar } from '@/components/onboarding/StepCar'
import { StepTrack } from '@/components/onboarding/StepTrack'
import { StepConfirm } from '@/components/onboarding/StepConfirm'
import { db } from '@/data/db'
import { createClient } from '@/lib/supabase/client'
import type { Car, Track, UserProfile, ExperienceLevel, RaceClass, TrackSurface } from '@/lib/types'

interface OnboardingData {
  displayName: string
  experienceLevel: ExperienceLevel | ''
  carYear: string
  carMake: string
  carModel: string
  carWeight: string
  engineType: string
  raceClass: string
  selectedCarId: string
  trackName: string
  trackSurface: TrackSurface | ''
  trackLength: string
  trackBanking: string
  selectedTrackId: string
}

const initialData: OnboardingData = {
  displayName: '',
  experienceLevel: '',
  carYear: '',
  carMake: '',
  carModel: '',
  carWeight: '',
  engineType: '',
  raceClass: '',
  selectedCarId: '',
  trackName: '',
  trackSurface: '',
  trackLength: '',
  trackBanking: '',
  selectedTrackId: '',
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [saving, setSaving] = useState(false)

  const updateField = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const canAdvance = () => {
    switch (step) {
      case 0: return data.displayName.trim() !== '' && data.experienceLevel !== ''
      case 1: return data.carYear !== '' && data.carMake !== '' && data.carModel !== ''
      case 2: return data.trackName.trim() !== ''
      case 3: return true
      default: return false
    }
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      // Use DB car ID if selected from database, otherwise generate new
      const carId = data.selectedCarId || uuid()
      const trackId = data.selectedTrackId || uuid()
      const profileId = uuid()

      // Create car record (for IndexedDB — DB cars are already in Supabase)
      const car: Car = {
        id: carId,
        name: `${data.carYear} ${data.carModel}`,
        year: parseInt(data.carYear) || 0,
        make: data.carMake,
        model: data.carModel,
        class: (data.raceClass || 'street-stock') as RaceClass,
        eligibleDivisions: [(data.raceClass || 'street-stock') as RaceClass],
        engineFamilyId: data.engineType?.includes('Ford') ? 'ford-351w' : data.engineType?.includes('4.6') ? 'ford-46-sohc' : data.engineType?.includes('Mopar') ? 'mopar-360' : 'gm-sbc-350',
        weight: parseInt(data.carWeight) || 3300,
        wheelbase: 116,
        trackWidthFront: 60,
        trackWidthRear: 60,
        frontSuspension: 'sla-coil',
        rearSuspension: 'solid-axle-coil',
        engine: {
          displacement: 350,
          block: data.engineType || 'GM 350',
          heads: 'Cast iron',
          cam: 'Stock',
          carb: 'Holley 4412 500 CFM',
          compression: '9.5:1',
        },
        notes: '',
      }

      // Create track record
      const track: Track = {
        id: trackId,
        name: data.trackName,
        location: '',
        length: data.trackLength || '0.375',
        surface: (data.trackSurface || 'mixed') as TrackSurface,
        surfaceDetails: '',
        banking: parseInt(data.trackBanking) || 0,
        shape: 'oval',
        elevation: 0,
        notes: '',
      }

      // Create user profile
      const profile: UserProfile = {
        id: profileId,
        userId: '',
        displayName: data.displayName,
        experienceLevel: data.experienceLevel as ExperienceLevel,
        carId,
        homeTrackId: trackId,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      }

      // Save to IndexedDB
      await db.cars.put(car)
      await db.tracks.put(track)
      await db.userProfiles.put(profile)

      // Save to Supabase if authenticated
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          // Save user profile to Supabase
          await supabase.from('user_profiles').upsert({
            user_id: user.id,
            display_name: data.displayName,
            experience_level: data.experienceLevel || 'beginner',
            home_track_id: data.selectedTrackId || null,
            onboarding_complete: true,
          }, { onConflict: 'user_id' })

          // Add selected car to user's garage
          if (data.selectedCarId) {
            await supabase.from('user_cars').upsert({
              user_id: user.id,
              car_id: data.selectedCarId,
              is_primary: true,
            }, { onConflict: 'user_id,car_id' })
          }

          // Add selected track to user's tracks
          if (data.selectedTrackId) {
            await supabase.from('user_tracks').upsert({
              user_id: user.id,
              track_id: data.selectedTrackId,
              is_primary: true,
            }, { onConflict: 'user_id,track_id' })
          }
        } catch {
          // Supabase save failed — local copy exists as fallback
        }
      }

      // Mark onboarding complete in localStorage
      localStorage.setItem('tenths-onboarded', 'true')
      localStorage.setItem('tenths-car-id', carId)

      // Navigate to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Onboarding save error:', err)
      setSaving(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('tenths-onboarded', 'true')
    router.push('/dashboard')
  }

  return (
    <div>
      <OnboardingProgress currentStep={step} />

      {step === 0 && <StepDriver displayName={data.displayName} experienceLevel={data.experienceLevel} onChange={updateField} />}
      {step === 1 && <StepCar {...data} onChange={updateField} />}
      {step === 2 && <StepTrack trackName={data.trackName} trackSurface={data.trackSurface} trackLength={data.trackLength} trackBanking={data.trackBanking} onChange={updateField} />}
      {step === 3 && <StepConfirm data={data} />}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#333]/50">
        <div>
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-sm text-[#888] hover:text-[#F5F5F5] transition-colors px-4 py-2"
            >
              &larr; Back
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="text-sm text-[#666] hover:text-[#888] transition-colors px-4 py-2"
            >
              Skip for now
            </button>
          )}
        </div>

        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className={`px-6 py-3 rounded-md font-semibold text-sm transition-all ${
              canAdvance()
                ? 'bg-[#FF8A00] text-[#0D0D0D] hover:bg-[#FFA640]'
                : 'bg-[#333] text-[#666] cursor-not-allowed'
            }`}
          >
            Continue &rarr;
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={saving}
            className="px-8 py-3 rounded-md font-bold text-sm bg-[#FF8A00] text-[#0D0D0D] hover:bg-[#FFA640] transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : "Let's Go Racing 🏁"}
          </button>
        )}
      </div>
    </div>
  )
}
