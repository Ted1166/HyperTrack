// client/src/components/OrderBookWidget.tsx
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { hyperliquidApi } from "@/services/hyperliquidApi";

interface OrderBookLevel {
  px: string;
  sz: string;
  n: number;
}

interface OrderBookData {
  coin: string;
  levels: Array<[OrderBookLevel[], OrderBookLevel[]]>;
  time: number;
}

export const OrderBookWidget = () => {
  const [selectedCoin, setSelectedCoin] = useState("ETH");
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableCoins] = useState(["ETH", "BTC", "SOL", "MATIC", "AVAX", "ARB", "OP"]);

  const fetchOrderBook = async (coin: string) => {
    setLoading(true);
    try {
      const data = await hyperliquidApi.getL2Book(coin);
      setOrderBook(data);
    } catch (error) {
      console.error("Error fetching order book:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderBook(selectedCoin);
    
    // Refresh order book every 5 seconds
    const interval = setInterval(() => {
      fetchOrderBook(selectedCoin);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedCoin]);

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(4);
  };

  const formatSize = (size: string) => {
    return parseFloat(size).toFixed(3);
  };

  if (loading && !orderBook) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-3 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const bids = orderBook?.levels?.[0]?.[1] || [];
  const asks = orderBook?.levels?.[0]?.[0] || [];

  // Calculate spread
  const bestBid = bids[0] ? parseFloat(bids[0].px) : 0;
  const bestAsk = asks[0] ? parseFloat(asks[0].px) : 0;
  const spread = bestAsk - bestBid;
  const spreadPercent = bestBid > 0 ? (spread / bestBid) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Coin Selector */}
      <div className="flex items-center justify-between">
        <Select value={selectedCoin} onValueChange={setSelectedCoin}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableCoins.map(coin => (
              <SelectItem key={coin} value={coin}>{coin}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Badge variant="outline" className="text-xs">
          Spread: ${spread.toFixed(4)} ({spreadPercent.toFixed(3)}%)
        </Badge>
      </div>

      {/* Order Book */}
      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium pb-2 border-b">
          <div className="text-right">Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sell Orders) - Red */}
        <div className="space-y-0.5">
          {asks.slice(0, 8).reverse().map((ask, index) => {
            const cumulativeSize = asks.slice(0, asks.indexOf(ask) + 1)
              .reduce((sum, order) => sum + parseFloat(order.sz), 0);
            
            return (
              <div key={`ask-${index}`} className="grid grid-cols-3 gap-2 text-xs font-mono relative">
                <div className="absolute inset-0 bg-loss/5 rounded" 
                     style={{ width: `${(parseFloat(ask.sz) / 50) * 100}%` }}></div>
                <div className="text-right text-loss relative z-10">{formatPrice(ask.px)}</div>
                <div className="text-right relative z-10">{formatSize(ask.sz)}</div>
                <div className="text-right text-muted-foreground relative z-10">
                  {cumulativeSize.toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Spread */}
        <div className="py-2 text-center">
          <div className="text-xs font-medium text-muted-foreground">
            {bestAsk > 0 && bestBid > 0 ? (
              <span>
                Spread: <span className="text-foreground">${spread.toFixed(4)}</span>
              </span>
            ) : (
              <span>Loading...</span>
            )}
          </div>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div className="space-y-0.5">
          {bids.slice(0, 8).map((bid, index) => {
            const cumulativeSize = bids.slice(0, index + 1)
              .reduce((sum, order) => sum + parseFloat(order.sz), 0);
            
            return (
              <div key={`bid-${index}`} className="grid grid-cols-3 gap-2 text-xs font-mono relative">
                <div className="absolute inset-0 bg-profit/5 rounded" 
                     style={{ width: `${(parseFloat(bid.sz) / 50) * 100}%` }}></div>
                <div className="text-right text-profit relative z-10">{formatPrice(bid.px)}</div>
                <div className="text-right relative z-10">{formatSize(bid.sz)}</div>
                <div className="text-right text-muted-foreground relative z-10">
                  {cumulativeSize.toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Info */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t text-xs">
        <div>
          <span className="text-muted-foreground">Best Bid:</span>
          <div className="font-mono font-medium text-profit">
            {bestBid > 0 ? `$${formatPrice(bestBid.toString())}` : '-'}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Best Ask:</span>
          <div className="font-mono font-medium text-loss">
            {bestAsk > 0 ? `$${formatPrice(bestAsk.toString())}` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};