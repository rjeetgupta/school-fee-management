/** Returns "YYYY-MM" for the given date (defaults to now). */
export function getMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getNextMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month, 1); // month is 0-indexed; this rolls to next month
  return getMonthKey(date);
}

export function getPreviousMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 2, 1);
  return getMonthKey(date);
}

/** Sort comparator for ascending "YYYY-MM" strings (they sort correctly lexicographically, but kept explicit for clarity). */
export function compareMonthKeys(a: string, b: string): number {
  return a.localeCompare(b);
}
