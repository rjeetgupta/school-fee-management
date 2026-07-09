/**
 * Generates receipt numbers in the format: RCP-YYYY-00001
 * `sequence` should come from a persisted counter (e.g. a Counter collection)
 * to guarantee uniqueness across restarts.
 */
export function generateReceiptNumber(sequence: number, year = new Date().getFullYear()): string {
  const padded = String(sequence).padStart(5, "0");
  return `RCP-${year}-${padded}`;
}
