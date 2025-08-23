const HYPERLIQUID_API_BASE = 'https://api.hyperliquid.xyz/info';

export interface UserState {
  assetPositions: AssetPosition[];
  crossMaintenanceMarginUsed: string;
  marginSummary: MarginSummary;
  time: number;
}

export interface AssetPosition {
  position: {
    coin: string;
    entryPx?: string;
    leverage: {
      type: string;
      value: number;
    };
    liquidationPx?: string;
    marginUsed: string;
    maxLeverage: number;
    positionValue: string;
    returnOnEquity: string;
    szi: string;
    unrealizedPnl: string;
  };
  type: string;
}

export interface MarginSummary {
  accountValue: string;
  totalMarginUsed: string;
  totalNtlPos: string;
  totalRawUsd: string;
}

export interface OpenOrder {
  coin: string;
  limitPx: string;
  oid: number;
  side: string;
  sz: string;
  timestamp: number;
}

export interface UserFill {
  coin: string;
  px: string;
  sz: string;
  side: string;
  time: number;
  startPosition: string;
  dir: string;
  closedPnl: string;
  hash: string;
  oid: number;
  crossed: boolean;
  fee: string;
  tid: number;
}

export interface AllMids {
  [coin: string]: string;
}

export interface Meta {
  universe: Array<{
    name: string;
    szDecimals: number;
    maxLeverage: number;
    onlyIsolated: boolean;
  }>;
}

class HyperliquidAPI {
  private baseUrl = HYPERLIQUID_API_BASE;

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get user's current state including positions and margin
  async getUserState(user: string): Promise<UserState> {
    return this.post('/clearinghouseState', { user });
  }

  // Get user's open orders
  async getOpenOrders(user: string): Promise<OpenOrder[]> {
    return this.post('/openOrders', { user });
  }

  // Get user's trading history
  async getUserFills(user: string): Promise<UserFill[]> {
    return this.post('/userFills', { user });
  }

  // Get current market prices for all assets
  async getAllMids(): Promise<AllMids> {
    return this.post('/allMids', {});
  }

  // Get market metadata (available trading pairs, decimals, etc.)
  async getMeta(): Promise<Meta> {
    return this.post('/meta', {});
  }

  // Get funding history for a specific user
  async getFundingHistory(user: string, startTime?: number, endTime?: number): Promise<any> {
    return this.post('/userFunding', { 
      user,
      startTime,
      endTime
    });
  }

  // Get user's non-funding ledger updates
  async getUserNonFundingLedgerUpdates(user: string, startTime?: number, endTime?: number): Promise<any> {
    return this.post('/userNonFundingLedgerUpdates', { 
      user,
      startTime,
      endTime
    });
  }

  // Get L2 order book for a specific coin
  async getL2Book(coin: string): Promise<any> {
    return this.post('/l2Book', { coin });
  }

  // Get recent trades for a specific coin
  async getCandleSnapshot(coin: string, interval: string, startTime: number, endTime: number): Promise<any> {
    return this.post('/candleSnapshot', {
      req: {
        coin,
        interval,
        startTime,
        endTime
      }
    });
  }

  // Calculate portfolio metrics
  calculatePortfolioMetrics(userState: UserState, allMids: AllMids) {
    const { assetPositions, marginSummary } = userState;
    
    let totalUnrealizedPnl = 0;
    let totalPositionValue = 0;
    let totalMarginUsed = 0;
    
    const positionDetails = assetPositions.map(ap => {
      const position = ap.position;
      const unrealizedPnl = parseFloat(position.unrealizedPnl);
      const positionValue = parseFloat(position.positionValue);
      const marginUsed = parseFloat(position.marginUsed);
      
      totalUnrealizedPnl += unrealizedPnl;
      totalPositionValue += Math.abs(positionValue);
      totalMarginUsed += marginUsed;
      
      return {
        coin: position.coin,
        size: position.szi,
        entryPrice: position.entryPx,
        markPrice: allMids[position.coin],
        unrealizedPnl,
        positionValue,
        marginUsed,
        leverage: position.leverage.value,
        liquidationPrice: position.liquidationPx,
        roe: parseFloat(position.returnOnEquity) * 100
      };
    });

    return {
      accountValue: parseFloat(marginSummary.accountValue),
      totalMarginUsed,
      totalUnrealizedPnl,
      totalPositionValue,
      availableBalance: parseFloat(marginSummary.accountValue) - totalMarginUsed,
      positionDetails,
      marginUtilization: (totalMarginUsed / parseFloat(marginSummary.accountValue)) * 100
    };
  }

  // Process user fills into trading statistics
  processUserFills(fills: UserFill[]) {
    const trades = fills.map(fill => ({
      id: `${fill.hash}-${fill.tid}`,
      timestamp: new Date(fill.time).toISOString(),
      asset: fill.coin,
      side: fill.side,
      size: parseFloat(fill.sz),
      price: parseFloat(fill.px),
      pnl: parseFloat(fill.closedPnl),
      fees: parseFloat(fill.fee),
      hash: fill.hash
    }));

    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalVolume = trades.reduce((sum, trade) => sum + (trade.size * trade.price), 0);
    const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);
    
    const profitableTrades = trades.filter(trade => trade.pnl > 0);
    const winRate = trades.length > 0 ? (profitableTrades.length / trades.length) * 100 : 0;
    
    const bestTrade = trades.reduce((best, trade) => trade.pnl > best ? trade.pnl : best, 0);
    const worstTrade = trades.reduce((worst, trade) => trade.pnl < worst ? trade.pnl : worst, 0);

    return {
      trades,
      totalPnl,
      totalVolume,
      totalFees,
      winRate,
      bestTrade,
      worstTrade,
      totalTrades: trades.length
    };
  }
}

export const hyperliquidApi = new HyperliquidAPI();