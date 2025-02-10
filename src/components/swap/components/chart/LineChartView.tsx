import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import {ChartDataPoint, TokenType} from "../../../../types/swap.type.ts";
import {CHART_COLORS} from "../../../../config/chart.ts";

interface LineChartViewProps {
  data: ChartDataPoint[];
  token: TokenType;
}

export function LineChartView({ data, token }: LineChartViewProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Prepare data
    const timestamps = data.map(item => new Date(item.time).getTime());
    const prices = data.map(item => item.close);

    // Configure chart options
    const option = {
      grid: {
        left: '60px',
        right: '40px',
        top: '40px',
        bottom: '60px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: [12, 16],
        textStyle: {
          color: CHART_COLORS.text,
          fontSize: 13,
          fontFamily: 'Exo, system-ui, sans-serif'
        },
        formatter: (params: any) => {
          const date = new Date(params[0].value[0]);
          const price = params[0].value[1];
          return `
            <div style="font-family: Exo, system-ui, sans-serif;">
              <div style="color: #9ca3af; margin-bottom: 4px;">
                ${date.toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div style="font-weight: 500;">
                ${token.symbol}: $${price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })}
              </div>
            </div>
          `;
        }
      },
      xAxis: {
        type: 'time',
        axisLine: {
          lineStyle: {
            color: CHART_COLORS.grid,
            opacity: 0.2
          }
        },
        axisTick: {
          lineStyle: {
            color: CHART_COLORS.grid,
            opacity: 0.2
          }
        },
        axisLabel: {
          color: CHART_COLORS.text,
          fontSize: 12,
          formatter: (value: number) => {
            const date = new Date(value);
            return date.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: CHART_COLORS.grid,
            opacity: 0.1
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: CHART_COLORS.grid,
            opacity: 0.2
          }
        },
        axisTick: {
          lineStyle: {
            color: CHART_COLORS.grid,
            opacity: 0.2
          }
        },
        axisLabel: {
          color: CHART_COLORS.text,
          fontSize: 12,
          formatter: (value: number) => `$${value.toLocaleString()}`
        },
        splitLine: {
          lineStyle: {
            color: CHART_COLORS.grid,
            opacity: 0.1
          }
        }
      },
      series: [
        {
          name: token.symbol,
          type: 'line',
          smooth: 0.3,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 8,
          sampling: 'lttb',
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: CHART_COLORS.primary,
              borderColor: CHART_COLORS.background,
              borderWidth: 2,
              shadowColor: CHART_COLORS.primary,
              shadowBlur: 10
            }
          },
          itemStyle: {
            color: CHART_COLORS.primary,
            borderColor: CHART_COLORS.background,
            borderWidth: 2
          },
          lineStyle: {
            color: CHART_COLORS.primary,
            width: 2,
            shadowColor: CHART_COLORS.primary,
            shadowBlur: 5,
            shadowOffsetY: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: `${CHART_COLORS.primary}30`
              },
              {
                offset: 1,
                color: `${CHART_COLORS.primary}00`
              }
            ])
          },
          data: timestamps.map((time, index) => [time, prices[index]])
        }
      ],
      animation: true,
      animationDuration: 750,
      animationEasing: 'cubicOut'
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [data, token]);

  return (
    <div ref={chartRef} className="w-full h-full relative z-10" />
  );
}