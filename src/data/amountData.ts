export interface AmountSummary {
  currentNgn: number;
  pendingNgn: number;
}

export const DEFAULT_AMOUNT_SUMMARY: AmountSummary = {
  currentNgn: 284920.0,
  pendingNgn: 31420.0,
};

export function formatNairaNumber(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactNairaNumber(amount: number): string {
  const abs = Math.abs(amount);
  if (abs < 10_000) {
    return formatNairaNumber(amount);
  }

  const sign = amount < 0 ? '-' : '';
  const formatUnit = (value: number, suffix: string) => {
    const rounded = Math.round(value * 100) / 100;
    const formatted = rounded.toFixed(2).replace(/\.?0+$/, '');
    return `${sign}${formatted}${suffix}`;
  };

  if (abs >= 1_000_000_000) {
    return formatUnit(abs / 1_000_000_000, 'B');
  }
  if (abs >= 1_000_000) {
    const m = Math.round((abs / 1_000_000) * 100) / 100;
    return m >= 1000 ? formatUnit(m / 1000, 'B') : formatUnit(abs / 1_000_000, 'M');
  }
  const k = Math.round((abs / 1_000) * 100) / 100;
  return k >= 1000 ? formatUnit(k / 1000, 'M') : formatUnit(abs / 1_000, 'K');
}

export function formatNaira(amount: number): string {
  return `₦${formatNairaNumber(amount)}`;
}
