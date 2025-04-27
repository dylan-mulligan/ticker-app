export const SUPPORTED_CRYPTOS = ['bitcoin', 'ethereum', 'dogecoin'];

export const SUPPORTED_CHART_TYPES = ['line', 'bar', 'area'] as const;

export type ChartType = typeof SUPPORTED_CHART_TYPES[number];
