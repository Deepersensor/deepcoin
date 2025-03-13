/**
 * Truncates an Aptos address for display
 */
export const truncateAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  const start = address.slice(0, startChars);
  const end = address.slice(-endChars);
  
  return `${start}...${end}`;
};

/**
 * Validates an Aptos address format
 */
export const isValidAptosAddress = (address: string): boolean => {
  // Basic validation - Aptos addresses are 64 hex chars with 0x prefix
  if (!address) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};
