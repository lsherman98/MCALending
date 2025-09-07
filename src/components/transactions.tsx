import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TransactionsTypeOptions } from "@/lib/pocketbase-types";
import { useGetTransactions } from "@/lib/api/queries";
import { useUpdateTransaction } from "@/lib/api/mutations";
import { DollarSign, FileText, X } from "lucide-react";
import { Kbd } from "./kbd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import type { StatementsResponse } from "@/lib/pocketbase-types";
import { Switch } from "./ui/switch";

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

const transactionColors = {
  revenue: {
    bg: "bg-green-500",
    text: "text-green-600",
    keyboard: "bg-green-50",
    rowBg: "bg-green-50",
    border: "border-l-4 border-green-500",
    rowText: "text-green-700",
  },
  transfer: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    keyboard: "bg-blue-50",
    rowBg: "bg-blue-50",
    border: "border-l-4 border-blue-500",
    rowText: "text-blue-700",
  },
  funding: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    keyboard: "bg-purple-50",
    rowBg: "bg-purple-50",
    border: "border-l-4 border-purple-500",
    rowText: "text-purple-700",
  },
  loan_payment: {
    bg: "bg-yellow-500",
    text: "text-yellow-600",
    keyboard: "bg-yellow-50",
    rowBg: "bg-yellow-50 ",
    border: "border-l-4 border-yellow-500",
    rowText: "text-yellow-700",
  },
  business_expense: {
    bg: "bg-red-500",
    text: "text-red-600",
    keyboard: "bg-red-50",
    rowBg: "bg-red-50 ",
    border: "border-l-4 border-red-500",
    rowText: "text-red-700",
  },
  none: {
    bg: "bg-gray-300",
    text: "text-gray-600",
    keyboard: "",
    rowBg: "",
    border: "",
    rowText: "",
  },
};

export default function Transactions({ dealId, statement }: { dealId: string; statement?: StatementsResponse }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [isKeyboardMode, setIsKeyboardMode] = useState<boolean>(false);
  const [showStatementOnly, setShowStatementOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TransactionsTypeOptions | "all" | "uncategorized">("all");

  const type = typeFilter === "all" ? undefined : typeFilter === "uncategorized" ? "uncategorized" : [typeFilter];
  const statementId = statement?.id;

  const { data: transactions } = useGetTransactions(
    dealId,
    showStatementOnly ? statementId : undefined,
    type
  );
  const updateTransactionMutation = useUpdateTransaction();

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
            updateTransactionColor(transactions[selectedRowIndex].id, TransactionsTypeOptions.funding);
          }
          break;
        case "4":
          event.preventDefault();
          if (isKeyboardMode) {
            updateTransactionColor(transactions[selectedRowIndex].id, TransactionsTypeOptions.loan_payment);
          }
          break;
        case "5":
          event.preventDefault();
          if (isKeyboardMode) {
            updateTransactionColor(transactions[selectedRowIndex].id, TransactionsTypeOptions.business_expense);
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
    <div className="flex flex-col gap-2 h-full">
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="transactions" className="h-full w-full flex flex-col">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <FileText />
                All Transactions
              </TabsTrigger>
              <TabsTrigger value="recurring" className="flex items-center gap-2">
                <DollarSign />
                Recurring
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4 pr-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="statement-only"
                  checked={showStatementOnly}
                  onCheckedChange={setShowStatementOnly}
                  disabled={!statement}
                />
                <Label htmlFor="statement-only" className="text-xs">
                  Statement Only
                </Label>
              </div>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value={"uncategorized"}>Uncategorized</SelectItem>
                  <SelectItem value={TransactionsTypeOptions.revenue}>Revenue</SelectItem>
                  <SelectItem value={TransactionsTypeOptions.transfer}>Transfer</SelectItem>
                  <SelectItem value={TransactionsTypeOptions.funding}>Funding</SelectItem>
                  <SelectItem value={TransactionsTypeOptions.loan_payment}>Loan Payment</SelectItem>
                  <SelectItem value={TransactionsTypeOptions.business_expense}>Business Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsContent value="transactions" className="space-y-2 mt-2">
            <div className="flex items-center justify-between pr-2 gap-2">
              <div className="flex items-center gap-1">
                <div className={`flex items-center gap-2 px-2 py-1 rounded ${transactionColors.revenue.keyboard}`}>
                  <Kbd>1</Kbd>
                  <div className={`w-1.5 h-1.5 ${transactionColors.revenue.bg} rounded-full`}></div>
                  <span className="text-xs text-muted-foreground">Revenue</span>
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 rounded ${transactionColors.transfer.keyboard}`}>
                  <Kbd>2</Kbd>
                  <div className={`w-1.5 h-1.5 ${transactionColors.transfer.bg} rounded-full`}></div>
                  <span className="text-xs text-muted-foreground">Transfer</span>
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 rounded ${transactionColors.funding.keyboard}`}>
                  <Kbd>3</Kbd>
                  <div className={`w-1.5 h-1.5 ${transactionColors.funding.bg} rounded-full`}></div>
                  <span className="text-xs text-muted-foreground">Funding</span>
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 rounded ${transactionColors.loan_payment.keyboard}`}>
                  <Kbd>4</Kbd>
                  <div className={`w-1.5 h-1.5 ${transactionColors.loan_payment.bg} rounded-full`}></div>
                  <span className="text-xs text-muted-foreground">Loan Payment</span>
                </div>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded ${transactionColors.business_expense.keyboard}`}
                >
                  <Kbd>5</Kbd>
                  <div className={`w-1.5 h-1.5 ${transactionColors.business_expense.bg} rounded-full`}></div>
                  <span className="text-xs text-muted-foreground">Business Expense</span>
                </div>
              </div>
            </div>
            <div
              ref={tableRef}
              tabIndex={0}
              onFocus={handleTableFocus}
              onBlur={handleTableBlur}
              className="focus-visible:outline-none"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold w-24">Date</TableHead>
                    <TableHead className="font-semibold min-w-0 flex-1">Description</TableHead>
                    <TableHead className="font-semibold w-28">Reference</TableHead>
                    <TableHead className="font-semibold w-32">Category</TableHead>
                    <TableHead className="text-right font-semibold w-24">Amount</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div
                className={`overflow-auto ${
                  selectedTransaction && isKeyboardMode ? "max-h-[calc(100vh-388px)]" : "max-h-[calc(100vh-254px)]"
                }`}
              >
                <Table>
                  <TableBody>
                    {transactions?.map((transaction, index) => {
                      const colorStyle = transactionColors[transaction.type || "none"];
                      const isSelected = isKeyboardMode && index === selectedRowIndex;
                      return (
                        <TableRow
                          ref={(el) => {
                            rowRefs.current[index] = el;
                          }}
                          key={transaction.id}
                          className={`
                                ${colorStyle.rowBg} ${colorStyle.border} 
                                ${isSelected ? "bg-secondary border-l-4 border-l-primary" : ""}
                                cursor-pointer 
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
                                  transactionColors[transaction.type || "none"].bg
                                }`}
                              />
                              {transaction.type === "business_expense" && (
                                <span className="text-xs text-muted-foreground">Business Expense</span>
                              )}
                              {transaction.type === "loan_payment" && (
                                <span className="text-xs text-muted-foreground">Loan Payment</span>
                              )}
                              {transaction.type === "funding" && (
                                <span className="text-xs text-muted-foreground">Funding</span>
                              )}
                              {transaction.type === "transfer" && (
                                <span className="text-xs text-muted-foreground">Transfer</span>
                              )}
                              {transaction.type === "revenue" && (
                                <span className="text-xs text-muted-foreground">Revenue</span>
                              )}
                              {!transaction.type && (
                                <span className="text-xs text-muted-foreground">Uncategorized</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono py-3 w-24">
                            <span
                              className={`font-semibold ${
                                transaction.amount > 0
                                  ? transactionColors.revenue.text
                                  : transactionColors.business_expense.text
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
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                navigate •<Kbd>0</Kbd>-<Kbd>5</Kbd>
                categorize •<Kbd>ESC</Kbd>
                exit
              </div>
            </div>
            {selectedTransaction && isKeyboardMode && (
              <Card className="py-1 px-1 pl-4 rounded-sm min-h-[126px]">
                <CardContent className="p-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-md items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-muted-foreground text-sm">Category</div>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              transactionColors[selectedTransaction.type || "none"].bg
                            }`}
                          />
                          <span className="capitalize">{selectedTransaction.type || "Uncategorized"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-muted-foreground text-sm">Date</div>
                        <div>
                          {new Date(selectedTransaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-muted-foreground text-sm">Amount</div>
                        <div
                          className={`font-bold font-mono ${
                            selectedTransaction.amount > 0
                              ? transactionColors.revenue.text
                              : transactionColors.business_expense.text
                          }`}
                        >
                          {selectedTransaction.amount > 0 ? "+" : ""}${selectedTransaction.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-muted-foreground text-sm">Reference</div>
                        <div className="font-mono">{selectedTransaction.trace_number || "—"}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsKeyboardMode(false)}>
                      <X />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">Description</div>
                    <div className="leading-tight">{selectedTransaction.description}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="recurring">
            <Card className="h-full flex items-center justify-center">
              <CardContent className="h-full text-center p-8">
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
