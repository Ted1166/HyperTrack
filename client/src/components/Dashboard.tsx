import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PnLChart } from "@/components/charts/PnLChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { AllocationChart } from "@/components/charts/AllocationChart";
import { TradeHistory } from "@/components/TradeHistory";
import { AccountConnection } from "@/components/AccountConnection";
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, PieChart, Download } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Mock data - will be replaced with real API data
  const mockStats = {
    totalPnL: 12847.56,
    dailyPnL: 234.12,
    winRate: 68.5,
    totalTrades: 142,
    totalVolume: 456789.23,
    bestTrade: 1234.56,
    worstTrade: -567.89,
  };

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

  if (!isConnected) {
    return <AccountConnection onConnect={() => setIsConnected(true)} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hyperliquid Dashboard</h1>
            <p className="text-muted-foreground">Trading performance and analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
              Disconnect
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-trading">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${mockStats.totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(mockStats.totalPnL)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {mockStats.dailyPnL >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-profit" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-loss" />
                )}
                {formatCurrency(mockStats.dailyPnL)} today
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-profit">
                {formatPercentage(mockStats.winRate)}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(mockStats.totalTrades * mockStats.winRate / 100)} wins of {mockStats.totalTrades}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockStats.totalVolume)}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockStats.totalTrades} trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best/Worst</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Best:</span>
                  <Badge variant="secondary" className="text-profit bg-profit/10">
                    {formatCurrency(mockStats.bestTrade)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Worst:</span>
                  <Badge variant="secondary" className="text-loss bg-loss/10">
                    {formatCurrency(mockStats.worstTrade)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>P&L Over Time</CardTitle>
              <CardDescription>
                Your cumulative profit and loss performance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PnLChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>
                Trading volume distribution by asset
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AllocationChart />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Trading Volume</CardTitle>
              <CardDescription>
                Daily trading volume trends
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <VolumeChart />
            </CardContent>
          </Card>
        </div>

        {/* Trade History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>
              Complete trading history with export capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TradeHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;