// Format money: 1250 → "KSh 1,250" or "$1,250"
export function formatCurrency(amount, currency = 'KES') {
  if (amount === null || amount === undefined) return '—';
  const symbols = { KES: 'KSh', USD: '$', EUR: '€', GBP: '£', NGN: '₦' };
  const symbol = symbols[currency] || currency;
  const num = Number(amount);
  if (isNaN(num)) return '—';
  return `${symbol} ${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// Compact: 12500 → "12.5K", 1200000 → "1.2M"
export function formatCompactCurrency(amount, currency = 'KES') {
  if (amount === null || amount === undefined) return '—';
  const symbols = { KES: 'KSh', USD: '$', EUR: '€', GBP: '£', NGN: '₦' };
  const symbol = symbols[currency] || currency;
  const num = Number(amount);
  if (isNaN(num)) return '—';
  if (Math.abs(num) >= 1_000_000) return `${symbol} ${(num / 1_000_000).toFixed(1)}M`;
  if (Math.abs(num) >= 1_000) return `${symbol} ${(num / 1_000).toFixed(1)}K`;
  return `${symbol} ${num}`;
}