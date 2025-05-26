/**
 * Truncate a blockchain address for display
 * @param address - The full blockchain address
 * @param prefixLength - Number of characters to show at the beginning
 * @param suffixLength - Number of characters to show at the end
 * @returns Truncated address string
 */
export function truncateAddress(
  address: string, 
  prefixLength: number = 6, 
  suffixLength: number = 4
): string {
  if (!address || address.length <= prefixLength + suffixLength) {
    return address;
  }
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Format a number as currency with appropriate suffix
 * @param value - The numeric value
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = '$'): string {
  if (value >= 1e12) {
    return `${currency}${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${currency}${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${currency}${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${currency}${(value / 1e3).toFixed(2)}K`;
  }
  return `${currency}${value.toFixed(2)}`;
}

/**
 * Format percentage change with appropriate color class
 * @param change - Percentage change value
 * @returns Object with formatted string and color class
 */
export function formatPercentageChange(change: number): {
  formatted: string;
  colorClass: string;
} {
  const formatted = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  const colorClass = change >= 0 ? 'text-green-400' : 'text-red-400';
  
  return { formatted, colorClass };
}

/**
 * Validates an Aptos address format
 */
export const isValidAptosAddress = (address: string): boolean => {
  // Basic validation - Aptos addresses are 64 hex chars with 0x prefix
  if (!address) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};
