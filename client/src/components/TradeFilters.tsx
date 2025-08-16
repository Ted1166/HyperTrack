import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

interface TradeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterAsset: string;
  setFilterAsset: (asset: string) => void;
  uniqueAssets: string[];
  onExportCSV: () => void;
}

export const TradeFilters = ({
  searchTerm,
  setSearchTerm,
  filterAsset,
  setFilterAsset,
  uniqueAssets,
  onExportCSV
}: TradeFiltersProps) => {
  return (
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
      <Button onClick={onExportCSV} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
};
