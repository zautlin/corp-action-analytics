/**
 * Mock Data for Development/Demo
 * Used when ClickHouse is not available
 */

import type { CorporateAction, EODData, Instrument } from './types'
import { EXTENDED_INSTRUMENTS, EXTENDED_CORP_ACTIONS } from './mock-data-extended'

// Helper function to generate dates
const daysAgo = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

const daysFromNow = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// Mock Instruments
const BASE_MOCK_INSTRUMENTS: Instrument[] = [
  {
    valoren: '1234567',
    ticker: 'AAPL',
    instrument_name: 'Apple Inc.',
    instrument_symbol: 'AAPL',
    isin: 'US0378331005',
    sector: 'Technology',
    currency: 'USD',
    bourse_code: '7078',
    operating_mic: 'AQXE',
    segment_mic: 'XSWX',
    exchange: 'Aquis Exchange',
    market_cap: 2800000000000,
    corp_actions_count: 12,
    last_action_date: daysAgo(30),
  },
  {
    valoren: '2345678',
    ticker: 'MSFT',
    instrument_name: 'Microsoft Corporation',
    instrument_symbol: 'MSFT',
    isin: 'US5949181045',
    sector: 'Technology',
    currency: 'USD',
    bourse_code: '7078',
    operating_mic: 'AQXE',
    segment_mic: 'XSWX',
    exchange: 'Aquis Exchange',
    market_cap: 2500000000000,
    corp_actions_count: 8,
    last_action_date: daysAgo(45),
  },
  {
    valoren: '3456789',
    ticker: 'GOOGL',
    instrument_name: 'Alphabet Inc.',
    instrument_symbol: 'GOOGL',
    isin: 'US02079K3059',
    sector: 'Technology',
    currency: 'USD',
    bourse_code: '1341',
    operating_mic: 'AQXE',
    segment_mic: 'XSWX',
    exchange: 'Aquis Exchange',
    market_cap: 1700000000000,
    corp_actions_count: 6,
    last_action_date: daysAgo(60),
  },
  {
    valoren: '4567890',
    ticker: 'AMZN',
    instrument_name: 'Amazon.com Inc.',
    instrument_symbol: 'AMZN',
    isin: 'US0231351067',
    sector: 'Consumer Cyclical',
    currency: 'USD',
    bourse_code: '1560',
    operating_mic: 'AQXE',
    segment_mic: 'XSWX',
    exchange: 'Aquis Exchange',
    market_cap: 1600000000000,
    corp_actions_count: 15,
    last_action_date: daysAgo(15),
  },
  {
    valoren: '5678901',
    ticker: 'TSLA',
    instrument_name: 'Tesla Inc.',
    instrument_symbol: 'TSLA',
    isin: 'US88160R1014',
    sector: 'Automotive',
    currency: 'USD',
    bourse_code: '5051',
    operating_mic: 'AQEU',
    segment_mic: 'AQEU',
    exchange: 'Aquis Europe',
    market_cap: 800000000000,
    corp_actions_count: 10,
    last_action_date: daysAgo(90),
  },
  {
    valoren: '6789012',
    ticker: 'NVDA',
    instrument_name: 'NVIDIA Corporation',
    instrument_symbol: 'NVDA',
    isin: 'US67066G1040',
    sector: 'Technology',
    currency: 'USD',
    bourse_code: '7078',
    operating_mic: 'AQXE',
    segment_mic: 'XSWX',
    exchange: 'Aquis Exchange',
    market_cap: 1200000000000,
    corp_actions_count: 4,
    last_action_date: daysAgo(120),
  },
  {
    valoren: '7890123',
    ticker: 'JPM',
    instrument_name: 'JPMorgan Chase & Co.',
    instrument_symbol: 'JPM',
    isin: 'US46625H1005',
    sector: 'Financial Services',
    currency: 'USD',
    bourse_code: '1341',
    operating_mic: 'AQXE',
    segment_mic: 'XSWX',
    exchange: 'Aquis Exchange',
    market_cap: 450000000000,
    corp_actions_count: 20,
    last_action_date: daysAgo(10),
  },
  {
    valoren: '8901234',
    ticker: 'NESN',
    instrument_name: 'Nestle S.A.',
    instrument_symbol: 'NESN',
    isin: 'CH0038863350',
    sector: 'Consumer Defensive',
    currency: 'CHF',
    bourse_code: '1560',
    operating_mic: 'XSWX',
    segment_mic: 'XSWX',
    exchange: 'SIX Swiss Exchange',
    market_cap: 280000000000,
    corp_actions_count: 18,
    last_action_date: daysAgo(25),
  },
]

// Combine all instruments
export const MOCK_INSTRUMENTS: Instrument[] = [...BASE_MOCK_INSTRUMENTS, ...EXTENDED_INSTRUMENTS]

// Base Mock Corporate Actions
const BASE_MOCK_CORP_ACTIONS: CorporateAction[] = [
  {
    eventId: 'EVT001',
    valoren: '1234567',
    instrumentName: 'Apple Inc.',
    isin: 'US0378331005',
    ticker: 'AAPL',
    actionType: 230,
    actionTypeLabel: 'Cash Dividend',
    exDividendDate: daysAgo(30),
    recordDate: daysAgo(32),
    paymentDate: daysAgo(15),
    announcementDate: daysAgo(45),
    amount: 0.24,
    currency: 'USD',
    status: 'confirmed',
    description: 'Quarterly dividend payment',
  },
  {
    eventId: 'EVT002',
    valoren: '1234567',
    instrumentName: 'Apple Inc.',
    isin: 'US0378331005',
    ticker: 'AAPL',
    actionType: 230,
    actionTypeLabel: 'Cash Dividend',
    exDividendDate: daysAgo(120),
    recordDate: daysAgo(122),
    paymentDate: daysAgo(105),
    announcementDate: daysAgo(135),
    amount: 0.23,
    currency: 'USD',
    status: 'confirmed',
    description: 'Quarterly dividend payment',
  },
  {
    eventId: 'EVT003',
    valoren: '2345678',
    instrumentName: 'Microsoft Corporation',
    isin: 'US5949181045',
    ticker: 'MSFT',
    actionType: 230,
    actionTypeLabel: 'Cash Dividend',
    exDividendDate: daysAgo(45),
    recordDate: daysAgo(47),
    paymentDate: daysAgo(30),
    announcementDate: daysAgo(60),
    amount: 0.68,
    currency: 'USD',
    status: 'confirmed',
    description: 'Quarterly dividend payment',
  },
  {
    eventId: 'EVT004',
    valoren: '4567890',
    instrumentName: 'Amazon.com Inc.',
    isin: 'US0231351067',
    ticker: 'AMZN',
    actionType: 440,
    actionTypeLabel: 'Stock Split',
    exDividendDate: daysAgo(90),
    announcementDate: daysAgo(105),
    amount: 0,
    currency: 'USD',
    ratio: '20:1',
    status: 'confirmed',
    description: '20-for-1 stock split',
  },
  {
    eventId: 'EVT005',
    valoren: '5678901',
    instrumentName: 'Tesla Inc.',
    isin: 'US88160R1014',
    ticker: 'TSLA',
    actionType: 440,
    actionTypeLabel: 'Stock Split',
    exDividendDate: daysAgo(180),
    announcementDate: daysAgo(195),
    amount: 0,
    currency: 'USD',
    ratio: '3:1',
    status: 'confirmed',
    description: '3-for-1 stock split',
  },
  {
    eventId: 'EVT006',
    valoren: '7890123',
    instrumentName: 'JPMorgan Chase & Co.',
    isin: 'US46625H1005',
    ticker: 'JPM',
    actionType: 230,
    actionTypeLabel: 'Cash Dividend',
    exDividendDate: daysAgo(10),
    recordDate: daysAgo(12),
    paymentDate: daysFromNow(5),
    announcementDate: daysAgo(25),
    amount: 1.05,
    currency: 'USD',
    status: 'confirmed',
    description: 'Quarterly dividend payment',
  },
  {
    eventId: 'EVT007',
    valoren: '8901234',
    instrumentName: 'Nestle S.A.',
    isin: 'CH0038863350',
    ticker: 'NESN',
    actionType: 230,
    actionTypeLabel: 'Cash Dividend',
    exDividendDate: daysAgo(25),
    recordDate: daysAgo(27),
    paymentDate: daysAgo(10),
    announcementDate: daysAgo(40),
    amount: 2.80,
    currency: 'CHF',
    status: 'confirmed',
    description: 'Annual dividend payment',
  },
  {
    eventId: 'EVT008',
    valoren: '6789012',
    instrumentName: 'NVIDIA Corporation',
    isin: 'US67066G1040',
    ticker: 'NVDA',
    actionType: 440,
    actionTypeLabel: 'Stock Split',
    exDividendDate: daysAgo(120),
    announcementDate: daysAgo(135),
    amount: 0,
    currency: 'USD',
    ratio: '4:1',
    status: 'confirmed',
    description: '4-for-1 stock split',
  },
  {
    eventId: 'EVT009',
    valoren: '3456789',
    instrumentName: 'Alphabet Inc.',
    isin: 'US02079K3059',
    ticker: 'GOOGL',
    actionType: 440,
    actionTypeLabel: 'Stock Split',
    exDividendDate: daysAgo(60),
    announcementDate: daysAgo(75),
    amount: 0,
    currency: 'USD',
    ratio: '20:1',
    status: 'confirmed',
    description: '20-for-1 stock split',
  },
  {
    eventId: 'EVT010',
    valoren: '2345678',
    instrumentName: 'Microsoft Corporation',
    isin: 'US5949181045',
    ticker: 'MSFT',
    actionType: 238,
    actionTypeLabel: 'Bonus Issue',
    exDividendDate: daysAgo(200),
    announcementDate: daysAgo(215),
    amount: 0,
    currency: 'USD',
    ratio: '1:10',
    status: 'confirmed',
    description: 'Bonus share issuance',
  },
]

// Combine all corporate actions
export const MOCK_CORP_ACTIONS: CorporateAction[] = [...BASE_MOCK_CORP_ACTIONS, ...EXTENDED_CORP_ACTIONS]

// Generate mock EOD data for a given valoren
export function generateMockEODData(
  valoren: string,
  days: number = 180,
  basePrice: number = 150
): EODData[] {
  const data: EODData[] = []
  let currentPrice = basePrice

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add some randomness to price movements
    const change = (Math.random() - 0.5) * 5
    currentPrice = Math.max(currentPrice + change, basePrice * 0.7)

    const open = currentPrice + (Math.random() - 0.5) * 2
    const close = currentPrice + (Math.random() - 0.5) * 2
    const high = Math.max(open, close) + Math.random() * 3
    const low = Math.min(open, close) - Math.random() * 3
    const volume = Math.floor(Math.random() * 50000000) + 10000000
    const turnover = volume * close / 1000 // Calculate turnover based on volume and price

    data.push({
      date: date.toISOString().split('T')[0],
      valoren,
      openPrice: parseFloat(open.toFixed(2)),
      highPrice: parseFloat(high.toFixed(2)),
      lowPrice: parseFloat(low.toFixed(2)),
      closePrice: parseFloat(close.toFixed(2)),
      volume,
      adjustedClose: parseFloat(close.toFixed(2)),
      turnover: parseFloat(turnover.toFixed(2)),
    })
  }

  return data
}

// Get EOD data for date range
export function getMockEODData(
  valoren: string,
  dateFrom: string,
  dateTo: string
): EODData[] {
  const allData = generateMockEODData(valoren, 365)
  return allData.filter((d) => d.date >= dateFrom && d.date <= dateTo)
}

// Get EOD data around an event
export function getMockEODAroundEvent(
  valoren: string,
  eventDate: string,
  daysAround: number = 30
): EODData[] {
  const allData = generateMockEODData(valoren, 365)
  const eventTimestamp = new Date(eventDate).getTime()

  return allData.filter((d) => {
    const dataTimestamp = new Date(d.date).getTime()
    const daysDiff = Math.abs((dataTimestamp - eventTimestamp) / (1000 * 60 * 60 * 24))
    return daysDiff <= daysAround
  })
}

// Get paginated instruments
export function getMockInstruments(
  page: number = 1,
  pageSize: number = 50,
  search: string = ''
) {
  let filtered = MOCK_INSTRUMENTS

  if (search) {
    const searchLower = search.toLowerCase()
    filtered = MOCK_INSTRUMENTS.filter(
      (inst) =>
        inst.valoren.toLowerCase().includes(searchLower) ||
        inst.ticker?.toLowerCase().includes(searchLower) ||
        inst.instrument_name?.toLowerCase().includes(searchLower) ||
        inst.isin?.toLowerCase().includes(searchLower)
    )
  }

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filtered.slice(start, end)

  return {
    data,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
}

// Get specific instrument by valoren
export function getMockInstrument(valoren: string): Instrument | null {
  return MOCK_INSTRUMENTS.find((inst) => inst.valoren === valoren) || null
}

// Get corporate actions with filters
export function getMockCorporateActions(filters?: {
  valoren?: string
  actionType?: number
  dateFrom?: string
  dateTo?: string
  status?: string
}): CorporateAction[] {
  let filtered = [...MOCK_CORP_ACTIONS]

  if (filters?.valoren) {
    filtered = filtered.filter((action) => action.valoren === filters.valoren)
  }

  if (filters?.actionType) {
    filtered = filtered.filter((action) => action.actionType === filters.actionType)
  }

  if (filters?.dateFrom) {
    filtered = filtered.filter((action) => action.exDividendDate >= filters.dateFrom!)
  }

  if (filters?.dateTo) {
    filtered = filtered.filter((action) => action.exDividendDate <= filters.dateTo!)
  }

  if (filters?.status) {
    filtered = filtered.filter((action) => action.status === filters.status)
  }

  return filtered
}
