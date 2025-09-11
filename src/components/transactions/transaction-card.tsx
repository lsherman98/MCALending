import { TransactionsTypeOptions, type TransactionsRecord, type TransactionsResponse } from "@/lib/pocketbase-types";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit2, Save, Trash2, X, XCircle } from "lucide-react";
import { useDeleteTransaction, useUpdateTransaction } from "@/lib/api/mutations";
import { useState } from "react";
import { TZDate } from "react-day-picker";
import { format } from "date-fns";

export function TransactionCard({
  transaction,
  setIsKeyboardMode,
}: {
  transaction: TransactionsResponse;
  setIsKeyboardMode: (value: boolean) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<TransactionsRecord>>();

  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!transaction) return;
    const date = new Date(transaction.date).toISOString().split("T")[0];
    setIsEditMode(true);
    setEditFormData({
      description: transaction.description,
      amount: transaction.amount,
      date: date,
      trace_number: transaction.trace_number,
      type: transaction.type,
    });
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!transaction || !editFormData) return;
    updateTransactionMutation.mutate({
      id: transaction.id,
      data: {
        description: editFormData.description,
        amount: editFormData.amount,
        date: editFormData.date,
        trace_number: editFormData.trace_number,
        type: editFormData.type,
      },
    });
    setIsEditMode(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditMode(false);
    setEditFormData({
      description: "",
      amount: undefined,
      date: undefined,
      trace_number: undefined,
      type: undefined,
    });
  };

  const handleDeleteTransaction = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (transaction && window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactionMutation.mutate(transaction.id);
      setIsEditMode(false);
    }
  };

  return (
    <Card className="py-1 px-1 pl-4 rounded-sm min-h-[134px]" data-transaction-details-card>
      <CardContent className="p-1">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex text-md items-center gap-4">
              {!isEditMode ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground text-sm">Category</div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full bg-${transaction.type}`} />
                      <span className="capitalize">{transaction.type || "Uncategorized"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground text-sm">Date</div>
                    <div>{format(new TZDate(transaction.date, "UTC"), "MMM dd, yyyy")}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground text-sm">Amount</div>
                    <div
                      className={`font-bold font-mono ${
                        transaction.amount > 0 ? "text-revenue-text" : "text-expense-text"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground text-sm">Reference</div>
                    <div className="font-mono">{transaction.trace_number || "—"}</div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="edit-type" className="text-sm w-21 flex-shrink-0">
                      Category
                    </Label>
                    <Select
                      value={editFormData?.type}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, type: value as TransactionsTypeOptions })
                      }
                    >
                      <SelectTrigger id="edit-type" className="h-8 w-36">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TransactionsTypeOptions.none}>Uncategorized</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.revenue}>Revenue</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.transfer}>Transfer</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.funding}>Funding</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.payment}>Loan Payment</SelectItem>
                        <SelectItem value={TransactionsTypeOptions.expense}>Business Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="edit-date" className="text-sm w-21 flex-shrink-0">
                      Date
                    </Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editFormData?.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="h-8 w-36"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="edit-amount" className="text-sm w-21 flex-shrink-0">
                      Amount
                    </Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      inputMode="decimal"
                      value={editFormData?.amount}
                      onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.valueAsNumber })}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="h-8 w-36"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="edit-reference" className="text-sm w-21 flex-shrink-0">
                      Reference
                    </Label>
                    <Input
                      id="edit-reference"
                      type="text"
                      inputMode="numeric"
                      value={editFormData?.trace_number}
                      onChange={(e) => setEditFormData({ ...editFormData, trace_number: e.target.valueAsNumber })}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="h-8 w-36"
                    />
                  </div>
                </div>
              )}
            </div>
            {!isEditMode ? (
              <div className="space-y-1">
                <div className="text-muted-foreground text-sm">Description</div>
                <div className="leading-tight text-xs">{transaction.description}</div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Label htmlFor="edit-description" className="text-sm">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={editFormData?.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="h-8 w-154"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {!isEditMode ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsKeyboardMode(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleEditClick} className="h-8 w-8 p-0">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-8 w-8 p-0">
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={updateTransactionMutation.isPending}
                  className="h-8 w-8 p-0"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteTransaction}
                  disabled={deleteTransactionMutation.isPending}
                  className="h-8 w-8 p-0 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
