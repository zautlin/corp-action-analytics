import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with thousand separators
 * @example formatNumber(1234567.89) => "1,234,567.89"
 */
export function formatNumber(value: number | undefined | null, decimals?: number): string {
  if (value === undefined || value === null) return '-'
  
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  }
  
  return value.toLocaleString('en-US', options)
}

/**
 * Format a currency amount with symbol
 * @example formatCurrency(1234.56, 'USD') => "$1,234.56"
 * @example formatCurrency(1234.56, 'CHF') => "CHF 1,234.56"
 */
export function formatCurrency(
  value: number | undefined | null, 
  currency: string = 'USD',
  decimals: number = 2
): string {
  if (value === undefined || value === null) return '-'
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currency} ${formatNumber(value, decimals)}`
  }
}

/**
 * Format a percentage value
 * @example formatPercent(12.3456) => "+12.35%"
 * @example formatPercent(-5.67) => "-5.67%"
 */
export function formatPercent(
  value: number | undefined | null,
  decimals: number = 2,
  showSign: boolean = true
): string {
  if (value === undefined || value === null) return '-'
  
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Format a compact number (K, M, B notation)
 * @example formatCompactNumber(1234567) => "1.23M"
 */
export function formatCompactNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '-'
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(value)
}
