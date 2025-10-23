import type { TransactionsResponse } from "@/lib/pocketbase-types";
import { format } from "date-fns";
import { TZDate } from "react-day-picker";

export function RowContent({
  transaction,
  selected,
  open,
}: {
  transaction: TransactionsResponse;
  selected: boolean;
  open: boolean;
}) {
  return (
    <>
      <div
        className={`flex-shrink-0 w-26 px-3 py-3 border-r font-mono text-xs flex items-center whitespace-nowrap overflow-hidden ${
          selected ? "text-primary font-bold" : ""
        }`}
      >
        <span className="truncate">{transaction.date ? format(new TZDate(transaction.date, "UTC"), "MMM dd, yyyy") : "No Date"}</span>
      </div>
      <div
        className={`flex-shrink-0 px-3 py-3 border-r flex items-center whitespace-nowrap overflow-hidden ${
          selected ? "text-primary font-bold" : "font-medium"
        } ${open ? "w-100" : "w-140"}`}
      >
        <span className="text-sm truncate" title={transaction.description}>
          {transaction.description}
        </span>
      </div>
      <div className="flex-shrink-0 w-32 px-3 py-3 border-r flex items-center whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 bg-${transaction.type}`} />
          <span
            className={`text-xs text-muted-foreground truncate ${selected ? "text-primary font-bold" : "font-medium"}`}
          >
            {transaction.type === "expense" && "Expense"}
            {transaction.type === "payment" && "Payment"}
            {transaction.type === "funding" && "Funding"}
            {transaction.type === "transfer" && "Transfer"}
            {transaction.type === "revenue" && "Revenue"}
            {transaction.type === "none" && "Uncategorized"}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 w-28 px-3 py-3 text-xs flex items-center justify-start whitespace-nowrap overflow-hidden">
        <span
          className={`font-bold truncate ${Number(transaction.amount) > 0 ? "text-revenue-text" : "text-expense-text"}`}
          title={`${Number(transaction.amount) > 0 ? "+" : ""}$${Number(transaction.amount).toFixed(2)}`}
        >
          {Number(transaction.amount) > 0 ? "+" : ""}${Number(transaction.amount).toFixed(2)}
        </span>
      </div>
    </>
  );
}
