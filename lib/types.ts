// Shared type definitions for the application

export interface CorporateAction {
  eventId: string
  valoren: string
  instrumentName: string
  isin: string
  ticker?: string
  actionType: string
  actionTypeLabel: string
  exDividendDate: string
  recordDate?: string
  paymentDate?: string
  announcementDate?: string
  amount: number
  currency: string
  ratio?: string
  status: string
  description?: string
  [key: string]: any
}

export interface EODData {
  date: string
  valoren: string
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
  adjustedClose?: number
  [key: string]: any
}

export interface Instrument {
  valoren: string
  ticker?: string
  instrument_name?: string
  instrument_symbol?: string
  isin?: string
  sector?: string
  currency?: string
  bourse_code?: string
  operating_mic?: string
  segment_mic?: string
  exchange?: string
  market_cap?: number
  corp_actions_count?: number
  last_action_date?: string
  [key: string]: any
}
