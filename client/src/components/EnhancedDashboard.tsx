// client/src/components/EnhancedDashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PnLChart } from "@/components/charts/PnLChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { AllocationChart } from "@/components/charts/AllocationChart";
import { TradeHistory } from "@/components/TradeHistory";
import { AccountConnection } from "@/components/AccountConnection";
import { PositionCard } from "@/components/PositionCard";
import { OrderBookWidget } from "@/components/OrderBookWidget";
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, PieChart, Download, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useHyperliquidWebSocket } from "@/hooks/useHyperliquidWebSocket";
import { hyperliquidApi, type UserState, type AllMids, type UserFill } from "@/services/hyperliquidApi";

const EnhancedDashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userState, setUserState] = useState<UserState | null>(null);
  const [allMids, setAllMids] = useState<AllMids | null>(null);
  const [userFills, setUserFills] = useState<UserFill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portfolioMetrics, setPortfolioMetrics] = useState<any>(null);
  const [tradingStats, setTradingStats] = useState<any>(null);

  // WebSocket connection for real-time updates
  const { 
    isConnected: wsConnected, 
    lastMessage, 
    subscribe, 
    connectionError 
  } = useHyperliquidWebSocket(walletAddress);

  // Fetch initial data when wallet connects
  const fetchUserData = async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [userStateData, allMidsData, userFillsData] = await Promise.all([
        hyperliquidApi.getUserState(address),
        hyperliquidApi.getAllMids(),
        hyperliquidApi.getUserFills(address)
      ]);

      setUserState(userStateData);
      setAllMids(allMidsData);
      setUserFills(userFillsData);

      // Calculate portfolio metrics
      const metrics = hyperliquidApi.calculatePortfolioMetrics(userStateData, allMidsData);
      setPortfolioMetrics(metrics);

      // Process trading statistics
      const stats = hyperliquidApi.processUserFills(userFillsData);
      setTradingStats(stats);

      // Subscribe to real-time updates
      subscribe(['user', 'allMids']);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch trading data. Please check your wallet address and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle wallet connection
  const handleConnect = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    fetchUserData(address);
  };

  // Handle real-time WebSocket messages
  useEffect(() => {
    if (lastMessage && walletAddress) {
      if (lastMessage.channel === 'user') {
        setUserState(lastMessage.data);
        if (allMids) {
          const metrics = hyperliquidApi.calculatePortfolioMetrics(lastMessage.data, allMids);
          setPortfolioMetrics(metrics);
        }
      } else if (lastMessage.channel === 'allMids') {
        setAllMids(lastMessage.data);
        if (userState) {
          const metrics = hyperliquidApi.calculatePortfolioMetrics(userState, lastMessage.data);
          setPortfolioMetrics(metrics);
        }
      }
    }
  }, [lastMessage, userState, allMids, walletAddress]);

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
    return <AccountConnection onConnect={handleConnect} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading your trading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hyperliquid Dashboard</h1>
            <p className="text-muted-foreground">Real-time trading performance and analytics</p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant={wsConnected ? "default" : "secondary"} className="text-xs">
              {wsConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Live Data
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
              Disconnect
            </Button>
          </div>
        </div>

        {/* Connection Status & Errors */}
        {(error || connectionError) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || connectionError}
            </AlertDescription>
          </Alert>
        )}

        {/* Portfolio Overview */}
        {portfolioMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-trading">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(portfolioMetrics.accountValue)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Available: {formatCurrency(portfolioMetrics.availableBalance)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${portfolioMetrics.totalUnrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatCurrency(portfolioMetrics.totalUnrealizedPnl)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {portfolioMetrics.totalUnrealizedPnl >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-profit" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-loss" />
                  )}
                  Mark to Market
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margin Used</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(portfolioMetrics.marginUtilization)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(portfolioMetrics.totalMarginUsed)} used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-profit">
                  {tradingStats ? formatPercentage(tradingStats.winRate) : '-'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tradingStats ? `${tradingStats.totalTrades} total trades` : 'No trades yet'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Positions */}
        {portfolioMetrics && portfolioMetrics.positionDetails.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>
                Your current trading positions with real-time P&L
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioMetrics.positionDetails.map((position: any, index: number) => (
                  <PositionCard key={index} position={position} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Order Book Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>
                Complete trading history with export capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradeHistory />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
              <CardDescription>
                Real-time market depth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderBookWidget />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;