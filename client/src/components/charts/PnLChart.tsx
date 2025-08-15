import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - will be replaced with real API data
const mockData = [
  { date: '2024-01-01', pnl: 0, cumulative: 0 },
  { date: '2024-01-02', pnl: 145.50, cumulative: 145.50 },
  { date: '2024-01-03', pnl: -89.20, cumulative: 56.30 },
  { date: '2024-01-04', pnl: 234.80, cumulative: 291.10 },
  { date: '2024-01-05', pnl: 123.45, cumulative: 414.55 },
  { date: '2024-01-06', pnl: -67.30, cumulative: 347.25 },
  { date: '2024-01-07', pnl: 189.75, cumulative: 537.00 },
  { date: '2024-01-08', pnl: 298.40, cumulative: 835.40 },
  { date: '2024-01-09', pnl: -123.80, cumulative: 711.60 },
  { date: '2024-01-10', pnl: 456.90, cumulative: 1168.50 },
  { date: '2024-01-11', pnl: 234.60, cumulative: 1403.10 },
  { date: '2024-01-12', pnl: -145.20, cumulative: 1257.90 },
  { date: '2024-01-13', pnl: 387.45, cumulative: 1645.35 },
  { date: '2024-01-14', pnl: 289.30, cumulative: 1934.65 },
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
        <div className="space-y-1 mt-2">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Daily P&L:</span>
            <span className={`text-xs font-medium ${data.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
              ${data.pnl.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Cumulative:</span>
            <span className={`text-xs font-medium ${data.cumulative >= 0 ? 'text-profit' : 'text-loss'}`}>
              ${data.cumulative.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const PnLChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="cumulative" 
          stroke="hsl(var(--chart-primary))" 
          strokeWidth={2}
          dot={{ fill: "hsl(var(--chart-primary))", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "hsl(var(--chart-primary))", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};