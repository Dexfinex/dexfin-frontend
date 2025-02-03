import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CHART_COLORS, CHART_STYLES } from './config';
import { PriceDisplay } from './PriceDisplay';
import type { ChartDataPoint } from './types';

interface LineChartComponentProps {
  data: ChartDataPoint[];
  token: {
    symbol: string;
    name: string;
    logoURI: string;
  };
}

export function LineChartComponent({ data, token }: LineChartComponentProps) {
  const lastPrice = data[data.length - 1]?.value ?? 0;
  const firstPrice = data[0]?.value ?? lastPrice;
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;

  const formattedData = data.map(point => ({
    date: point.date.toLocaleDateString(),
    value: point.value.toFixed(2),
    formattedValue: `$${point.value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }));

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              opacity={0.05}
            />
            <XAxis
              dataKey="date"
              stroke={CHART_COLORS.text}
              tick={{ fill: CHART_COLORS.text }}
              tickLine={{ stroke: CHART_COLORS.grid }}
              dy={5}
              fontSize={12}
            />
            <YAxis
              stroke={CHART_COLORS.text}
              tick={{ fill: CHART_COLORS.text }}
              tickLine={{ stroke: CHART_COLORS.grid }}
              tickFormatter={(value) => `$${value}`}
              dx={-5}
              fontSize={12}
            />
            <Tooltip
              {...CHART_STYLES.tooltip}
              formatter={(value) => [`$${value}`, 'Price']}
              cursor={{ stroke: CHART_COLORS.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: CHART_COLORS.background, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
              name="Price"
              animationDuration={750}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
}