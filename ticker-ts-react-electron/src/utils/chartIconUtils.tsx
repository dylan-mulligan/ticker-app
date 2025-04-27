import { BarChartRounded, ShowChartRounded, AreaChartRounded } from '@mui/icons-material';

export const getChartIcon = (chartType: string, size: number = 24) => {
  switch (chartType) {
    case 'bar':
      return <BarChartRounded sx={{ fontSize: size }} />;
    case 'area':
      return <AreaChartRounded sx={{ fontSize: size }} />;
    case 'line':
    default:
      return <ShowChartRounded sx={{ fontSize: size }} />;
  }
};
