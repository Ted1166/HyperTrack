import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface Trade {
  id: string;
  timestamp: string;
  asset: string;
  side: string;
  size: number;
  price: number;
  pnl: number;
  fees: number;
}

interface TradeTableProps {
  trades: Trade[];
}

export const TradeTable = ({ trades }: TradeTableProps) => {
  return (
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
          {trades.map((trade) => (
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
  );
};
