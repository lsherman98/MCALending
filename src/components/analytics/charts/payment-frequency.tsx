import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/lib/utils";

export function PaymentFrequencyChart({ dealId }: { dealId: string }) {
  const { paymentFrequency } = useAnalytics(dealId);

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base">Payment Frequency Analysis</CardTitle>
          <CardDescription className="text-xs">Recurring payment patterns and amounts</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-4">
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {paymentFrequency?.length ? (
            paymentFrequency.map((payment, index) => {
              return (
                <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{(payment.description as string) || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.count} transactions • {payment.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(payment.total as string)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(payment.amount)} avg</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No payment data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
