
/**
 * In India, SNF (Solids-Not-Fat) is typically calculated from CLR (Corrected Lactometer Reading) 
 * and FAT using Richmond's formula.
 * Formula: SNF = (CLR / 4) + (Fat * 0.2) + 0.7
 */
export const calculateSNF = (clr: number, fat: number): number => {
  if (!clr || !fat) return 0;
  const snf = (clr / 4) + (fat * 0.2) + 0.7;
  return parseFloat(snf.toFixed(2));
};

/**
 * Pricing is usually based on "Fat + SNF" system.
 * Rate = (Fat * FatPricePerKg / 100) + (SNF * SNFPricePerKg / 100)
 */
export const calculateMilkRate = (
  fat: number, 
  snf: number, 
  fatPricePerKg: number = 620, // Example: ₹620 per kg of Fat
  snfPricePerKg: number = 310  // Example: ₹310 per kg of SNF
): number => {
  const fatPart = (fat * fatPricePerKg) / 100;
  const snfPart = (snf * snfPricePerKg) / 100;
  return parseFloat((fatPart + snfPart).toFixed(2));
};

export const calculateTotalAmount = (quantity: number, rate: number): number => {
  return parseFloat((quantity * rate).toFixed(2));
};
