import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { TransactionsResponse } from "@/lib/pocketbase-types";
import { TransactionsTypeOptions } from "@/lib/pocketbase-types";
import { useBulkUpdateTransactions } from "@/lib/api/mutations";
import { differenceInDays, format } from "date-fns";
import { Badge } from "../ui/badge";
import { AlertTriangle } from "lucide-react";
import { TZDate } from "react-day-picker";

const getRecurrencePattern = (dates: Date[]): string | null => {
  if (dates.length < 3) return null;

  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  const diffs: number[] = [];
  for (let i = 1; i < sortedDates.length; i++) {
    diffs.push(Math.round(differenceInDays(sortedDates[i], sortedDates[i - 1])));
  }

  const isRecurring = (interval: number, tolerance: number) => {
    const consistentDiffs = diffs.filter((d) => Math.abs(d - interval) <= tolerance);
    return consistentDiffs.length / diffs.length >= 0.7;
  };

  if (isRecurring(7, 1)) return "Weekly";
  if (isRecurring(14, 1)) return "Bi-Weekly";
  if (isRecurring(30, 2)) return "Monthly";

  return null;
};

const patternBadgeColors: { [key: string]: string } = {
  Weekly: "border-transparent bg-emerald-100 text-emerald-800",
  "Bi-Weekly": "border-transparent bg-blue-100 text-blue-800",
  Monthly: "border-transparent bg-purple-100 text-purple-800",
};

export function Recurring({ transactions }: { transactions?: TransactionsResponse[] }) {
  const bulkUpdateTransactionMutation = useBulkUpdateTransactions();

  const validTransactions = transactions?.filter((t) => t.date && !isNaN(new Date(t.date).getTime())) || [];

  const recurringGroups = useMemo(() => {
    if (!validTransactions.length) return [];
    const groupedByDescription = validTransactions.reduce((acc, t) => {
      const description = t.description.trim();
      if (!acc[description]) {
        acc[description] = [];
      }
      acc[description].push(t);
      return acc;
    }, {} as Record<string, TransactionsResponse[]>);

    const filteredGroups = Object.entries(groupedByDescription).filter(([, ts]) => ts.length > 1);

    return filteredGroups.map(([description, groupTransactions]) => {
      const validTransactions = groupTransactions.filter((t) => t.date && !isNaN(new Date(t.date).getTime()));
      const dates = validTransactions.map((t) => new Date(t.date));
      const pattern = getRecurrencePattern(dates);
      const sortedTransactions = [...validTransactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const types = [...new Set(validTransactions.map((t) => t.type))];
      const hasUniformType = types.length === 1;
      const sharedType = hasUniformType ? types[0] : null;

      return { description, transactions: sortedTransactions, pattern, hasUniformType, sharedType };
    });
  }, [transactions]);

  const handleGroupTypeUpdate = (transactions: TransactionsResponse[], type: TransactionsTypeOptions) => {
    bulkUpdateTransactionMutation.mutate({
      ids: transactions.map((t) => t.id),
      data: { type },
    });
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-176px)]">
      <Accordion type="single" collapsible className="w-full">
        {recurringGroups.map(
          ({ description, transactions: groupTransactions, pattern, hasUniformType, sharedType }) => (
            <AccordionItem key={description} value={description}>
              <AccordionTrigger className="pr-4">
                <div className="flex justify-between w-full pr-4 items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    {hasUniformType && sharedType ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 bg-${sharedType}`} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        <span className="text-amber-600 text-sm">Mixed Types</span>
                      </div>
                    )}
                    <span className="max-w-md truncate" title={description}>
                      {description}
                    </span>
                    {pattern && (
                      <Badge className={patternBadgeColors[pattern as keyof typeof patternBadgeColors]}>
                        {pattern}
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground">{groupTransactions.length} transactions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/50 rounded-md m-1">
                  <div className="flex items-center gap-4 mb-4">
                    <Label>Set type for all:</Label>
                    <Select
                      onValueChange={(value) =>
                        handleGroupTypeUpdate(groupTransactions, value as TransactionsTypeOptions)
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TransactionsTypeOptions.revenue}>Revenue</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.transfer}>Transfer</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.funding}>Funding</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.payment}>Loan Payment</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.expense}>Business Expense</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.none}>Uncategorized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border rounded-md bg-background">
                    <div className="flex border-b p-2 text-sm font-medium text-muted-foreground">
                      <div className="w-1/4">Date</div>
                      <div className="w-1/4">Type</div>
                      <div className="w-1/4 text-right">Amount</div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {groupTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex border-b p-2 text-sm items-center">
                          <div className="w-1/4">
                            {transaction.date && !isNaN(new Date(transaction.date).getTime())
                              ? format(new TZDate(transaction.date, "UTC"), "MMM dd, yyyy")
                              : "No Date"}
                          </div>
                          <div className="w-1/4 capitalize">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 bg-${transaction.type}`} />
                              <span className="capitalize text-sm">
                                {transaction.type?.replace(/_/g, " ") || "Uncategorized"}
                              </span>
                            </div>
                          </div>
                          <div className="w-1/4 text-right font-mono">${transaction.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
    </div>
  );
}
