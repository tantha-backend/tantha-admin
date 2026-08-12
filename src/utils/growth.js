/**
 * Formats a period-over-period growth percentage from the API for display
 * on a stat card.
 *
 * Returns null when there is no figure to show, so the card can omit the
 * badge entirely rather than claim a misleading 0%.
 */
const formatGrowth = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  const numeric = Number(value);

  return `${numeric >= 0 ? "+" : ""}${numeric}%`;
};

/**
 * The `change` / `changeType` pair a stat card needs, derived from one figure
 * so the label and its colour can never disagree.
 *
 * Spread it onto the card: `<AnalyticsStatCard {...growthProps(x)} />`.
 */
export const growthProps = (value) => ({
  change: formatGrowth(value),
  changeType: Number(value) < 0 ? "negative" : "positive",
});
