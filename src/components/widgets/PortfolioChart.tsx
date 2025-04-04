import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { AllocationData } from '../../types/wallet.type';

interface LabelParam {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelParam) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        </text>
    );
};

interface PortfolioChartProps {
    data: AllocationData[]
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ data }) => {

    const chartData = data.map((item) => ({
        name: item.type,
        value: item.percentage
    }))

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={120} height={120}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={55}
                    innerRadius={20}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={data[index].color} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}


export default PortfolioChart;