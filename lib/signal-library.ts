/**
 * Corporate Action Signal Library
 * 
 * Implements 12 quantitative signals for event-driven analysis:
 * 
 * MOMENTUM FAMILY (4 signals):
 * 1. Momentum_1m: 1-month price momentum post-event
 * 2. Momentum_3m: 3-month price momentum post-event  
 * 3. Momentum_6m: 6-month price momentum post-event
 * 4. Announcement_Momentum: Pre-announcement to ex-date momentum
 * 
 * MEAN REVERSION (3 signals):
 * 5. Z_Score: Price deviation from historical mean (±30d window)
 * 6. Reversal_5d: 5-day post-event reversal
 * 7. Reversal_10d: 10-day post-event reversal
 * 
 * VOLATILITY (3 signals):
 * 8. IV_Spike: Implied volatility change (approximated by realized vol)
 * 9. Volume_Surprise: Volume spike vs historical average
 * 10. Turnover_Acceleration: Turnover change pre vs post event
 * 
 * EVENT-SPECIFIC (2 signals):
 * 11. Post_Split_Momentum: Post-split price momentum (Type 440)
 * 12. Cross_Sectional_Rank: Relative signal strength across events
 */

import type { EODData, CorporateAction } from "./mock-corp-actions-data"

// Signal value interface
export interface Signal {
  name: string
  value: number
  score: -1 | 0 | 1 // -1=bearish, 0=neutral, 1=bullish
  percentile?: number // Cross-sectional rank
  description: string
}

// Signal result for an event
export interface EventSignals {
  eventId: string
  valoren: string
  exDividendDate: string
  actionType: number
  signals: {
    momentum_1m: Signal
    momentum_3m: Signal
    momentum_6m: Signal
    announcement_momentum: Signal
    z_score: Signal
    reversal_5d: Signal
    reversal_10d: Signal
    iv_spike: Signal
    volume_surprise: Signal
    turnover_acceleration: Signal
    post_split_momentum: Signal | null
    cross_sectional_rank: Signal
  }
  compositeScore: number // Sum of all scores
}

// ============================================================================
// MOMENTUM FAMILY
// ============================================================================

/**
 * Calculate 1-month momentum post-event
 * Returns: (Price_T+20 - Price_T) / Price_T
 */
export function calculateMomentum1M(
  eodData: EODData[],
  eventDate: string
): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex + 20 >= eodData.length) {
    return createNeutralSignal("Momentum_1m", "Insufficient data")
  }

  const priceAtEvent = eodData[eventIndex].closePrice
  const priceAfter1M = eodData[eventIndex + 20].closePrice
  const momentum = ((priceAfter1M - priceAtEvent) / priceAtEvent) * 100

  return {
    name: "Momentum_1m",
    value: momentum,
    score: momentum > 2 ? 1 : momentum < -2 ? -1 : 0,
    description: `${momentum.toFixed(2)}% return in 20 trading days`,
  }
}

/**
 * Calculate 3-month momentum post-event
 * Returns: (Price_T+60 - Price_T) / Price_T
 */
export function calculateMomentum3M(
  eodData: EODData[],
  eventDate: string
): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex + 60 >= eodData.length) {
    return createNeutralSignal("Momentum_3m", "Insufficient data")
  }

  const priceAtEvent = eodData[eventIndex].closePrice
  const priceAfter3M = eodData[eventIndex + 60].closePrice
  const momentum = ((priceAfter3M - priceAtEvent) / priceAtEvent) * 100

  return {
    name: "Momentum_3m",
    value: momentum,
    score: momentum > 5 ? 1 : momentum < -5 ? -1 : 0,
    description: `${momentum.toFixed(2)}% return in 60 trading days`,
  }
}

/**
 * Calculate 6-month momentum post-event
 * Returns: (Price_T+120 - Price_T) / Price_T
 */
export function calculateMomentum6M(
  eodData: EODData[],
  eventDate: string
): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex + 120 >= eodData.length) {
    return createNeutralSignal("Momentum_6m", "Insufficient data")
  }

  const priceAtEvent = eodData[eventIndex].closePrice
  const priceAfter6M = eodData[eventIndex + 120].closePrice
  const momentum = ((priceAfter6M - priceAtEvent) / priceAtEvent) * 100

  return {
    name: "Momentum_6m",
    value: momentum,
    score: momentum > 10 ? 1 : momentum < -10 ? -1 : 0,
    description: `${momentum.toFixed(2)}% return in 120 trading days`,
  }
}

/**
 * Calculate announcement momentum
 * Returns: (Price_ExDate - Price_Announcement) / Price_Announcement
 */
export function calculateAnnouncementMomentum(
  eodData: EODData[],
  action: CorporateAction
): Signal {
  const announceIndex = eodData.findIndex((d) => d.date === action.announcementDate)
  const exDivIndex = eodData.findIndex((d) => d.date === action.exDividendDate)

  if (announceIndex === -1 || exDivIndex === -1) {
    return createNeutralSignal("Announcement_Momentum", "Missing announcement/ex-date")
  }

  const priceAtAnnounce = eodData[announceIndex].closePrice
  const priceAtExDiv = eodData[exDivIndex].closePrice
  const momentum = ((priceAtExDiv - priceAtAnnounce) / priceAtAnnounce) * 100

  return {
    name: "Announcement_Momentum",
    value: momentum,
    score: momentum > 1 ? 1 : momentum < -1 ? -1 : 0,
    description: `${momentum.toFixed(2)}% drift from announcement to ex-date`,
  }
}

// ============================================================================
// MEAN REVERSION
// ============================================================================

/**
 * Calculate Z-Score: standardized price deviation
 * Z = (Price_T - μ) / σ where μ and σ from ±30d window
 */
export function calculateZScore(eodData: EODData[], eventDate: string): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex < 30 || eventIndex + 30 >= eodData.length) {
    return createNeutralSignal("Z_Score", "Insufficient data")
  }

  // Get ±30 day window
  const window = eodData.slice(eventIndex - 30, eventIndex + 30)
  const prices = window.map((d) => d.closePrice)

  // Calculate mean and std dev
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length
  const stdDev = Math.sqrt(variance)

  const priceAtEvent = eodData[eventIndex].closePrice
  const zScore = (priceAtEvent - mean) / stdDev

  return {
    name: "Z_Score",
    value: zScore,
    score: zScore > 2 ? -1 : zScore < -2 ? 1 : 0, // High Z-score = overbought = bearish
    description: `${zScore.toFixed(2)} std devs from 60-day mean`,
  }
}

/**
 * Calculate 5-day reversal
 * Returns: (Price_T+5 - Price_T) / Price_T
 * Positive = continuation, Negative = reversal
 */
export function calculateReversal5D(
  eodData: EODData[],
  eventDate: string
): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex + 5 >= eodData.length) {
    return createNeutralSignal("Reversal_5d", "Insufficient data")
  }

  const priceAtEvent = eodData[eventIndex].closePrice
  const priceAfter5D = eodData[eventIndex + 5].closePrice
  const reversal = ((priceAfter5D - priceAtEvent) / priceAtEvent) * 100

  // Reversal logic: if price dropped on event, positive reversal is bullish
  const eventDayReturn = eventIndex > 0
    ? ((eodData[eventIndex].closePrice - eodData[eventIndex - 1].closePrice) /
        eodData[eventIndex - 1].closePrice) * 100
    : 0

  const score = eventDayReturn < -1 && reversal > 1 ? 1 : eventDayReturn > 1 && reversal < -1 ? -1 : 0

  return {
    name: "Reversal_5d",
    value: reversal,
    score,
    description: `${reversal.toFixed(2)}% reversal in 5 days`,
  }
}

/**
 * Calculate 10-day reversal
 */
export function calculateReversal10D(
  eodData: EODData[],
  eventDate: string
): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex + 10 >= eodData.length) {
    return createNeutralSignal("Reversal_10d", "Insufficient data")
  }

  const priceAtEvent = eodData[eventIndex].closePrice
  const priceAfter10D = eodData[eventIndex + 10].closePrice
  const reversal = ((priceAfter10D - priceAtEvent) / priceAtEvent) * 100

  const eventDayReturn = eventIndex > 0
    ? ((eodData[eventIndex].closePrice - eodData[eventIndex - 1].closePrice) /
        eodData[eventIndex - 1].closePrice) * 100
    : 0

  const score = eventDayReturn < -1.5 && reversal > 2 ? 1 : eventDayReturn > 1.5 && reversal < -2 ? -1 : 0

  return {
    name: "Reversal_10d",
    value: reversal,
    score,
    description: `${reversal.toFixed(2)}% reversal in 10 days`,
  }
}

// ============================================================================
// VOLATILITY
// ============================================================================

/**
 * Calculate IV Spike (approximated by realized volatility change)
 * Returns: (σ_post - σ_pre) / σ_pre
 */
export function calculateIVSpike(eodData: EODData[], eventDate: string): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex < 10 || eventIndex + 10 >= eodData.length) {
    return createNeutralSignal("IV_Spike", "Insufficient data")
  }

  // Calculate realized volatility pre and post event
  const preWindow = eodData.slice(eventIndex - 10, eventIndex)
  const postWindow = eodData.slice(eventIndex + 1, eventIndex + 11)

  const preVol = calculateRealizedVolatility(preWindow)
  const postVol = calculateRealizedVolatility(postWindow)

  const volChange = ((postVol - preVol) / preVol) * 100

  return {
    name: "IV_Spike",
    value: volChange,
    score: volChange > 30 ? -1 : volChange < -20 ? 1 : 0, // High vol = risk = bearish
    description: `${volChange.toFixed(1)}% volatility change`,
  }
}

/**
 * Calculate volume surprise
 * Returns: (Volume_T - AvgVolume) / AvgVolume
 */
export function calculateVolumeSurprise(
  eodData: EODData[],
  eventDate: string
): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex < 20) {
    return createNeutralSignal("Volume_Surprise", "Insufficient data")
  }

  // Calculate average volume from 20 days before
  const preWindow = eodData.slice(eventIndex - 20, eventIndex)
  const avgVolume = preWindow.reduce((sum, d) => sum + d.volume, 0) / preWindow.length

  const eventVolume = eodData[eventIndex].volume
  const surprise = ((eventVolume - avgVolume) / avgVolume) * 100

  return {
    name: "Volume_Surprise",
    value: surprise,
    score: surprise > 100 ? 1 : surprise < -30 ? -1 : 0, // High volume = interest = bullish
    description: `${surprise.toFixed(1)}% volume spike vs 20-day avg`,
  }
}

/**
 * Calculate turnover acceleration
 * Returns: (Turnover_post - Turnover_pre) / Turnover_pre
 */
export function calculateTurnoverAcceleration(
  eodData: EODData[],
  eventDate: string
): Signal {
  const eventIndex = eodData.findIndex((d) => d.date === eventDate)
  if (eventIndex === -1 || eventIndex < 10 || eventIndex + 10 >= eodData.length) {
    return createNeutralSignal("Turnover_Acceleration", "Insufficient data")
  }

  const preWindow = eodData.slice(eventIndex - 10, eventIndex)
  const postWindow = eodData.slice(eventIndex + 1, eventIndex + 11)

  const avgTurnoverPre = preWindow.reduce((sum, d) => sum + d.turnover, 0) / preWindow.length
  const avgTurnoverPost = postWindow.reduce((sum, d) => sum + d.turnover, 0) / postWindow.length

  const acceleration = ((avgTurnoverPost - avgTurnoverPre) / avgTurnoverPre) * 100

  return {
    name: "Turnover_Acceleration",
    value: acceleration,
    score: acceleration > 50 ? 1 : acceleration < -30 ? -1 : 0,
    description: `${acceleration.toFixed(1)}% turnover change`,
  }
}

// ============================================================================
// EVENT-SPECIFIC
// ============================================================================

/**
 * Calculate post-split momentum (Type 440 only)
 * Returns: (Price_T+30 - Price_T_adjusted) / Price_T_adjusted
 */
export function calculatePostSplitMomentum(
  eodData: EODData[],
  action: CorporateAction
): Signal | null {
  if (action.actionType !== 440) {
    return null // Only for stock splits
  }

  const eventIndex = eodData.findIndex((d) => d.date === action.exDividendDate)
  if (eventIndex === -1 || eventIndex + 30 >= eodData.length) {
    return createNeutralSignal("Post_Split_Momentum", "Insufficient data")
  }

  const priceAtSplit = eodData[eventIndex].closePrice
  const priceAfter30D = eodData[eventIndex + 30].closePrice
  const momentum = ((priceAfter30D - priceAtSplit) / priceAtSplit) * 100

  return {
    name: "Post_Split_Momentum",
    value: momentum,
    score: momentum > 5 ? 1 : momentum < -5 ? -1 : 0,
    description: `${momentum.toFixed(2)}% post-split 30-day momentum`,
  }
}

/**
 * Calculate cross-sectional rank
 * This ranks the event against all other events in the universe
 * Returns percentile rank (0-100)
 */
export function calculateCrossSectionalRank(
  eventSignals: Omit<EventSignals, "signals.cross_sectional_rank" | "compositeScore">,
  allEventSignals: Array<Omit<EventSignals, "signals.cross_sectional_rank" | "compositeScore">>
): Signal {
  // Calculate composite score for this event (sum of all signal scores)
  const compositeScore = calculateCompositeScore(eventSignals)

  // Calculate composite scores for all events
  const allScores = allEventSignals.map((e) => calculateCompositeScore(e))

  // Sort scores
  const sortedScores = [...allScores].sort((a, b) => a - b)

  // Find percentile rank
  const rank = sortedScores.findIndex((s) => s === compositeScore)
  const percentile = (rank / (sortedScores.length - 1)) * 100

  return {
    name: "Cross_Sectional_Rank",
    value: percentile,
    score: percentile > 75 ? 1 : percentile < 25 ? -1 : 0,
    percentile,
    description: `${percentile.toFixed(0)}th percentile (top ${(100 - percentile).toFixed(0)}%)`,
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate realized volatility from price data
 * Returns annualized volatility (%)
 */
function calculateRealizedVolatility(data: EODData[]): number {
  if (data.length < 2) return 0

  const returns: number[] = []
  for (let i = 1; i < data.length; i++) {
    const ret = Math.log(data[i].closePrice / data[i - 1].closePrice)
    returns.push(ret)
  }

  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)

  // Annualize (252 trading days)
  return stdDev * Math.sqrt(252) * 100
}

/**
 * Calculate composite score from all signals
 */
function calculateCompositeScore(
  eventSignals: Omit<EventSignals, "signals.cross_sectional_rank" | "compositeScore">
): number {
  const signals = eventSignals.signals as any
  let score = 0

  for (const key of Object.keys(signals)) {
    if (key === "cross_sectional_rank") continue
    if (signals[key] && typeof signals[key].score === "number") {
      score += signals[key].score
    }
  }

  return score
}

/**
 * Create neutral signal placeholder
 */
function createNeutralSignal(name: string, description: string): Signal {
  return {
    name,
    value: 0,
    score: 0,
    description,
  }
}

// ============================================================================
// MAIN CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate all signals for a corporate action event
 */
export function calculateAllSignals(
  action: CorporateAction,
  eodData: EODData[]
): Omit<EventSignals, "signals.cross_sectional_rank" | "compositeScore"> {
  const signals = {
    momentum_1m: calculateMomentum1M(eodData, action.exDividendDate),
    momentum_3m: calculateMomentum3M(eodData, action.exDividendDate),
    momentum_6m: calculateMomentum6M(eodData, action.exDividendDate),
    announcement_momentum: calculateAnnouncementMomentum(eodData, action),
    z_score: calculateZScore(eodData, action.exDividendDate),
    reversal_5d: calculateReversal5D(eodData, action.exDividendDate),
    reversal_10d: calculateReversal10D(eodData, action.exDividendDate),
    iv_spike: calculateIVSpike(eodData, action.exDividendDate),
    volume_surprise: calculateVolumeSurprise(eodData, action.exDividendDate),
    turnover_acceleration: calculateTurnoverAcceleration(eodData, action.exDividendDate),
    post_split_momentum: calculatePostSplitMomentum(eodData, action),
    cross_sectional_rank: createNeutralSignal("Cross_Sectional_Rank", "Not yet calculated"),
  }

  return {
    eventId: action.eventId,
    valoren: action.valoren,
    exDividendDate: action.exDividendDate,
    actionType: action.actionType,
    signals,
  } as any
}

/**
 * Calculate signals for multiple events and add cross-sectional ranking
 */
export function calculateSignalsForEvents(
  actions: CorporateAction[],
  eodDataMap: Map<string, EODData[]>
): EventSignals[] {
  // Calculate signals for all events (without cross-sectional rank)
  const intermediateSignals = actions.map((action) => {
    const eodData = eodDataMap.get(`${action.valoren}_${action.exDividendDate}`) || []
    return calculateAllSignals(action, eodData)
  })

  // Now calculate cross-sectional ranks
  const finalSignals: EventSignals[] = intermediateSignals.map((eventSignal) => {
    const crossSectionalRank = calculateCrossSectionalRank(eventSignal, intermediateSignals)
    const compositeScore = calculateCompositeScore(eventSignal)

    return {
      ...eventSignal,
      signals: {
        ...eventSignal.signals,
        cross_sectional_rank: crossSectionalRank,
      },
      compositeScore,
    } as EventSignals
  })

  return finalSignals
}
