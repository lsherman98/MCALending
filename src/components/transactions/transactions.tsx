import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsTypeOptions } from "@/lib/pocketbase-types";
import { useGetTransactions, useSearchTransactions } from "@/lib/api/queries";
import { useUpdateTransaction } from "@/lib/api/mutations";
import { DollarSign, FileText } from "lucide-react";
import type { StatementsResponse } from "@/lib/pocketbase-types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSidebar } from "../ui/sidebar";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Recurring } from "./recurring";
import { Filters } from "./filters";
import { Legend } from "./legend";
import { TableHeader } from "./table-header";
import { RowContent } from "./row-content";
import { Instructions } from "./instructions";
import { TransactionCard } from "./transaction-card";

export default function Transactions({ dealId, statement }: { dealId: string; statement?: StatementsResponse }) {
  const [row, setRow] = useState(0);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [filterByStatement, setFilterByStatement] = useState(false);
  const [hideCredits, setHideCredits] = useState(false);
  const [hideDebits, setHideDebits] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TransactionsTypeOptions | undefined>(undefined);
  const [date, setDate] = useState<DateRange | undefined>({ from: undefined, to: undefined });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("transactions");
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const type = !typeFilter ? undefined : [typeFilter];
  const from = date?.from;
  const to = date?.to;
  const toEndOfDay = to ? new Date(to.getTime() + 86399999) : undefined;
  const fromDate = from ? format(from, "yyyy-MM-dd HH:mm:ss") : undefined;
  const toDate = toEndOfDay ? format(toEndOfDay, "yyyy-MM-dd HH:mm:ss") : undefined;
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  const { open } = useSidebar();
  const { data: transactionsData } = useGetTransactions(
    dealId,
    filterByStatement ? statement?.id : undefined,
    type,
    fromDate,
    toDate,
    hideCredits,
    hideDebits,
    sortField,
    sortDir
  );
  const { data: searchResults } = useSearchTransactions(searchQuery);
  const updateTransactionMutation = useUpdateTransaction();
  const transactions = (searchQuery ? searchResults : transactionsData) || [];
  const transaction = transactions[row];

  const rowVirtualizer = useVirtualizer({
    count: transactions?.length ?? 0,
    estimateSize: () => 48,
    getScrollElement: () => parentRef.current,
    overscan: 20,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isKeyboardMode && !["ArrowUp", "ArrowDown"].includes(e.key)) return;
      const id = transaction.id;

      switch (e.key) {
        case "ArrowUp":
          setIsKeyboardMode(true);
          setRow((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowDown":
          setIsKeyboardMode(true);
          setRow((prev) => Math.min(transactions.length - 1, prev + 1));
          break;
        case "1":
          updateTransactionMutation.mutate({ id, data: { type: TransactionsTypeOptions.revenue } });
          break;
        case "2":
          updateTransactionMutation.mutate({ id, data: { type: TransactionsTypeOptions.transfer } });
          break;
        case "3":
          updateTransactionMutation.mutate({ id, data: { type: TransactionsTypeOptions.funding } });
          break;
        case "4":
          updateTransactionMutation.mutate({ id, data: { type: TransactionsTypeOptions.payment } });
          break;
        case "5":
          updateTransactionMutation.mutate({ id, data: { type: TransactionsTypeOptions.expense } });
          break;
        case "0":
          updateTransactionMutation.mutate({ id, data: { type: TransactionsTypeOptions.none } });
          break;
        case "Escape":
          setIsKeyboardMode(false);
          tableRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isKeyboardMode, row, transactions, updateTransactionMutation]);

  useEffect(() => {
    if (isKeyboardMode && rowRefs.current[row]) {
      rowRefs.current[row]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [row, isKeyboardMode]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, transactions?.length ?? 0);
  }, [transactions]);

  useEffect(() => {
    if (activeTab === "transactions") {
      const timer = setTimeout(() => {
        rowVirtualizer.measure();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, rowVirtualizer]);

  const handleTableBlur = () => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const transactionCard = document.querySelector("[data-transaction-details-card]");
      if (transactionCard && transactionCard.contains(activeElement)) return;
      if (activeElement !== tableRef.current) setIsKeyboardMode(false);
    }, 100);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full w-full flex flex-col">
          <Filters
            statement={statement}
            filterByStatement={filterByStatement}
            hideCredits={hideCredits}
            hideDebits={hideDebits}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            setFilterByStatement={setFilterByStatement}
            setHideCredits={setHideCredits}
            setHideDebits={setHideDebits}
            setSortField={setSortField}
            setSortDir={setSortDir}
            date={date}
            setDate={setDate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div className="flex items-center justify-between w-full">
            <TabsList>
              <TabsTrigger value="transactions" className="flex text-xs items-center gap-2">
                <FileText />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="recurring" className="flex text-xs items-center gap-2">
                <DollarSign />
                Recurring
              </TabsTrigger>
            </TabsList>
            <Legend />
          </div>
          <TabsContent value="transactions" className="space-y-2">
            <div
              ref={tableRef}
              tabIndex={0}
              onFocus={() => setIsKeyboardMode(true)}
              onBlur={handleTableBlur}
              className="focus-visible:outline-none"
            >
              <div className="border border-border rounded-md overflow-hidden">
                <TableHeader sortField={sortField} sortDir={sortDir} handleSort={handleSort} open={open} />
                <div
                  ref={parentRef}
                  className={`overflow-auto overflow-x-hidden ${
                    transaction && isKeyboardMode ? "max-h-[calc(100vh-410px)]" : "max-h-[calc(100vh-268px)]"
                  }`}
                >
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((vr) => {
                      const transaction = transactions?.[vr.index];
                      if (!transaction) return null;
                      const selected = isKeyboardMode && vr.index === row;

                      return (
                        <div
                          key={transaction.id}
                          ref={(el) => (rowRefs.current[vr.index] = el as any)}
                          className={`
                            absolute top-0 left-0 w-full h-[48px] flex border-b hover:bg-blue-50 transition-colors cursor-pointer
                            border-l-6 border-l-${transaction.type} ${selected ? "bg-blue-50" : ""}
                          `}
                          onClick={() => {
                            setRow(vr.index);
                            setIsKeyboardMode(true);
                          }}
                          style={{ transform: `translateY(${vr.start}px)` }}
                        >
                          <RowContent transaction={transaction} selected={selected} open={open} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <Instructions />
            {transaction && isKeyboardMode && (
              <TransactionCard transaction={transaction} setIsKeyboardMode={setIsKeyboardMode} />
            )}
          </TabsContent>
          <TabsContent value="recurring" className={`mt-2 ${!open ? "min-w-[934px]" : "min-w-[774px]"}`}>
            {transactions ? <Recurring transactions={transactions} /> : "loading..."}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
