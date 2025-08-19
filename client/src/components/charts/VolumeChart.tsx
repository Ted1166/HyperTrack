import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { date: '2024-01-01', volume: 12500 },
  { date: '2024-01-02', volume: 18750 },
  { date: '2024-01-03', volume: 9800 },
  { date: '2024-01-04', volume: 25600 },
  { date: '2024-01-05', volume: 15400 },
  { date: '2024-01-06', volume: 8900 },
  { date: '2024-01-07', volume: 31200 },
  { date: '2024-01-08', volume: 22800 },
  { date: '2024-01-09', volume: 16700 },
  { date: '2024-01-10', volume: 35400 },
  { date: '2024-01-11', volume: 19500 },
  { date: '2024-01-12', volume: 27300 },
  { date: '2024-01-13', volume: 14800 },
  { date: '2024-01-14', volume: 29100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">
          {new Date(label).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        <div className="mt-2">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Volume:</span>
            <span className="text-xs font-medium text-chart-primary">
              ${data.volume.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const VolumeChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
          strokeOpacity={0.3}
        />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="volume" 
          fill="hsl(var(--chart-primary))"
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};