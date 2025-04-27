export const SUPPORTED_CRYPTOS = ['bitcoin', 'ethereum', 'dogecoin'];

export const SUPPORTED_CHART_TYPES = ['line', 'bar', 'area'] as const;

export type ChartType = typeof SUPPORTED_CHART_TYPES[number];

export const SUPPORTED_CHART_DISPLAY_TYPES = ['default', 'mini-electron', 'mini-browser'] as const;

export type ChartDisplayType = typeof SUPPORTED_CHART_DISPLAY_TYPES[number];
