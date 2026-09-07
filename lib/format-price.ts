/**
 * The ONE place money is converted from cents to a display string.
 * Use this everywhere a price is shown — never format money inline.
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}