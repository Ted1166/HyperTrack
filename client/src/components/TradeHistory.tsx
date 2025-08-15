import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, ArrowUpDown } from "lucide-react";

// Mock data - will be replaced with real API data
const mockTrades = [
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

export const TradeHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [filterAsset, setFilterAsset] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const exportToCSV = () => {
    const headers = ["Timestamp", "Asset", "Side", "Size", "Price", "P&L", "Fees"];
    const csvContent = [
      headers.join(","),
      ...mockTrades.map(trade => [
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

  const filteredTrades = mockTrades.filter(trade => {
    const matchesSearch = trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.side.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAsset = filterAsset === "all" || trade.asset === filterAsset;
    return matchesSearch && matchesAsset;
  });

  const uniqueAssets = [...new Set(mockTrades.map(trade => trade.asset))];

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={filterAsset} onValueChange={setFilterAsset}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              {uniqueAssets.map(asset => (
                <SelectItem key={asset} value={asset}>{asset}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Trade Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:text-foreground">
                <div className="flex items-center gap-1">
                  Timestamp
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Side</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead className="text-right">Fees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-mono text-xs">
                  {trade.timestamp}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {trade.asset}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={trade.side === "buy" ? "default" : "secondary"}
                    className={trade.side === "buy" ? "bg-profit/10 text-profit border-profit/20" : "bg-loss/10 text-loss border-loss/20"}
                  >
                    {trade.side.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {trade.size}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(trade.price)}
                </TableCell>
                <TableCell className={`text-right font-mono font-medium ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatCurrency(trade.pnl)}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {formatCurrency(trade.fees)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No trades found matching your criteria.
        </div>
      )}
    </div>
  );
};