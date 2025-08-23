// client/src/components/PerformanceAnalytics.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Clock, DollarSign } from "lucide-react";

interface PerformanceMetrics {
  totalPnl: number;
  totalVolume: number;
  totalFees: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  avgHoldingTime: number;
  bestDay: number;
  worstDay: number;
}

interface PerformanceAnalyticsProps {
  trades: any[];
}

export const PerformanceAnalytics = ({ trades }: PerformanceAnalyticsProps) => {
  const calculateMetrics = (trades: any[]): PerformanceMetrics => {
    if (!trades || trades.length === 0) {
      return {
        totalPnl: 0,
        totalVolume: 0,
        totalFees: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        totalTrades: 0,
        consecutiveWins: 0,
        consecutiveLosses: 0,
        avgHoldingTime: 0,
        bestDay: 0,
        worstDay: 0
      };
    }

    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalVolume = trades.reduce((sum, t) => sum + (t.size * t.price), 0);
    const totalFees = trades.reduce((sum, t) => sum + t.fees, 0);
    
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0;
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;

    // Calculate consecutive wins/losses
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;

    for (const trade of trades) {
      if (trade.pnl > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else if (trade.pnl < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      }
    }

    // Calculate daily P&L for best/worst day
    const dailyPnl = new Map<string, number>();
    trades.forEach(trade => {
      const date = new Date(trade.timestamp).toDateString();
      dailyPnl.set(date, (dailyPnl.get(date) || 0) + trade.pnl);
    });

    const dailyPnlValues = Array.from(dailyPnl.values());
    const bestDay = dailyPnlValues.length > 0 ? Math.max(...dailyPnlValues) : 0;
    const worstDay = dailyPnlValues.length > 0 ? Math.min(...dailyPnlValues) : 0;

    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnl = 0;

    for (const trade of trades) {
      runningPnl += trade.pnl;
      peak = Math.max(peak, runningPnl);
      const drawdown = (peak - runningPnl) / (peak || 1) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return {
      totalPnl,
      totalVolume,
      totalFees,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      sharpeRatio: 0, // Would need daily returns for proper calculation
      maxDrawdown,
      totalTrades: trades.length,
      consecutiveWins: maxWinStreak,
      consecutiveLosses: maxLossStreak,
      avgHoldingTime: 0, // Would need position open/close times
      bestDay,
      worstDay
    };
  };

  const metrics = calculateMetrics(trades);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getMetricColor = (value: number, isPositiveGood = true) => {
    if (value === 0) return 'text-muted-foreground';
    return (isPositiveGood && value > 0) || (!isPositiveGood && value < 0) 
      ? 'text-profit' 
      : 'text-loss';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total P&L</span>
            <span className={`font-bold ${getMetricColor(metrics.totalPnl)}`}>
              {formatCurrency(metrics.totalPnl)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Volume</span>
            <span className="font-medium">{formatCurrency(metrics.totalVolume)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Fees</span>
            <span className="font-medium text-loss">{formatCurrency(metrics.totalFees)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Net Profit</span>
            <span className={`font-bold ${getMetricColor(metrics.totalPnl - metrics.totalFees)}`}>
              {formatCurrency(metrics.totalPnl - metrics.totalFees)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Win/Loss Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Win/Loss Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Win Rate</span>
            <Badge 
              variant={metrics.winRate >= 50 ? "default" : "secondary"} 
              className={metrics.winRate >= 50 ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}
            >
              {formatPercentage(metrics.winRate)}
            </Badge>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Win Rate Progress</span>
              <span>{formatPercentage(metrics.winRate)}</span>
            </div>
            <Progress value={metrics.winRate} className="h-2" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Win</span>
            <span className="font-medium text-profit">{formatCurrency(metrics.avgWin)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Loss</span>
            <span className="font-medium text-loss">{formatCurrency(-metrics.avgLoss)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Risk Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Profit Factor</span>
            <span className={`font-bold ${getMetricColor(metrics.profitFactor - 1)}`}>
              {metrics.profitFactor.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Max Drawdown</span>
            <span className="font-medium text-loss">
              {formatPercentage(metrics.maxDrawdown)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Best Day</span>
            <span className="font-medium text-profit">{formatCurrency(metrics.bestDay)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Worst Day</span>
            <span className="font-medium text-loss">{formatCurrency(metrics.worstDay)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Trading Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Trading Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Trades</span>
            <span className="font-bold">{metrics.totalTrades}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Max Win Streak</span>
            <Badge variant="outline" className="text-profit bg-profit/10">
              {metrics.consecutiveWins}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Max Loss Streak</span>
            <Badge variant="outline" className="text-loss bg-loss/10">
              {metrics.consecutiveLosses}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg per Trade</span>
            <span className={`font-medium ${getMetricColor(metrics.totalPnl / Math.max(metrics.totalTrades, 1))}`}>
              {formatCurrency(metrics.totalPnl / Math.max(metrics.totalTrades, 1))}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Summary
          </CardTitle>
          <CardDescription>
            Key metrics overview for your trading performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-lg font-bold text-profit">
                {metrics.totalPnl > 0 ? '+' : ''}{formatPercentage((metrics.totalPnl / 10000) * 100)}
              </div>
              <div className="text-xs text-muted-foreground">ROI Estimate</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-lg font-bold">
                {(metrics.totalVolume / Math.max(metrics.totalTrades, 1) / 1000).toFixed(1)}k
              </div>
              <div className="text-xs text-muted-foreground">Avg Trade Size</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-lg font-bold">
                {metrics.totalVolume > 0 ? ((metrics.totalFees / metrics.totalVolume) * 100).toFixed(3) : '0.000'}%
              </div>
              <div className="text-xs text-muted-foreground">Fee Rate</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-lg font-bold">
                {metrics.profitFactor >= 1 ? '✅' : '❌'}
              </div>
              <div className="text-xs text-muted-foreground">Profitable</div>
            </div>
          </div>
          
          {/* Risk Assessment */}
          <div className="mt-4 p-3 rounded-lg bg-card border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Risk Assessment</span>
              <Badge 
                variant={
                  metrics.maxDrawdown < 10 ? "default" : 
                  metrics.maxDrawdown < 25 ? "secondary" : 
                  "destructive"
                }
              >
                {metrics.maxDrawdown < 10 ? 'Low Risk' : 
                 metrics.maxDrawdown < 25 ? 'Medium Risk' : 
                 'High Risk'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Based on max drawdown of {formatPercentage(metrics.maxDrawdown)} and profit factor of {metrics.profitFactor.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};