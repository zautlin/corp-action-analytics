/**
 * Data Adjustment System for Corporate Actions
 * 
 * Handles price and volume adjustments for:
 * - Cash Dividends (Type 230)
 * - Stock Distributions (Type 237)
 * - Bonus Issues (Type 238)
 * - Stock Splits (Type 440)
 * - Rights Issues (Type 451)
 * - Mergers (Type 461)
 * 
 * Maintains two parallel datasets:
 * - eod_raw: Original, unadjusted prices
 * - eod_adjusted: Fully adjusted prices with cumulative factor chain
 */

import type { CorporateAction, EODData } from "./mock-corp-actions-data"

// Adjustment factor for a single event
export interface AdjustmentFactor {
  eventId: string
  valoren: string
  date: string
  actionType: number
  factor: number // Multiplicative adjustment factor
  description: string
}

// Cumulative adjustment chain
export interface AdjustmentChain {
  valoren: string
  factors: AdjustmentFactor[]
  cumulativeFactor: number // Product of all factors
}

// Adjusted EOD data
export interface AdjustedEODData extends EODData {
  adjustmentFactor: number
  isAdjusted: boolean
  appliedEvents: string[] // List of eventIds that affected this record
}

// ============================================================================
// ADJUSTMENT FACTOR CALCULATIONS
// ============================================================================

/**
 * Calculate dividend adjustment factor
 * 
 * Formula: factor = (Close_before - Dividend) / Close_before
 * 
 * This factor is applied to all historical prices BEFORE the ex-date
 * to make them comparable with post-dividend prices.
 * 
 * Example: Stock at $100, $5 dividend
 * - Ex-date price: $95 (automatic market adjustment)
 * - Factor: (100 - 5) / 100 = 0.95
 * - Historical $100 → $100 * 0.95 = $95 (adjusted)
 */
export function calculateDividendFactor(
  action: CorporateAction,
  closePriceBefore: number
): AdjustmentFactor {
  const factor = (closePriceBefore - action.amount) / closePriceBefore

  return {
    eventId: action.eventId,
    valoren: action.valoren,
    date: action.exDividendDate,
    actionType: action.actionType,
    factor,
    description: `Dividend ${action.amount} ${action.currency}: ${(
      (1 - factor) *
      100
    ).toFixed(2)}% adjustment`,
  }
}

/**
 * Calculate stock split adjustment factor
 * 
 * Formula: factor = oldAmount / newInstrumentQuantity
 * 
 * Example: 2-for-1 split
 * - Before: 1 share at $100
 * - After: 2 shares at $50
 * - Factor: 1 / 2 = 0.5
 * - Historical $100 → $100 * 0.5 = $50 (adjusted)
 * 
 * Note: Volume is adjusted inversely (multiplied by 1/factor)
 */
export function calculateSplitFactor(
  action: CorporateAction,
  oldAmount: number,
  newInstrumentQuantity: number
): AdjustmentFactor {
  const factor = oldAmount / newInstrumentQuantity

  return {
    eventId: action.eventId,
    valoren: action.valoren,
    date: action.exDividendDate,
    actionType: action.actionType,
    factor,
    description: `Split ${oldAmount}:${newInstrumentQuantity} (${(factor * 100).toFixed(
      1
    )}% factor)`,
  }
}

/**
 * Calculate stock distribution factor
 * Similar to dividend but paid in shares
 */
export function calculateStockDistributionFactor(
  action: CorporateAction,
  distributionRatio: number
): AdjustmentFactor {
  // Distribution ratio: e.g., 0.1 means 1 new share for every 10 held
  const factor = 1 / (1 + distributionRatio)

  return {
    eventId: action.eventId,
    valoren: action.valoren,
    date: action.exDividendDate,
    actionType: action.actionType,
    factor,
    description: `Stock distribution ${(distributionRatio * 100).toFixed(
      1
    )}%: ${((1 - factor) * 100).toFixed(2)}% adjustment`,
  }
}

/**
 * Calculate bonus issue factor
 * Similar to stock split
 */
export function calculateBonusIssueFactor(
  action: CorporateAction,
  bonusRatio: number
): AdjustmentFactor {
  // Bonus ratio: e.g., 1:5 means 1 bonus share for every 5 held
  const factor = 1 / (1 + bonusRatio)

  return {
    eventId: action.eventId,
    valoren: action.valoren,
    date: action.exDividendDate,
    actionType: action.actionType,
    factor,
    description: `Bonus issue ${bonusRatio}:1: ${((1 - factor) * 100).toFixed(
      2
    )}% adjustment`,
  }
}

/**
 * Calculate rights issue factor
 * Considers both subscription price and rights ratio
 */
export function calculateRightsIssueFactor(
  action: CorporateAction,
  currentPrice: number,
  subscriptionPrice: number,
  rightsRatio: number
): AdjustmentFactor {
  // TERP (Theoretical Ex-Rights Price) formula
  const terp =
    (currentPrice + rightsRatio * subscriptionPrice) / (1 + rightsRatio)
  const factor = terp / currentPrice

  return {
    eventId: action.eventId,
    valoren: action.valoren,
    date: action.exDividendDate,
    actionType: action.actionType,
    factor,
    description: `Rights issue ${rightsRatio}:1 at ${subscriptionPrice}: ${(
      (1 - factor) *
      100
    ).toFixed(2)}% adjustment`,
  }
}

/**
 * Calculate merger/acquisition factor
 */
export function calculateMergerFactor(
  action: CorporateAction,
  exchangeRatio: number
): AdjustmentFactor {
  const factor = exchangeRatio

  return {
    eventId: action.eventId,
    valoren: action.valoren,
    date: action.exDividendDate,
    actionType: action.actionType,
    factor,
    description: `Merger exchange ratio ${exchangeRatio}:1`,
  }
}

// ============================================================================
// CUMULATIVE FACTOR CHAIN
// ============================================================================

/**
 * Build cumulative adjustment factor chain for an instrument
 * 
 * The chain multiplies all factors chronologically to create
 * a continuous adjustment series.
 */
export function buildAdjustmentChain(
  valoren: string,
  actions: CorporateAction[],
  eodData: EODData[]
): AdjustmentChain {
  // Filter actions for this instrument and sort by date
  const relevantActions = actions
    .filter((a) => a.valoren === valoren)
    .sort((a, b) => a.exDividendDate.localeCompare(b.exDividendDate))

  const factors: AdjustmentFactor[] = []

  // Calculate factor for each action
  for (const action of relevantActions) {
    const exDateData = eodData.find((d) => d.date === action.exDividendDate)
    const preDayData = eodData[eodData.findIndex((d) => d.date === action.exDividendDate) - 1]

    if (!exDateData || !preDayData) continue

    let factor: AdjustmentFactor

    switch (action.actionType) {
      case 230: // Cash Dividend
        factor = calculateDividendFactor(action, preDayData.closePrice)
        break

      case 237: // Stock Distribution (assume 10% distribution)
        factor = calculateStockDistributionFactor(action, 0.1)
        break

      case 238: // Bonus Issue (assume 1:5 ratio)
        factor = calculateBonusIssueFactor(action, 0.2)
        break

      case 440: // Stock Split (assume 2:1)
        factor = calculateSplitFactor(action, 1, 2)
        break

      case 451: // Rights Issue (assume 1:10 ratio at 90% of current price)
        factor = calculateRightsIssueFactor(
          action,
          preDayData.closePrice,
          preDayData.closePrice * 0.9,
          0.1
        )
        break

      case 461: // Merger (assume 1:1 exchange)
        factor = calculateMergerFactor(action, 1.0)
        break

      default:
        continue
    }

    factors.push(factor)
  }

  // Calculate cumulative factor (product of all factors)
  const cumulativeFactor = factors.reduce((product, f) => product * f.factor, 1.0)

  return {
    valoren,
    factors,
    cumulativeFactor,
  }
}

// ============================================================================
// APPLY ADJUSTMENTS
// ============================================================================

/**
 * Apply adjustment factors to EOD data
 * 
 * Important: Adjustments are applied to historical data BEFORE the event.
 * Data on and after the event date remains unadjusted.
 */
export function applyAdjustments(
  eodData: EODData[],
  adjustmentChain: AdjustmentChain
): AdjustedEODData[] {
  // Sort EOD data by date
  const sortedData = [...eodData].sort((a, b) => a.date.localeCompare(b.date))

  // Build adjustment factor for each date
  const adjustedData: AdjustedEODData[] = []

  for (let i = 0; i < sortedData.length; i++) {
    const data = sortedData[i]
    
    // Find all adjustments that occur AFTER this date
    const futureFactors = adjustmentChain.factors.filter((f) => f.date > data.date)

    // Calculate cumulative factor for this date
    const cumulativeFactor = futureFactors.reduce(
      (product, f) => product * f.factor,
      1.0
    )

    // Determine if adjusted
    const isAdjusted = cumulativeFactor !== 1.0
    const appliedEvents = futureFactors.map((f) => f.eventId)

    // Apply adjustments to prices
    // Volume is adjusted inversely for splits/bonus issues
    const splitFactors = futureFactors.filter((f) => 
      f.actionType === 440 || f.actionType === 238
    )
    const volumeFactor = splitFactors.reduce(
      (product, f) => product * (1 / f.factor),
      1.0
    )

    adjustedData.push({
      ...data,
      openPrice: data.openPrice * cumulativeFactor,
      highPrice: data.highPrice * cumulativeFactor,
      lowPrice: data.lowPrice * cumulativeFactor,
      closePrice: data.closePrice * cumulativeFactor,
      volume: Math.round(data.volume * volumeFactor),
      turnover: data.turnover * cumulativeFactor, // Turnover adjusted by price only
      adjustmentFactor: cumulativeFactor,
      isAdjusted,
      appliedEvents,
    })
  }

  return adjustedData
}

/**
 * Adjust multiple instruments
 */
export function adjustMultipleInstruments(
  actions: CorporateAction[],
  eodDataMap: Map<string, EODData[]>
): Map<string, AdjustedEODData[]> {
  const adjustedMap = new Map<string, AdjustedEODData[]>()

  // Get unique valorens
  const valorens = [...new Set(actions.map((a) => a.valoren))]

  for (const valoren of valorens) {
    // Get all EOD data for this instrument (across all dates)
    const allEODData: EODData[] = []
    
    for (const [key, data] of eodDataMap.entries()) {
      if (key.startsWith(valoren + "_")) {
        allEODData.push(...data)
      }
    }

    // Remove duplicates and sort
    const uniqueEODData = Array.from(
      new Map(allEODData.map((d) => [d.date, d])).values()
    ).sort((a, b) => a.date.localeCompare(b.date))

    // Build adjustment chain
    const chain = buildAdjustmentChain(valoren, actions, uniqueEODData)

    // Apply adjustments
    const adjustedData = applyAdjustments(uniqueEODData, chain)

    adjustedMap.set(valoren, adjustedData)
  }

  return adjustedMap
}

// ============================================================================
// COMPARISON UTILITIES
// ============================================================================

/**
 * Compare raw vs adjusted prices for a date
 */
export function compareRawVsAdjusted(
  date: string,
  rawData: EODData,
  adjustedData: AdjustedEODData
): {
  date: string
  rawClose: number
  adjustedClose: number
  difference: number
  percentDiff: number
  adjustmentFactor: number
  appliedEvents: string[]
} {
  return {
    date,
    rawClose: rawData.closePrice,
    adjustedClose: adjustedData.closePrice,
    difference: adjustedData.closePrice - rawData.closePrice,
    percentDiff: ((adjustedData.closePrice - rawData.closePrice) / rawData.closePrice) * 100,
    adjustmentFactor: adjustedData.adjustmentFactor,
    appliedEvents: adjustedData.appliedEvents,
  }
}

/**
 * Get adjustment factor for a specific date
 */
export function getAdjustmentFactorForDate(
  date: string,
  adjustedData: AdjustedEODData[]
): number {
  const record = adjustedData.find((d) => d.date === date)
  return record?.adjustmentFactor || 1.0
}

/**
 * Get all adjustment events affecting a date range
 */
export function getAdjustmentEventsForRange(
  startDate: string,
  endDate: string,
  adjustmentChain: AdjustmentChain
): AdjustmentFactor[] {
  return adjustmentChain.factors.filter(
    (f) => f.date >= startDate && f.date <= endDate
  )
}
