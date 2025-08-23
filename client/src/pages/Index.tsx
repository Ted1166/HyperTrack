import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedDashboard from "@/components/EnhancedDashboard";
import { PerformanceAnalytics } from "@/components/PerformanceAnalytics";
import { PriceTicker } from "@/components/PriceTicker";
import { OrderBookWidget } from "@/components/OrderBookWidget";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  DollarSign,
  Wallet,
  Settings,
  Bell
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Price Ticker Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <PriceTicker />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Positions
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <p className="text-muted-foreground">Detailed analysis of your trading performance</p>
              </div>
              <PerformanceAnalytics trades={[]} />
            </div>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Current Positions</CardTitle>
                  <CardDescription>
                    All your open positions with real-time P&L
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    No positions found. Connect your wallet to view positions.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Position Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Positions</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Long Positions</span>
                    <span className="font-medium text-profit">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Short Positions</span>
                    <span className="font-medium text-loss">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-bold">$0.00</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Open Orders</CardTitle>
                  <CardDescription>
                    Manage your pending orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    No open orders. Connect your wallet to view orders.
                  </div>
                </CardContent>
              </Card>

              <OrderBookWidget />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your wallet connection and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto-refresh data</span>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Real-time updates</span>
                    <Button variant="outline" size="sm">Connected</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data export</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure alerts and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">P&L Alerts</span>
                    <Button variant="outline" size="sm">Off</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Position Updates</span>
                    <Button variant="outline" size="sm">On</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price Alerts</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Risk Management
                  </CardTitle>
                  <CardDescription>
                    Set up automated risk management rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Max Daily Loss</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">$</span>
                        <span className="font-mono">1000.00</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Position Size</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono">50%</span>
                        <span className="text-sm text-muted-foreground">of portfolio</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Leverage</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono">10x</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;