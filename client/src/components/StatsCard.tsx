import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  type?: 'currency' | 'percentage' | 'default';
  badges?: { label: string; value: string; type: 'profit' | 'loss' | 'default' }[];
}

export const StatsCard = ({ title, value, subtitle, icon, trend, type = 'default', badges }: StatsCardProps) => {
  const formatValue = () => {
    if (type === 'currency' && typeof value === 'number') {
      return formatCurrency(value);
    }
    if (type === 'percentage' && typeof value === 'number') {
      return formatPercentage(value);
    }
    return value;
  };

  const getValueColor = () => {
    if (type === 'currency' && typeof value === 'number') {
      return value >= 0 ? 'text-profit' : 'text-loss';
    }
    if (type === 'percentage') {
      return 'text-profit';
    }
    return '';
  };

  return (
    <Card className={type === 'currency' && typeof value === 'number' && value >= 0 ? 'shadow-trading' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getValueColor()}`}>
          {formatValue()}
        </div>
        {subtitle && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {trend !== undefined && (
              trend >= 0 ? (
                <TrendingUp className="h-3 w-3 text-profit" />
              ) : (
                <TrendingDown className="h-3 w-3 text-loss" />
              )
            )}
            {subtitle}
          </div>
        )}
        {badges && (
          <div className="space-y-1 mt-2">
            {badges.map((badge, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{badge.label}:</span>
                <Badge 
                  variant="secondary" 
                  className={badge.type === 'profit' ? 'text-profit bg-profit/10' : 
                           badge.type === 'loss' ? 'text-loss bg-loss/10' : ''}
                >
                  {badge.value}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
