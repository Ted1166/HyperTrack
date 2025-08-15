import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Shield, TrendingUp, Info, ExternalLink, Copy, Check } from "lucide-react";

interface AccountConnectionProps {
  onConnect: () => void;
}

export const AccountConnection = ({ onConnect }: AccountConnectionProps) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!walletAddress) {
      setError("Please enter your Hyperliquid wallet address to continue.");
      return;
    }

    setError("");
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false);
      onConnect();
    }, 1500);
  };

  const copyExampleAddress = () => {
    const exampleAddress = "0x742E4C4B9f6ABd59F4C37B7f5C9c8b9AeF123456";
    navigator.clipboard.writeText(exampleAddress);
    setWalletAddress(exampleAddress);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-chart-accent rounded-xl flex items-center justify-center shadow-trading">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Hyperliquid Dashboard</h1>
          <p className="text-muted-foreground">Connect your wallet to view trading analytics</p>
        </div>

        {/* Connection Card */}
        <Card className="shadow-trading">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </CardTitle>
            <CardDescription>
              Enter your Hyperliquid wallet address to access your trading data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="0x742E4C4B9f6ABd59F4C37B7f5C9c8b9AeF123456"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex-1 trading-gradient shadow-trading"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={copyExampleAddress}
                title="Use example address"
              >
                {addressCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
            <div className="w-8 h-8 rounded-full bg-profit/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-profit" />
            </div>
            <div>
              <p className="font-medium text-sm">Real-time P&L Tracking</p>
              <p className="text-xs text-muted-foreground">Live profit/loss calculations</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
            <div className="w-8 h-8 rounded-full bg-chart-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-chart-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Read-only Access</p>
              <p className="text-xs text-muted-foreground">View-only, no trading permissions</p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This dashboard uses Hyperliquid's public APIs for read-only access. Your private keys and funds remain secure.
            <Button variant="link" className="h-auto p-0 text-xs ml-1" asChild>
              <a href="https://hyperliquid.gitbook.io/hyperliquid-docs" target="_blank" rel="noopener noreferrer">
                Learn more <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>

        {/* Status Badges */}
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 rounded-full bg-profit mr-2" />
            API Connected
          </Badge>
          <Badge variant="secondary" className="text-xs">
            MIT Licensed
          </Badge>
        </div>
      </div>
    </div>
  );
};