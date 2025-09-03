import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransactionsTypeOptions } from "@/lib/pocketbase-types";
import { useGetTransactionsByDealId } from "@/lib/api/queries";
import { useUpdateTransaction } from "@/lib/api/mutations";
import { DollarSign, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";

// interface Transaction {
//   id: string;
//   date: string;
//   description: string;
//   amount: number;
//   category: string;
//   type: "income" | "expense";
//   account: string;
//   isRecurring?: boolean;
//   recurringGroup?: string;
//   colorCategory?: "none" | "revenue" | "transfer" | "financing";
// }

// interface RecurringGroup {
//   groupName: string;
//   transactions: Transaction[];
//   totalAmount: number;
//   frequency: string;
//   nextDue?: string;
// }

const colorCategories = {
  none: { name: "None", bg: "", border: "", text: "" },
  revenue: {
    name: "Revenue",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-l-4 border-green-500",
    text: "text-green-700 dark:text-green-300",
  },
  transfer: {
    name: "Transfer",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-l-4 border-blue-500",
    text: "text-blue-700 dark:text-blue-300",
  },
  financing: {
    name: "Financing",
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-l-4 border-purple-500",
    text: "text-purple-700 dark:text-purple-300",
  },
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="bg-muted/80 text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
    {children}
  </kbd>
);

export default function Transactions({ dealId }: { dealId: string }) {
  const { data: transactions } = useGetTransactionsByDealId(dealId);
  const updateTransactionMutation = useUpdateTransaction();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [isKeyboardMode, setIsKeyboardMode] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const updateTransactionColor = (id: string, type?: TransactionsTypeOptions) => {
    updateTransactionMutation.mutate({ id, data: { type } });
  };

  const selectedTransaction = isKeyboardMode && transactions ? transactions[selectedRowIndex] : null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((!isKeyboardMode && document.activeElement !== tableRef.current) || !transactions) return;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          setIsKeyboardMode(true);
          setSelectedRowIndex((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowDown":
          event.preventDefault();
          setIsKeyboardMode(true);
          setSelectedRowIndex((prev) => Math.min(transactions.length - 1, prev + 1));
          break;
        case "1":
          event.preventDefault();
          if (isKeyboardMode) {
            updateTransactionColor(transactions[selectedRowIndex].id, TransactionsTypeOptions.revenue);
          }
          break;
        case "2":
          event.preventDefault();
          if (isKeyboardMode) {
            updateTransactionColor(transactions[selectedRowIndex].id, TransactionsTypeOptions.transfer);
          }
          break;
        case "3":
          event.preventDefault();
          if (isKeyboardMode) {
            updateTransactionColor(transactions[selectedRowIndex].id, TransactionsTypeOptions.financing);
          }
          break;
        case "0":
          event.preventDefault();
          if (isKeyboardMode) {
            updateTransactionColor(transactions[selectedRowIndex].id, undefined);
          }
          break;
        case "Escape":
          setIsKeyboardMode(false);
          tableRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [transactions, selectedRowIndex, isKeyboardMode]);

  useEffect(() => {
    if (isKeyboardMode && rowRefs.current[selectedRowIndex]) {
      rowRefs.current[selectedRowIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedRowIndex, isKeyboardMode]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, transactions?.length ?? 0);
  }, [transactions]);
  const handleTableFocus = () => {
    setIsKeyboardMode(true);
  };

  const handleTableBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== tableRef.current) {
        setIsKeyboardMode(false);
      }
    }, 100);
  };

  return (
    <div className="h-full min-w-full flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Transaction History</h1>
            </div>
            {/* <Badge variant="secondary" className="text-sm">
              {transactions?.length || 0} transactions
            </Badge> */}
            <Button variant="outline" className="mb-4">
              <Link to="/analytics/$dealId" params={{ dealId }}>
                Analytics
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">Categories:</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 dark:bg-green-950/30">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium">Revenue (1)</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/30">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium">Transfer (2)</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-purple-50 dark:bg-purple-950/30">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-xs font-medium">Financing (3)</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              Click table • <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> navigate • <Kbd>1</Kbd>-<Kbd>3</Kbd> categorize • <Kbd>ESC</Kbd> exit
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 min-h-0">
        <Tabs defaultValue="all" className="h-full w-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              All Transactions
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Recurring
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col gap-2 min-h-0">
              <Card className="flex-1 flex flex-col min-h-0 py-0">
                {/* <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Transaction Records</CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      {transactions?.length || 0} transactions
                    </Badge>
                  </div>
                </CardHeader> */}
                <CardContent className="flex-1 min-h-0 p-0 w-full">
                  <div
                    ref={tableRef}
                    tabIndex={0}
                    onFocus={handleTableFocus}
                    onBlur={handleTableBlur}
                    className="h-full w-full overflow-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-md"
                  >
                    <Table className="w-full min-w-full">
                      <TableHeader className="sticky top-0 bg-background/95 backdrop-blur border-b">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-semibold w-24">Date</TableHead>
                          <TableHead className="font-semibold min-w-0 flex-1">Description</TableHead>
                          <TableHead className="font-semibold w-28">Reference</TableHead>
                          <TableHead className="font-semibold w-32">Category</TableHead>
                          <TableHead className="text-right font-semibold w-24">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions?.map((transaction, index) => {
                          const colorStyle = colorCategories[transaction.type || "none"];
                          const isSelected = isKeyboardMode && index === selectedRowIndex;
                          return (
                            <TableRow
                              ref={(el) => {
                                rowRefs.current[index] = el;
                              }}
                              key={transaction.id}
                              className={`
                                ${colorStyle.bg} ${colorStyle.border} 
                                hover:bg-muted/50 transition-all duration-200
                                ${
                                  isSelected
                                    ? "bg-primary/10 ring-1 ring-inset ring-primary shadow-sm border-primary/20"
                                    : ""
                                }
                                cursor-pointer box-border
                              `}
                              onClick={() => {
                                setSelectedRowIndex(index);
                                setIsKeyboardMode(true);
                              }}
                            >
                              <TableCell className="font-mono text-sm py-3 w-24">
                                {new Date(transaction.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </TableCell>
                              <TableCell className="font-medium py-3 min-w-0">
                                <div className="max-w-xs truncate" title={transaction.description}>
                                  {transaction.description}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground py-3 w-28">
                                {transaction.trace_number || "—"}
                              </TableCell>
                              <TableCell className="py-3 w-32">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                      transaction.type === "revenue"
                                        ? "bg-green-500"
                                        : transaction.type === "transfer"
                                        ? "bg-blue-500"
                                        : transaction.type === "financing"
                                        ? "bg-purple-500"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="capitalize text-sm truncate">
                                    {transaction.type || "Uncategorized"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono py-3 w-24">
                                <span
                                  className={`font-semibold ${
                                    transaction.amount > 0
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {transaction.amount > 0 ? "+" : ""}${transaction.amount.toFixed(2)}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {selectedTransaction && isKeyboardMode && (
                <Card className="border-l-2 border-primary h-48 flex-shrink-0 py-1 px-1 w-full">
                  <CardContent className="p-1 h-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Transaction Details</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedRowIndex + 1} of {transactions?.length}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsKeyboardMode(false)}
                        className="h-6 w-6 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-medium">Date</div>
                        <div className="font-medium">
                          {new Date(selectedTransaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-muted-foreground font-medium">Reference</div>
                        <div className="font-mono text-muted-foreground">{selectedTransaction.trace_number || "—"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-medium">Description</div>
                        <div className="font-medium text-sm leading-tight">{selectedTransaction.description}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-medium">Amount</div>
                        <div
                          className={`text-lg font-bold font-mono ${
                            selectedTransaction.amount > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {selectedTransaction.amount > 0 ? "+" : ""}${selectedTransaction.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-medium">Category</div>
                        <div className="flex items-center gap-1 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedTransaction.type === "revenue"
                                ? "bg-green-500"
                                : selectedTransaction.type === "transfer"
                                ? "bg-blue-500"
                                : selectedTransaction.type === "financing"
                                ? "bg-purple-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs capitalize">{selectedTransaction.type || "Uncategorized"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="recurring" className="flex-1 min-h-0">
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-8">
                <div className="text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Recurring Transactions</h3>
                  <p className="text-sm">This feature is coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
