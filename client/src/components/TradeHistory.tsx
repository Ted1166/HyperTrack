import { useState } from "react";
import { TradeFilters } from "./TradeFilters";
import { TradeTable } from "./TradeTable";

interface Trade {
  id: string;
  timestamp: string;
  asset: string;
  side: string;
  size: number;
  price: number;
  pnl: number;
  fees: number;
  hash?: string;
}

interface TradeHistoryProps {
  trades?: Trade[];
}

export const TradeHistory = ({ trades: propTrades }: TradeHistoryProps = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAsset, setFilterAsset] = useState("all");

  // Mock data - will be replaced with real API data
  const mockTrades: Trade[] = [
    {
      id: "1",
      timestamp: "2024-01-14 15:32:45",
      asset: "ETH",
      side: "buy",
      size: 2.5,
      price: 2450.30,
      pnl: 234.56,
      fees: 12.25,
    },
    {
      id: "2",
      timestamp: "2024-01-14 14:18:22",
      asset: "BTC",
      side: "sell",
      size: 0.15,
      price: 42150.75,
      pnl: -89.20,
      fees: 31.61,
    },
    {
      id: "3",
      timestamp: "2024-01-14 13:45:10",
      asset: "SOL",
      side: "buy",
      size: 45.0,
      price: 98.40,
      pnl: 156.80,
      fees: 22.14,
    },
    {
      id: "4",
      timestamp: "2024-01-14 12:30:55",
      asset: "MATIC",
      side: "sell",
      size: 150.0,
      price: 0.85,
      pnl: 45.30,
      fees: 6.38,
    },
    {
      id: "5",
      timestamp: "2024-01-14 11:22:33",
      asset: "AVAX",
      side: "buy",
      size: 8.2,
      price: 35.60,
      pnl: -23.45,
      fees: 14.67,
    },
  ];

  const trades = propTrades || mockTrades;

  const exportToCSV = () => {
    const headers = ["Timestamp", "Asset", "Side", "Size", "Price", "P&L", "Fees"];
    const csvContent = [
      headers.join(","),
      ...trades.map(trade => [
        trade.timestamp,
        trade.asset,
        trade.side,
        trade.size,
        trade.price,
        trade.pnl,
        trade.fees
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hyperliquid_trades.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.side.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAsset = filterAsset === "all" || trade.asset === filterAsset;
    return matchesSearch && matchesAsset;
  });

  const uniqueAssets = [...new Set(trades.map(trade => trade.asset))];

  return (
    <div className="space-y-4">
      <TradeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterAsset={filterAsset}
        setFilterAsset={setFilterAsset}
        uniqueAssets={uniqueAssets}
        onExportCSV={exportToCSV}
      />

      <TradeTable trades={filteredTrades} />

      {filteredTrades.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No trades found matching your criteria.
        </div>
      )}
    </div>
  );
};