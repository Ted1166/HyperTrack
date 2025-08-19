import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const mockData = [
  { name: 'ETH', value: 45.2, volume: 125000 },
  { name: 'BTC', value: 28.7, volume: 89000 },
  { name: 'SOL', value: 12.5, volume: 34000 },
  { name: 'MATIC', value: 8.1, volume: 23000 },
  { name: 'AVAX', value: 5.5, volume: 15000 },
];

const COLORS = [
  'hsl(var(--chart-primary))',
  'hsl(var(--chart-secondary))',
  'hsl(var(--chart-accent))',
  'hsl(var(--chart-warning))',
  'hsl(var(--chart-danger))',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <div className="space-y-1 mt-2">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Allocation:</span>
            <span className="text-xs font-medium text-chart-primary">
              {data.value.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Volume:</span>
            <span className="text-xs font-medium text-foreground">
              ${data.volume.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="hsl(var(--foreground))" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const AllocationChart = () => {
  return (
    <div className="flex flex-col h-full">
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={mockData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {mockData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {mockData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs font-medium text-foreground">{entry.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {entry.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};