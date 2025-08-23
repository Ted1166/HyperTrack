// client/src/components/PositionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react";

interface Position {
  coin: string;
  size: string;
  entryPrice?: string;
  markPrice: string;
  unrealizedPnl: number;
  positionValue: number;
  marginUsed: number;
  leverage: number;
  liquidationPrice?: string;
  roe: number;
}

interface PositionCardProps {
  position: Position;
}

export const PositionCard = ({ position }: PositionCardProps) => {
  const formatCurrency = (amount: number | string) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const formatSize = (size: string) => {
    const value = parseFloat(size);
    return value.toFixed(4);
  };

  const isLong = parseFloat(position.size) > 0;
  const pnlColor = position.unrealizedPnl >= 0 ? 'text-profit' : 'text-loss';
  const roeColor = position.roe >= 0 ? 'text-profit' : 'text-loss';
  
  // Calculate liquidation risk (closer to liquidation = higher risk)
  const getLiquidationRisk = () => {
    if (!position.liquidationPrice || !position.markPrice) return null;
    
    const markPrice = parseFloat(position.markPrice);
    const liqPrice = parseFloat(position.liquidationPrice);
    const riskPercentage = Math.abs((markPrice - liqPrice) / markPrice) * 100;
    
    if (riskPercentage < 5) return { level: 'high', color: 'text-red-500' };
    if (riskPercentage < 15) return { level: 'medium', color: 'text-yellow-500' };
    return { level: 'low', color: 'text-green-500' };
  };

  const liquidationRisk = getLiquidationRisk();

  return (
    <Card className={`relative overflow-hidden ${position.unrealizedPnl >= 0 ? 'shadow-trading' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{position.coin}</span>
            <Badge 
              variant={isLong ? "default" : "secondary"}
              className={isLong ? "bg-profit/10 text-profit border-profit/20" : "bg-loss/10 text-loss border-loss/20"}
            >
              {isLong ? 'LONG' : 'SHORT'} {position.leverage}x
            </Badge>
          </div>
          {liquidationRisk && liquidationRisk.level === 'high' && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Position Size & Entry Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Size</p>
            <p className="font-mono font-medium">{formatSize(position.size)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entry Price</p>
            <p className="font-mono font-medium">
              {position.entryPrice ? formatCurrency(position.entryPrice) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Mark Price & P&L */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Mark Price</p>
            <p className="font-mono font-medium">{formatCurrency(position.markPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Unrealized P&L</p>
            <div className="flex items-center gap-1">
              {position.unrealizedPnl >= 0 ? (
                <TrendingUp className="h-3 w-3 text-profit" />
              ) : (
                <TrendingDown className="h-3 w-3 text-loss" />
              )}
              <p className={`font-mono font-medium ${pnlColor}`}>
                {formatCurrency(position.unrealizedPnl)}
              </p>
            </div>
          </div>
        </div>

        {/* ROE & Margin Used */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">ROE</p>
            <p className={`font-medium ${roeColor}`}>
              {position.roe.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Margin Used</p>
            <p className="font-mono text-sm">{formatCurrency(position.marginUsed)}</p>
          </div>
        </div>

        {/* Liquidation Price & Risk */}
        {position.liquidationPrice && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Liquidation Price</p>
                <p className="font-mono text-sm">{formatCurrency(position.liquidationPrice)}</p>
              </div>
              {liquidationRisk && (
                <div className="flex items-center gap-1">
                  <Target className={`h-3 w-3 ${liquidationRisk.color}`} />
                  <span className={`text-xs capitalize ${liquidationRisk.color}`}>
                    {liquidationRisk.level} risk
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Close 25%
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Close 50%
          </Button>
          <Button variant="destructive" size="sm" className="flex-1">
            Close All
          </Button>
        </div>
      </CardContent>

      {/* Position Value Indicator */}
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-chart-primary/20 to-chart-primary"></div>
    </Card>
  );
};