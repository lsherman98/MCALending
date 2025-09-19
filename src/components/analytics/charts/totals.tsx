import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export function TotalsChart({ dealId }: { dealId: string }) {
  const { transactionTotals, totalExpenses, totalFunding, totalPayments, totalRevenue, totalTransfers } =
    useAnalytics(dealId);

  const [activeLines, setActiveLines] = useState<{ [key: string]: boolean }>({
    expenses: true,
    funding: true,
    payments: true,
    revenue: true,
    transfers: true,
  });

  const lineChartTotals = useMemo(
    () => ({
      expenses: Math.abs(totalExpenses),
      funding: Math.abs(totalFunding),
      payments: Math.abs(totalPayments),
      revenue: Math.abs(totalRevenue),
      transfers: Math.abs(totalTransfers),
    }),
    [totalExpenses, totalFunding, totalPayments, totalRevenue, totalTransfers]
  );

  const toggleLine = (lineKey: string) => {
    setActiveLines((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "var(--chart-1)",
    },
    funding: {
      label: "Funding",
      color: "var(--chart-2)",
    },
    payments: {
      label: "Payments",
      color: "var(--chart-3)",
    },
    revenue: {
      label: "Revenue",
      color: "var(--chart-4)",
    },
    transfers: {
      label: "Transfers",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-2/5 py-0 flex flex-col pt-6">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 flex-shrink-0">
        <div className="flex flex-1 flex-col justify-center px-4 pb-4.5">
          <CardTitle className="text-base">Transaction Totals</CardTitle>
        </div>
        <div className="flex flex-wrap border-t">
          {Object.entries(lineChartTotals).map(([key, total]) => {
            const isActive = activeLines[key];
            return (
              <button
                key={key}
                data-active={isActive}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 px-2 py-2 text-left border-r last:border-r-0 min-w-0"
                onClick={() => toggleLine(key)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[key as keyof typeof chartConfig]?.label}
                </span>
                <span className="text-xs leading-none font-bold">${total.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 py-4 flex-1 overflow-hidden">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={transactionTotals}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {activeLines.expenses && (
              <Line dataKey="expenses" type="monotone" stroke="var(--color-expense)" strokeWidth={2} dot={false} />
            )}
            {activeLines.funding && (
              <Line dataKey="funding" type="monotone" stroke="var(--color-funding-text)" strokeWidth={2} dot={false} />
            )}
            {activeLines.payments && (
              <Line dataKey="payments" type="monotone" stroke="var(--color-payment)" strokeWidth={2} dot={false} />
            )}
            {activeLines.revenue && (
              <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue-text)" strokeWidth={2} dot={false} />
            )}
            {activeLines.transfers && (
              <Line dataKey="transfers" type="monotone" stroke="var(--color-transfer)" strokeWidth={2} dot={false} />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
