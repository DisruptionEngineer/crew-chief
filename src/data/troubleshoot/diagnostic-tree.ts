import type { DiagnosticStep, DiagnosticResult, TrackCondition } from '@/lib/types'

export const diagnosticSteps: DiagnosticStep[] = [
  {
    id: 'symptom',
    question: 'What is your car doing?',
    options: [
      {
        label: 'Pushing / Tight',
        description: 'Front tires slide — car goes straight when you turn the wheel (understeer)',
        icon: 'arrow-up-right',
        nextStepId: 'when-tight',
      },
      {
        label: 'Loose / Free',
        description: 'Rear end slides out — car wants to spin (oversteer)',
        icon: 'rotate-ccw',
        nextStepId: 'when-loose',
      },
      {
        label: 'No Forward Bite',
        description: 'Tires spin on corner exit — no acceleration grip',
        icon: 'zap-off',
        nextStepId: 'condition-bite',
      },
      {
        label: 'Inconsistent',
        description: 'Handling changes lap to lap unpredictably',
        icon: 'shuffle',
        resultId: 'inconsistent',
      },
    ],
  },
  {
    id: 'when-tight',
    question: 'When does the car push?',
    options: [
      { label: 'Corner Entry', description: 'Pushing as you brake and turn in', icon: 'corner-down-right', nextStepId: 'condition-tight-entry' },
      { label: 'Mid-Corner', description: 'Pushing at steady state through the middle', icon: 'circle', nextStepId: 'condition-tight-mid' },
      { label: 'Corner Exit', description: 'Pushing as you accelerate out', icon: 'corner-up-right', nextStepId: 'condition-tight-exit' },
      { label: 'Everywhere', description: 'The whole corner — entry, middle, and exit', icon: 'alert-circle', resultId: 'tight-everywhere' },
    ],
  },
  {
    id: 'when-loose',
    question: 'When does the car get loose?',
    options: [
      { label: 'Corner Entry', description: 'Rear steps out as you brake and turn in', icon: 'corner-down-right', nextStepId: 'condition-loose-entry' },
      { label: 'Mid-Corner', description: 'Rear slides in the middle of the turn', icon: 'circle', nextStepId: 'condition-loose-mid' },
      { label: 'Corner Exit', description: 'Rear kicks out under acceleration', icon: 'corner-up-right', nextStepId: 'condition-loose-exit' },
      { label: 'Everywhere', description: 'Loose the whole way through', icon: 'alert-circle', resultId: 'loose-everywhere' },
    ],
  },
  // Condition steps for each tight scenario
  {
    id: 'condition-tight-entry',
    question: 'What are the track conditions?',
    options: [
      { label: 'Heavy / Tacky', description: 'Wet or newly prepped surface', icon: 'droplets', resultId: 'tight-entry-heavy' },
      { label: 'Moderate', description: 'Normal racing conditions', icon: 'sun', resultId: 'tight-entry-moderate' },
      { label: 'Dry / Slick', description: 'Dry, worn-out surface', icon: 'wind', resultId: 'tight-entry-dry' },
    ],
  },
  {
    id: 'condition-tight-mid',
    question: 'What are the track conditions?',
    options: [
      { label: 'Heavy / Tacky', description: 'Wet or newly prepped surface', icon: 'droplets', resultId: 'tight-mid-heavy' },
      { label: 'Moderate', description: 'Normal racing conditions', icon: 'sun', resultId: 'tight-mid-moderate' },
      { label: 'Dry / Slick', description: 'Dry, worn-out surface', icon: 'wind', resultId: 'tight-mid-dry' },
    ],
  },
  {
    id: 'condition-tight-exit',
    question: 'What are the track conditions?',
    options: [
      { label: 'Heavy / Tacky', description: 'Wet or newly prepped surface', icon: 'droplets', resultId: 'tight-exit-heavy' },
      { label: 'Moderate', description: 'Normal racing conditions', icon: 'sun', resultId: 'tight-exit-moderate' },
      { label: 'Dry / Slick', description: 'Dry, worn-out surface', icon: 'wind', resultId: 'tight-exit-dry' },
    ],
  },
  // Condition steps for loose scenarios
  {
    id: 'condition-loose-entry',
    question: 'What are the track conditions?',
    options: [
      { label: 'Heavy / Tacky', description: 'Wet or newly prepped surface', icon: 'droplets', resultId: 'loose-entry-heavy' },
      { label: 'Moderate', description: 'Normal racing conditions', icon: 'sun', resultId: 'loose-entry-moderate' },
      { label: 'Dry / Slick', description: 'Dry, worn-out surface', icon: 'wind', resultId: 'loose-entry-dry' },
    ],
  },
  {
    id: 'condition-loose-mid',
    question: 'What are the track conditions?',
    options: [
      { label: 'Heavy / Tacky', description: 'Wet or newly prepped surface', icon: 'droplets', resultId: 'loose-mid-heavy' },
      { label: 'Moderate', description: 'Normal racing conditions', icon: 'sun', resultId: 'loose-mid-moderate' },
      { label: 'Dry / Slick', description: 'Dry, worn-out surface', icon: 'wind', resultId: 'loose-mid-dry' },
    ],
  },
  {
    id: 'condition-loose-exit',
    question: 'What are the track conditions?',
    options: [
      { label: 'Heavy / Tacky', description: 'Wet or newly prepped surface', icon: 'droplets', resultId: 'loose-exit-heavy' },
      { label: 'Moderate', description: 'Normal racing conditions', icon: 'sun', resultId: 'loose-exit-moderate' },
      { label: 'Dry / Slick', description: 'Dry, worn-out surface', icon: 'wind', resultId: 'loose-exit-dry' },
    ],
  },
  // No bite condition
  {
    id: 'condition-bite',
    question: 'What are the track conditions?',
    options: [
      { label: 'Heavy / Tacky', description: 'Wet or newly prepped surface', icon: 'droplets', resultId: 'no-bite-heavy' },
      { label: 'Moderate', description: 'Normal racing conditions', icon: 'sun', resultId: 'no-bite-moderate' },
      { label: 'Dry / Slick', description: 'Dry, worn-out surface', icon: 'wind', resultId: 'no-bite-dry' },
    ],
  },
]

export const diagnosticResults: Record<string, DiagnosticResult> = {
  // TIGHT - ENTRY
  'tight-entry-heavy': {
    id: 'tight-entry-heavy',
    title: 'Tight on Entry',
    subtitle: 'Heavy / Tacky Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower RF tire pressure 1-2 psi', amount: '-1 to -2 psi RF', explanation: 'Less pressure on the loaded front tire increases contact patch, giving more grip to turn in.' },
      { priority: 2, category: 'Cross-Weight', action: 'Reduce cross-weight 5-10 lbs', amount: 'Turn LF jack bolt up 1/4 turn', explanation: 'Less cross-weight frees the front end to rotate on entry.' },
      { priority: 3, category: 'Alignment', action: 'Add 1/16" toe-out', amount: '+1/16" toe-out', explanation: 'More toe-out helps initial turn-in response. Be careful — too much creates tire drag.' },
      { priority: 4, category: 'Sway Bar', action: 'Remove front sway bar or go smaller', amount: 'Remove or downsize', explanation: 'Sway bar resists body roll, which reduces front tire grip on turn-in. Heavy tracks amplify this effect.' },
    ],
  },
  'tight-entry-moderate': {
    id: 'tight-entry-moderate',
    title: 'Tight on Entry',
    subtitle: 'Moderate Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower RF tire pressure 1 psi', amount: '-1 psi RF', explanation: 'Increases front grip for turn-in on a moderate surface.' },
      { priority: 2, category: 'Alignment', action: 'Add 1/32" toe-out', amount: '+1/32" toe-out', explanation: 'A small toe-out increase sharpens turn-in without excessive drag.' },
      { priority: 3, category: 'Cross-Weight', action: 'Reduce cross-weight slightly', amount: '-5 lbs cross-weight', explanation: 'Transfers load off the front end for easier rotation into the corner.' },
      { priority: 4, category: 'Driving', action: 'Try trail-braking deeper into the corner', amount: 'Brake later, release slowly', explanation: 'Trail-braking shifts weight to the front tires, increasing their grip for turn-in.' },
    ],
  },
  'tight-entry-dry': {
    id: 'tight-entry-dry',
    title: 'Tight on Entry',
    subtitle: 'Dry / Slick Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower front pressures 2-3 psi', amount: '-2 to -3 psi both fronts', explanation: 'On a slick surface, maximum contact patch is critical. Lower pressures spread the tire footprint.' },
      { priority: 2, category: 'Springs', action: 'Soften front springs 25-50 lbs', amount: '-25 to -50 lbs/in front springs', explanation: 'Softer front springs allow more weight transfer to the front on braking, improving turn-in grip.' },
      { priority: 3, category: 'Cross-Weight', action: 'Remove 10-15 lbs cross-weight', amount: 'Turn LF jack bolt up 1/2 turn', explanation: 'Frees the front end to rotate. On slick tracks, the car needs all the help it can get to turn.' },
      { priority: 4, category: 'Sway Bar', action: 'Remove front sway bar', amount: 'Remove', explanation: 'On a slick track, the sway bar hurts more than it helps. Remove for maximum front grip.' },
    ],
  },
  // TIGHT - MID
  'tight-mid-heavy': {
    id: 'tight-mid-heavy',
    title: 'Tight at Mid-Corner',
    subtitle: 'Heavy / Tacky Track',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Reduce cross-weight 10 lbs', amount: '-10 lbs (LF jack up 1/4 turn)', explanation: 'Mid-corner push is a cross-weight issue. Less cross-weight plants the RR and frees the front.' },
      { priority: 2, category: 'Sway Bar', action: 'Remove or soften front sway bar', amount: 'Remove', explanation: 'Sway bar prevents the car from rolling freely, which kills mid-corner grip at the front.' },
      { priority: 3, category: 'Springs', action: 'Soften RF spring 25 lbs', amount: '-25 lbs/in RF', explanation: 'A softer RF allows more weight transfer to the outside front, increasing mid-corner grip.' },
      { priority: 4, category: 'Tire Pressure', action: 'Lower front pressures 1 psi', amount: '-1 psi both fronts', explanation: 'More contact patch helps the front tires maintain grip through the middle of the turn.' },
    ],
  },
  'tight-mid-moderate': {
    id: 'tight-mid-moderate',
    title: 'Tight at Mid-Corner',
    subtitle: 'Moderate Track',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Reduce cross-weight 5-10 lbs', amount: '-5 to -10 lbs', explanation: 'The primary tool for mid-corner balance. Less cross-weight frees the car to rotate.' },
      { priority: 2, category: 'Springs', action: 'Soften front springs slightly', amount: '-25 lbs/in fronts', explanation: 'Allows more body roll which loads the outside tires more evenly.' },
      { priority: 3, category: 'Tire Pressure', action: 'Equalize front pressures', amount: 'Match LF and RF', explanation: 'Uneven front pressures can cause a directional pull. Make sure they match for figure 8.' },
    ],
  },
  'tight-mid-dry': {
    id: 'tight-mid-dry',
    title: 'Tight at Mid-Corner',
    subtitle: 'Dry / Slick Track',
    adjustments: [
      { priority: 1, category: 'Springs', action: 'Soften front springs 50 lbs', amount: '-50 lbs/in both fronts', explanation: 'On slick tracks, softer springs are crucial. They allow more weight transfer and more tire contact.' },
      { priority: 2, category: 'Cross-Weight', action: 'Reduce cross-weight 15 lbs', amount: '-15 lbs', explanation: 'Aggressively free the front end on slick tracks.' },
      { priority: 3, category: 'Tire Pressure', action: 'Lower all pressures 2 psi', amount: '-2 psi all corners', explanation: 'Maximum contact patch is the #1 priority on slick surfaces.' },
      { priority: 4, category: 'Sway Bar', action: 'Remove front sway bar', amount: 'Remove if not already', explanation: 'Every bit of front mechanical grip matters on a slick track.' },
    ],
  },
  // TIGHT - EXIT
  'tight-exit-heavy': {
    id: 'tight-exit-heavy',
    title: 'Tight on Exit',
    subtitle: 'Heavy / Tacky Track',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Reduce cross-weight', amount: '-10 lbs', explanation: 'Less cross-weight loads the RR more on exit, rotating the car off the corner.' },
      { priority: 2, category: 'Springs', action: 'Stiffen LR spring 25 lbs', amount: '+25 lbs/in LR', explanation: 'A stiffer LR picks up the inside rear faster on exit, helping the car rotate.' },
      { priority: 3, category: 'Tire Pressure', action: 'Lower RR pressure 1 psi', amount: '-1 psi RR', explanation: 'More rear grip helps the car drive off the corner instead of pushing.' },
    ],
  },
  'tight-exit-moderate': {
    id: 'tight-exit-moderate',
    title: 'Tight on Exit',
    subtitle: 'Moderate Track',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Reduce cross-weight slightly', amount: '-5 lbs', explanation: 'Small adjustment first — exit push is often a cross-weight issue.' },
      { priority: 2, category: 'Tire Pressure', action: 'Lower rear pressures 1 psi', amount: '-1 psi both rears', explanation: 'More rear grip helps the car drive off the corner.' },
      { priority: 3, category: 'Driving', action: 'Delay throttle application slightly', amount: 'Wait 1/4 second longer before gas', explanation: 'Applying throttle too early shifts weight to the rear, but the front tires are already at the limit.' },
    ],
  },
  'tight-exit-dry': {
    id: 'tight-exit-dry',
    title: 'Tight on Exit',
    subtitle: 'Dry / Slick Track',
    adjustments: [
      { priority: 1, category: 'Springs', action: 'Soften front springs', amount: '-50 lbs/in fronts', explanation: 'On a dry track, the car needs to be free overall. Softer fronts help.' },
      { priority: 2, category: 'Cross-Weight', action: 'Remove cross-weight aggressively', amount: '-15 to -20 lbs', explanation: 'Plant the RR for drive off the corner on a slick surface.' },
      { priority: 3, category: 'Tire Pressure', action: 'Lower all pressures 2 psi', amount: '-2 psi all corners', explanation: 'Maximum grip everywhere on a slick track.' },
    ],
  },
  // LOOSE - ENTRY
  'loose-entry-heavy': {
    id: 'loose-entry-heavy',
    title: 'Loose on Entry',
    subtitle: 'Heavy / Tacky Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Increase rear pressures 1-2 psi', amount: '+1 to +2 psi rears', explanation: 'More rear pressure stiffens the sidewall, preventing the rear from sliding under braking.' },
      { priority: 2, category: 'Cross-Weight', action: 'Add cross-weight 10 lbs', amount: 'Turn RF jack bolt down 1/4 turn', explanation: 'More cross-weight plants the LR and RF, stabilizing the rear on entry.' },
      { priority: 3, category: 'Springs', action: 'Stiffen rear springs 25 lbs', amount: '+25 lbs/in both rears', explanation: 'Stiffer rears reduce weight transfer off the rear axle under braking.' },
      { priority: 4, category: 'Driving', action: 'Brake earlier and more gently', amount: 'Brake sooner, less pedal pressure', explanation: 'Aggressive braking shifts too much weight forward, unloading the rear tires.' },
    ],
  },
  'loose-entry-moderate': {
    id: 'loose-entry-moderate',
    title: 'Loose on Entry',
    subtitle: 'Moderate Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Increase rear pressures 1 psi', amount: '+1 psi both rears', explanation: 'Stabilizes the rear under braking forces.' },
      { priority: 2, category: 'Cross-Weight', action: 'Add cross-weight 5-10 lbs', amount: '+5 to +10 lbs', explanation: 'Loads the rear tires more for stability.' },
      { priority: 3, category: 'Alignment', action: 'Reduce front toe-out 1/32"', amount: '-1/32" toe-out', explanation: 'Less toe-out makes the car more stable on entry but slightly slower to turn in.' },
    ],
  },
  'loose-entry-dry': {
    id: 'loose-entry-dry',
    title: 'Loose on Entry',
    subtitle: 'Dry / Slick Track',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Add cross-weight 10-15 lbs', amount: '+10 to +15 lbs', explanation: 'On slick tracks, the rear needs as much load as possible to maintain grip.' },
      { priority: 2, category: 'Tire Pressure', action: 'Lower rear pressures 1 psi', amount: '-1 psi both rears', explanation: 'On a dry track, lower pressure = more contact patch = more grip. Different from wet where higher pressure prevents hydroplaning.' },
      { priority: 3, category: 'Springs', action: 'Soften rear springs 25 lbs', amount: '-25 lbs/in rears', explanation: 'Softer rears keep the tires planted on a slick surface with less grip available.' },
      { priority: 4, category: 'Driving', action: 'Use less aggressive braking', amount: 'Threshold brake, no lockup', explanation: 'On a slick track, locking the rears is easy. Smooth, progressive braking keeps the rear planted.' },
    ],
  },
  // LOOSE - MID
  'loose-mid-heavy': {
    id: 'loose-mid-heavy',
    title: 'Loose at Mid-Corner',
    subtitle: 'Heavy / Tacky Track',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Add cross-weight 10 lbs', amount: '+10 lbs (RF jack down 1/4 turn)', explanation: 'Mid-corner loose is primarily a cross-weight issue. More cross-weight stabilizes the rear.' },
      { priority: 2, category: 'Springs', action: 'Stiffen RR spring 25 lbs', amount: '+25 lbs/in RR', explanation: 'More RR spring rate reduces roll onto the outside rear, keeping more load on both rear tires.' },
      { priority: 3, category: 'Tire Pressure', action: 'Lower rear pressures 1 psi', amount: '-1 psi both rears', explanation: 'More contact patch on the rears for better mid-corner grip.' },
    ],
  },
  'loose-mid-moderate': {
    id: 'loose-mid-moderate',
    title: 'Loose at Mid-Corner',
    subtitle: 'Moderate Track',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Add cross-weight 5-10 lbs', amount: '+5 to +10 lbs', explanation: 'Primary adjustment for mid-corner balance.' },
      { priority: 2, category: 'Tire Pressure', action: 'Check rear tire temps and adjust', amount: 'Equalize rear temps with pressure', explanation: 'If one rear is hotter, it may be overloaded. Balance pressures to equalize temps.' },
      { priority: 3, category: 'Springs', action: 'Consider stiffer rear springs', amount: '+25 lbs/in both rears', explanation: 'Stiffer rears reduce body roll onto the outside rear, keeping the car more planted.' },
    ],
  },
  'loose-mid-dry': {
    id: 'loose-mid-dry',
    title: 'Loose at Mid-Corner',
    subtitle: 'Dry / Slick Track',
    adjustments: [
      { priority: 1, category: 'Springs', action: 'Soften rear springs for more grip', amount: '-25 lbs/in both rears', explanation: 'On slick tracks, softer rears allow the axle to follow the surface better.' },
      { priority: 2, category: 'Cross-Weight', action: 'Add cross-weight 10-15 lbs', amount: '+10 to +15 lbs', explanation: 'Plant the rear tires on a surface with minimal grip.' },
      { priority: 3, category: 'Tire Pressure', action: 'Lower rear pressures 2 psi', amount: '-2 psi both rears', explanation: 'Maximum contact patch is critical on slick tracks.' },
    ],
  },
  // LOOSE - EXIT
  'loose-exit-heavy': {
    id: 'loose-exit-heavy',
    title: 'Loose on Exit',
    subtitle: 'Heavy / Tacky Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower RR pressure 1-2 psi', amount: '-1 to -2 psi RR', explanation: 'The RR is the primary drive tire. More contact patch = more grip on acceleration.' },
      { priority: 2, category: 'Cross-Weight', action: 'Add cross-weight 10 lbs', amount: 'Turn RF jack bolt down 1/4 turn', explanation: 'More cross-weight loads the RR more heavily, resisting the tendency to spin.' },
      { priority: 3, category: 'Springs', action: 'Stiffen RR spring 25 lbs', amount: '+25 lbs/in RR', explanation: 'Keeps more load on the RR under acceleration — stiffer spring resists weight transfer off that corner.' },
      { priority: 4, category: 'Driving', action: 'Apply throttle more gradually', amount: 'Ease into the gas, no jabbing', explanation: 'Sudden throttle application can break the rear tires loose. Smooth, progressive throttle keeps them hooked up.' },
    ],
  },
  'loose-exit-moderate': {
    id: 'loose-exit-moderate',
    title: 'Loose on Exit',
    subtitle: 'Moderate Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower RR pressure 1 psi', amount: '-1 psi RR', explanation: 'Easy first adjustment — more RR contact patch for better drive.' },
      { priority: 2, category: 'Cross-Weight', action: 'Add cross-weight 5-10 lbs', amount: '+5 to +10 lbs', explanation: 'Loads the RR for better traction on exit.' },
      { priority: 3, category: 'Springs', action: 'Check RR spring rate', amount: 'Consider +25 lbs/in RR', explanation: 'Stiffer RR spring maintains load on the drive tire during acceleration.' },
    ],
  },
  'loose-exit-dry': {
    id: 'loose-exit-dry',
    title: 'Loose on Exit',
    subtitle: 'Dry / Slick Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower rear pressures 2 psi', amount: '-2 psi both rears', explanation: 'On a slick surface, you need every bit of contact patch. Low pressures spread the tire footprint.' },
      { priority: 2, category: 'Cross-Weight', action: 'Add cross-weight 15 lbs', amount: '+15 lbs', explanation: 'Aggressively load the RR on a slick track.' },
      { priority: 3, category: 'Springs', action: 'Soften rear springs', amount: '-25 lbs/in both rears', explanation: 'On slick tracks, softer rears keep the tires glued to the surface. The car needs compliance.' },
      { priority: 4, category: 'Driving', action: 'Very smooth, patient throttle', amount: 'Feather the gas out of turns', explanation: 'Slick tracks punish aggressive throttle. Be patient and let the car hook up before applying power.' },
    ],
  },
  // EVERYWHERE
  'tight-everywhere': {
    id: 'tight-everywhere',
    title: 'Tight Everywhere',
    subtitle: 'Car pushes through the entire corner',
    adjustments: [
      { priority: 1, category: 'Sway Bar', action: 'Remove the front sway bar', amount: 'Remove completely', explanation: 'If the car pushes everywhere, the sway bar is the #1 cause. It prevents the chassis from rolling and kills front grip.' },
      { priority: 2, category: 'Springs', action: 'Soften front springs 50 lbs', amount: '-50 lbs/in both fronts', explanation: 'Softer front springs allow more weight transfer to the front tires, increasing grip everywhere.' },
      { priority: 3, category: 'Cross-Weight', action: 'Reduce cross-weight 15-20 lbs', amount: '-15 to -20 lbs', explanation: 'A fundamental balance shift — less cross-weight frees the car to rotate.' },
      { priority: 4, category: 'Tire Pressure', action: 'Lower front pressures, raise rear slightly', amount: '-2 psi fronts, +1 psi rears', explanation: 'Shift the grip balance toward the front axle.' },
      { priority: 5, category: 'Alignment', action: 'Add front toe-out and negative camber', amount: '+1/16" toe-out, -0.5° camber', explanation: 'More toe-out helps turn-in, more negative camber maximizes the front tire contact patch in turns.' },
    ],
  },
  'loose-everywhere': {
    id: 'loose-everywhere',
    title: 'Loose Everywhere',
    subtitle: 'Car is oversteering through the entire corner',
    adjustments: [
      { priority: 1, category: 'Cross-Weight', action: 'Add cross-weight 20+ lbs', amount: '+20 lbs or more', explanation: 'The car is fundamentally too free. Cross-weight is the primary tool to stabilize the rear.' },
      { priority: 2, category: 'Springs', action: 'Stiffen rear springs 25-50 lbs', amount: '+25 to +50 lbs/in both rears', explanation: 'Stiffer rears reduce roll onto the outside rear, keeping both rear tires loaded.' },
      { priority: 3, category: 'Tire Pressure', action: 'Lower rear pressures 2 psi', amount: '-2 psi both rears', explanation: 'Maximum rear contact patch for grip.' },
      { priority: 4, category: 'Sway Bar', action: 'Consider adding front sway bar', amount: 'Stock or small aftermarket', explanation: 'A front sway bar restricts front grip, which balances the car toward understeer (less loose).' },
      { priority: 5, category: 'Alignment', action: 'Reduce front toe-out', amount: 'Set to 0 or slight toe-in', explanation: 'Less toe-out makes the car more stable in a straight line and less aggressive on turn-in.' },
    ],
  },
  // NO FORWARD BITE
  'no-bite-heavy': {
    id: 'no-bite-heavy',
    title: 'No Forward Bite',
    subtitle: 'Heavy / Tacky Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower rear pressures 2 psi', amount: '-2 psi both rears', explanation: 'More contact patch on the drive tires is the quickest fix for lack of bite.' },
      { priority: 2, category: 'Springs', action: 'Soften rear springs', amount: '-25 lbs/in both rears', explanation: 'Softer rears allow the axle to squat under acceleration, planting the tires harder.' },
      { priority: 3, category: 'Differential', action: 'Check differential — consider spool/mini-spool', amount: 'Lock the rear end', explanation: 'An open diff only drives one tire. A locked rear (spool/mini-spool) or good limited slip ensures both rear tires pull.' },
      { priority: 4, category: 'Weight', action: 'Move weight rearward if possible', amount: 'Aim for 52%+ rear', explanation: 'More rear weight = more load on the drive tires = more traction.' },
    ],
  },
  'no-bite-moderate': {
    id: 'no-bite-moderate',
    title: 'No Forward Bite',
    subtitle: 'Moderate Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower rear pressures 1-2 psi', amount: '-1 to -2 psi both rears', explanation: 'Quick and easy — more tire on the ground means more grip.' },
      { priority: 2, category: 'Differential', action: 'Check differential is working', amount: 'Both tires should spin equally', explanation: 'If only one tire spins, your diff is open or the limited slip is worn out.' },
      { priority: 3, category: 'Springs', action: 'Soften rear springs', amount: '-25 lbs/in both rears', explanation: 'Allows the rear to squat under acceleration, planting the tires.' },
    ],
  },
  'no-bite-dry': {
    id: 'no-bite-dry',
    title: 'No Forward Bite',
    subtitle: 'Dry / Slick Track',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Lower ALL pressures', amount: '-3 psi all corners', explanation: 'On a bone-dry slick track, you need maximum rubber on the ground everywhere.' },
      { priority: 2, category: 'Springs', action: 'Soften entire car', amount: '-50 lbs fronts, -25 lbs rears', explanation: 'The car needs to be as compliant as possible to maintain tire contact on a slick surface.' },
      { priority: 3, category: 'Differential', action: 'Locked rear end is critical', amount: 'Spool or mini-spool', explanation: 'On a slick track, you cannot afford to spin only one tire. Both rears must drive equally.' },
      { priority: 4, category: 'Driving', action: 'Very smooth throttle application', amount: 'Think "roll into the gas"', explanation: 'On a slick surface, any sudden input breaks the tires loose. Smooth and patient wins.' },
    ],
  },
  // INCONSISTENT
  'inconsistent': {
    id: 'inconsistent',
    title: 'Inconsistent Handling',
    subtitle: 'The car handles differently lap to lap',
    adjustments: [
      { priority: 1, category: 'Tire Pressure', action: 'Check for pressure changes during run', amount: 'Measure cold vs hot pressures', explanation: 'Tires gain 1-3 psi as they heat up. If starting pressures are wrong, hot pressures may be way off. Adjust cold pressures so hot pressures land in your target range.' },
      { priority: 2, category: 'Suspension', action: 'Check for loose bolts, worn bushings', amount: 'Inspect all suspension hardware', explanation: 'Loose or worn components cause the geometry to change randomly. Tighten everything and replace worn bushings.' },
      { priority: 3, category: 'Shocks', action: 'Check shocks for fade or leaking', amount: 'Inspect all 4 shocks', explanation: 'Worn shocks lose damping as they heat up, changing how the car handles from start to finish.' },
      { priority: 4, category: 'Track', action: 'The track surface may be changing', amount: 'Adjust to evolving conditions', explanation: 'Track conditions change throughout the night as rubber gets laid down and moisture evaporates. What works in hot laps may not work in the feature.' },
      { priority: 5, category: 'Tires', action: 'Check tire wear patterns', amount: 'Look for uneven wear or blistering', explanation: 'Uneven wear indicates alignment or pressure issues. Blistering means the tire is overheating — raise pressure or check camber.' },
    ],
  },
}

export function getDiagnosticStep(stepId: string): DiagnosticStep | undefined {
  return diagnosticSteps.find(s => s.id === stepId)
}

export function getDiagnosticResult(resultId: string): DiagnosticResult | undefined {
  return diagnosticResults[resultId]
}
