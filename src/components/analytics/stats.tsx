import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { format } from "date-fns";
import { TZDate } from "react-day-picker";

export function Stats({ dealId }: { dealId: string }) {
  const {
    totalFunding,
    totalRevenue,
    totalPayments,
    averageMonthlyFunding,
    averageMonthlyPayments,
    averageMonthlyRevenue,
    ratioAvgPaymentToAvgFunding,
    ratioAvgPaymentToAvgRevenue,
    ratioFundingToRevenue,
    firstFundingDate,
    firstPaymentDate,
    netCashFlow,
  } = useAnalytics(dealId);

  const getColor = (value: number) => {
    return value >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Financing</CardDescription>
          <CardTitle className={getColor(totalFunding)}>{formatCurrency(totalFunding)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Revenue</CardDescription>
          <CardTitle className={getColor(totalRevenue)}>{formatCurrency(totalRevenue)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Payments</CardDescription>
          <CardTitle className={getColor(totalPayments)}>{formatCurrency(totalPayments)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Avg. Revenue</CardDescription>
          <CardTitle className={getColor(averageMonthlyRevenue)}>{formatCurrency(averageMonthlyRevenue)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Avg. Financing</CardDescription>
          <CardTitle className={getColor(averageMonthlyFunding)}>{formatCurrency(averageMonthlyFunding)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Avg. Payment</CardDescription>
          <CardTitle className={getColor(averageMonthlyPayments)}>{formatCurrency(averageMonthlyPayments)}</CardTitle>
        </CardHeader>
      </Card>
      {ratioFundingToRevenue && (
        <Card className="shadow-sm min-w-[200px] py-2">
          <CardHeader className="whitespace-nowrap">
            <CardDescription>% Financing to Revenue</CardDescription>
            <CardTitle className={getColor(ratioFundingToRevenue)}>{formatPercentage(ratioFundingToRevenue)}</CardTitle>
          </CardHeader>
        </Card>
      )}
      {ratioAvgPaymentToAvgFunding && (
        <Card className="shadow-sm min-w-[200px] py-2">
          <CardHeader className="whitespace-nowrap">
            <CardDescription>% Payment to Financing</CardDescription>
            <CardTitle className={getColor(ratioAvgPaymentToAvgFunding)}>
              {formatPercentage(ratioAvgPaymentToAvgFunding)}
            </CardTitle>
          </CardHeader>
        </Card>
      )}
      {ratioAvgPaymentToAvgRevenue && (
        <Card className="shadow-sm min-w-[200px] py-2">
          <CardHeader className="whitespace-nowrap">
            <CardDescription>% Payment to Revenue</CardDescription>
            <CardTitle className={getColor(ratioAvgPaymentToAvgRevenue)}>
              {formatPercentage(ratioAvgPaymentToAvgRevenue)}
            </CardTitle>
          </CardHeader>
        </Card>
      )}
      {firstFundingDate && (
        <Card className="shadow-sm min-w-[200px] py-2">
          <CardHeader className="whitespace-nowrap text-muted-foreground text-sm">
            <CardDescription>First Financing</CardDescription>
            <CardTitle>{format(new TZDate(firstFundingDate, "UTC"), "MMM dd, yyyy")}</CardTitle>
          </CardHeader>
        </Card>
      )}
      {firstPaymentDate && (
        <Card className="shadow-sm min-w-[200px] py-2">
          <CardHeader className="whitespace-nowrap text-muted-foreground text-sm">
            <CardDescription>First Payment</CardDescription>
            <CardTitle>{format(new TZDate(firstPaymentDate, "UTC"), "MMM dd, yyyy")}</CardTitle>
          </CardHeader>
        </Card>
      )}
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Net Cash Flow</CardDescription>
          <CardTitle className={getColor(netCashFlow)}>{formatCurrency(netCashFlow)}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
