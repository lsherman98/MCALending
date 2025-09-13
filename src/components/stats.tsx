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
    avgDailyBalance,
    negativeBalanceDays,
    averagePaymentSize,
    averageFundingSize,
    fundingToPaymentDays,
    totalOverdraftFees,
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
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>% Funding to Revenue</CardDescription>
          <CardTitle className={getColor(ratioFundingToRevenue)}>{formatPercentage(ratioFundingToRevenue)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>% Payment to Funding</CardDescription>
          <CardTitle className={getColor(ratioAvgPaymentToAvgFunding)}>
            {formatPercentage(ratioAvgPaymentToAvgFunding)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>% Payment to Revenue</CardDescription>
          <CardTitle className={getColor(ratioAvgPaymentToAvgRevenue)}>
            {formatPercentage(ratioAvgPaymentToAvgRevenue)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap text-muted-foreground text-sm">
          <CardDescription>First Financing</CardDescription>
          {firstFundingDate && <CardTitle>{format(new TZDate(firstFundingDate, "UTC"), "MMM dd, yyyy")}</CardTitle>}
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap text-muted-foreground text-sm">
          <CardDescription>First Payment</CardDescription>
          {firstPaymentDate && <CardTitle>{format(new TZDate(firstPaymentDate, "UTC"), "MMM dd, yyyy")}</CardTitle>}
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Net Cash Flow</CardDescription>
          <CardTitle className={getColor(netCashFlow)}>{formatCurrency(netCashFlow)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Avg. Daily Balance</CardDescription>
          <CardTitle className={getColor(avgDailyBalance)}>{formatCurrency(avgDailyBalance)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Negative Balance Days</CardDescription>
          <CardTitle className={getColor(negativeBalanceDays * -1)}>{negativeBalanceDays}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Avg. Payment Size</CardDescription>
          <CardTitle className={getColor(averagePaymentSize)}>{formatCurrency(averagePaymentSize)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Avg. Funding Size</CardDescription>
          <CardTitle className={getColor(averageFundingSize)}>{formatCurrency(averageFundingSize)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Funding to Payment</CardDescription>
          <CardTitle className={getColor(fundingToPaymentDays)}>{fundingToPaymentDays} days</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-sm min-w-[200px] py-2">
        <CardHeader className="whitespace-nowrap">
          <CardDescription>Overdraft Fees</CardDescription>
          <CardTitle className={getColor(totalOverdraftFees * -1)}>{formatCurrency(totalOverdraftFees)}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
