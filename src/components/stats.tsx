import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetFundingAsPercentageOfRevenue, useGetPaymentsVsIncome, useGetRealRevenue } from "@/lib/api/queries";

export function Stats({ dealId }: { dealId: string }) {
  const { data: fundingAsPercentageOfRevenue } = useGetFundingAsPercentageOfRevenue(dealId);
  const { data: paymentsVsIncome } = useGetPaymentsVsIncome(dealId);
  const { data: realRevenue } = useGetRealRevenue(dealId);

  const formatCurrency = (value: string | number | undefined) => {
    if (!value) return "$0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numValue);
  };

  const formatPercentage = (value: string | number | undefined) => {
    if (!value) return "0%";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return `${numValue.toFixed(2)}%`;
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 px-3 py-2 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Total Revenue</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">
            {formatCurrency(fundingAsPercentageOfRevenue?.total_revenue as string)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Total Real Revenue</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">
            {formatCurrency(realRevenue?.real_revenue as string)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Total Financing</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">
            {formatCurrency(fundingAsPercentageOfRevenue?.total_financing as string)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Funding as % of Revenue</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">
            {formatPercentage(fundingAsPercentageOfRevenue?.funding_as_percentage_of_revenue as string)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Avg. Monthly Income</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">
            {formatCurrency(paymentsVsIncome?.avg_monthly_income as string)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Avg. Monthly Payment</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">
            {formatCurrency(paymentsVsIncome?.avg_monthly_payment as string)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Payment to Income Ratio</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">
            {formatPercentage(paymentsVsIncome?.payment_to_income_percentage as string)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
