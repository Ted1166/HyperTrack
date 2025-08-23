// client/src/components/PriceTicker.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { hyperliquidApi } from "@/services/hyperliquidApi";

interface PriceData {
  coin: string;
  price: number;
  change24h: number;
  volume24h: number;
  prevPrice: number;
}

export const PriceTicker = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  const MAJOR_COINS = ['ETH', 'BTC', 'SOL', 'ARB', 'MATIC', 'AVAX', 'OP', 'LINK'];

  const fetchPrices = async () => {
    try {
      const allMids = await hyperliquidApi.getAllMids();
      
      // Convert to array with mock change data (in real app, you'd get this from 24h data)
      const priceData: PriceData[] = MAJOR_COINS
        .filter(coin => allMids[coin])
        .map(coin => {
          const currentPrice = parseFloat(allMids[coin]);
          const mockChange = (Math.random() - 0.5) * 10; // Mock 24h change
          
          return {
            coin,
            price: currentPrice,
            change24h: mockChange,
            volume24h: Math.random() * 1000000,
            prevPrice: currentPrice
          };
        });

      setPrices(prevPrices => {
        // Update with price animation data
        return priceData.map(newPrice => {
          const prevData = prevPrices.find(p => p.coin === newPrice.coin);
          return {
            ...newPrice,
            prevPrice: prevData?.price || newPrice.price
          };
        });
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Update prices every 5 seconds
    const interval = setInterval(fetchPrices, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(0)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-12"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-6 overflow-x-auto">
          {prices.map((priceData) => {
            const isUp = priceData.change24h >= 0;
            const priceChanged = priceData.price !== priceData.prevPrice;
            const priceWentUp = priceData.price > priceData.prevPrice;
            
            return (
              <div 
                key={priceData.coin} 
                className={`flex-shrink-0 space-y-1 transition-all duration-300 ${
                  priceChanged ? (priceWentUp ? 'animate-pulse text-profit' : 'animate-pulse text-loss') : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{priceData.coin}</span>
                  {isUp ? (
                    <TrendingUp className="h-3 w-3 text-profit" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-loss" />
                  )}
                </div>
                
                <div className={`font-mono font-bold text-lg transition-colors duration-300 ${
                  priceChanged ? (priceWentUp ? 'text-profit' : 'text-loss') : 'text-foreground'
                }`}>
                  {formatPrice(priceData.price)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={isUp ? "default" : "secondary"}
                    className={`text-xs ${
                      isUp 
                        ? 'bg-profit/10 text-profit border-profit/20' 
                        : 'bg-loss/10 text-loss border-loss/20'
                    }`}
                  >
                    {formatChange(priceData.change24h)}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Vol: {formatVolume(priceData.volume24h)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};