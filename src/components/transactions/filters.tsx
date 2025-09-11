import { TransactionsTypeOptions, type StatementsResponse } from "@/lib/pocketbase-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { DatePickerWithRange } from "../date-range-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import type { DateRange } from "react-day-picker";

type FiltersProps = {
  statement?: StatementsResponse;
  filterByStatement: boolean;
  hideCredits: boolean;
  hideDebits: boolean;
  typeFilter: TransactionsTypeOptions | undefined;
  setTypeFilter: (type: TransactionsTypeOptions | undefined) => void;
  setFilterByStatement: (value: boolean) => void;
  setHideCredits: (value: boolean) => void;
  setHideDebits: (value: boolean) => void;
  setSortField: (field: string | undefined) => void;
  setSortDir: (dir: "asc" | "desc") => void;
  date?: DateRange;
  setDate: (date?: DateRange) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export function Filters({
  statement,
  filterByStatement,
  hideCredits,
  hideDebits,
  typeFilter,
  setTypeFilter,
  setFilterByStatement,
  setHideCredits,
  setHideDebits,
  setSortField,
  setSortDir,
  date,
  setDate,
  searchQuery,
  setSearchQuery,
}: FiltersProps) {
  const resetFilters = () => {
    setTypeFilter(undefined);
    setFilterByStatement(false);
    setHideCredits(false);
    setHideDebits(false);
    setSortField(undefined);
    setSortDir("asc");
    setDate({ from: undefined, to: undefined });
    setSearchQuery("");
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <Select
        value={typeFilter}
        onValueChange={(value) => setTypeFilter(value === "all" ? undefined : (value as TransactionsTypeOptions))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Transactions</SelectItem>
          <SelectItem value={TransactionsTypeOptions.none}>Uncategorized</SelectItem>
          <SelectItem value={TransactionsTypeOptions.revenue}>Revenue</SelectItem>
          <SelectItem value={TransactionsTypeOptions.transfer}>Transfer</SelectItem>
          <SelectItem value={TransactionsTypeOptions.funding}>Funding</SelectItem>
          <SelectItem value={TransactionsTypeOptions.payment}>Payment</SelectItem>
          <SelectItem value={TransactionsTypeOptions.expense}>Expense</SelectItem>
        </SelectContent>
      </Select>
      <div className="p-2 flex items-center justify-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <DatePickerWithRange date={date} setDate={setDate} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="statement-only" className="text-sm">
                  Filter by statement
                </Label>
                <Switch
                  id="statement-only"
                  checked={filterByStatement}
                  onCheckedChange={setFilterByStatement}
                  disabled={!statement}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hide-credits" className="text-sm">
                  Hide credits
                </Label>
                <Switch
                  id="hide-credits"
                  checked={hideCredits}
                  onCheckedChange={setHideCredits}
                  disabled={!statement}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hide-debits" className="text-sm">
                  Hide debits
                </Label>
                <Switch id="hide-debits" checked={hideDebits} onCheckedChange={setHideDebits} disabled={!statement} />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex-grow"></div>
      <Button variant={"outline"} size="icon" onClick={resetFilters}>
        <RotateCcw />
      </Button>
    </div>
  );
}
