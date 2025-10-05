import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const API_BASE_URL = 'http://localhost:3001'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Price utilities - unified price handling
// Prices are stored as integers in the database (e.g., 16.50 becomes 1650)
// When displaying, we divide by 100 to get the decimal value
// When sending to server, we multiply by 100 to get the integer value

/**
 * Format a price for display (converts from integer to decimal)
 * @param price - Price as integer from database (e.g., 1650)
 * @returns Formatted price string (e.g., "€16.50")
 */
export const formatPrice = (price: number | undefined | null): string => {
  if (!price && price !== 0) return '€0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(price / 100)
}

/**
 * Convert a decimal price to integer for database storage
 * @param price - Price as decimal (e.g., 16.50)
 * @returns Price as integer (e.g., 1650)
 */
export const priceToInt = (price: number): number => {
  return Math.round(price * 100)
}

/**
 * Convert an integer price from database to decimal
 * @param price - Price as integer from database (e.g., 1650)
 * @returns Price as decimal (e.g., 16.50)
 */
export const priceToDecimal = (price: number): number => {
  return price / 100
}
