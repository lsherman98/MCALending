"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--chart-1)",
  },
  beginning_balance: {
    label: "Beginning Balance",
    color: "var(--chart-1)",
  },
  ending_balance: {
    label: "Ending Balance",
    color: "var(--chart-2)",
  },
  credits: {
    label: "Credits",
    color: "var(--chart-1)",
  },
  debits: {
    label: "Debits",
    color: "var(--chart-2)",
  },
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

export function Charts({ dealId }: { dealId: string }) {
  const {
    transactionTotals,
    paymentFrequency,
    fundingFrequency,
    dailyBalance,
    balanceByMonth,
    totalCreditsAndDebits,
    totalExpenses,
    totalFunding,
    totalPayments,
    totalRevenue,
    totalTransfers,
  } = useAnalytics(dealId);

  const [activeLines, setActiveLines] = React.useState<{ [key: string]: boolean }>({
    expenses: true,
    funding: true,
    payments: true,
    revenue: true,
    transfers: true,
  });

  const chartData = [
    { category: "expenses", amount: Math.abs(totalExpenses), fill: "var(--color-expense)" },
    { category: "funding", amount: Math.abs(totalFunding), fill: "var(--color-funding-text)" },
    { category: "payments", amount: Math.abs(totalPayments), fill: "var(--color-payment)" },
    { category: "revenue", amount: Math.abs(totalRevenue), fill: "var(--color-revenue-text)" },
    { category: "transfers", amount: Math.abs(totalTransfers), fill: "var(--color-transfer)" },
  ].filter((item) => item.amount > 0);

  const lineChartTotals = React.useMemo(
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

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-2 max-h-[400px]">
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
                  <Line
                    dataKey="funding"
                    type="monotone"
                    stroke="var(--color-funding-text)"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {activeLines.payments && (
                  <Line dataKey="payments" type="monotone" stroke="var(--color-payment)" strokeWidth={2} dot={false} />
                )}
                {activeLines.revenue && (
                  <Line
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-revenue-text)"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {activeLines.transfers && (
                  <Line
                    dataKey="transfers"
                    type="monotone"
                    stroke="var(--color-transfer)"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="w-3/5 flex flex-col pb-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b flex-shrink-0">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base">Daily Balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-1 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                accessibilityLayer
                data={dailyBalance}
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
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      formatter={(value) => [`Balance $${Number(value).toLocaleString()}`]}
                    />
                  }
                />
                <Area
                  dataKey="balance"
                  type="natural"
                  fill="var(--color-balance)"
                  fillOpacity={0.4}
                  stroke="var(--color-balance)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="w-full">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base">Monthly Balance</CardTitle>
              <CardDescription className="text-xs">Beginning vs ending balance by month</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                accessibilityLayer
                data={balanceByMonth}
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
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short" });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Area
                  dataKey="beginning_balance"
                  type="natural"
                  fill="var(--color-beginning_balance)"
                  fillOpacity={0.4}
                  stroke="var(--color-beginning_balance)"
                  stackId="a"
                />
                <Area
                  dataKey="ending_balance"
                  type="natural"
                  fill="var(--color-ending_balance)"
                  fillOpacity={0.4}
                  stroke="var(--color-ending_balance)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base">Credits vs Debits Over Time</CardTitle>
              <CardDescription className="text-xs">Monthly credits and debits breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={totalCreditsAndDebits}
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
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short" });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dashed"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar dataKey="credits" fill="var(--color-credits)" radius={4} />
                <Bar dataKey="debits" fill="var(--color-debits)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="w-full p-0">
          <CardContent className="h-full flex items-center justify-center p-0">
            <ChartContainer config={chartConfig} className="aspect-square h-full w-full max-h-[450px]">
              <PieChart>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0];
                    const categoryKey = data.payload.category as keyof typeof chartConfig;
                    const label = chartConfig[categoryKey]?.label || categoryKey;
                    const total = chartData.reduce((sum, item) => sum + item.amount, 0);
                    const percentage = ((Number(data.value) / total) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">${Number(data.value).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{percentage}%</p>
                      </div>
                    );
                  }}
                />
                <Pie data={chartData} dataKey="amount">
                  <LabelList
                    dataKey="category"
                    className="fill-background"
                    stroke="none"
                    fontSize={10}
                    formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                        <p className="text-sm font-medium truncate">{payment.description as string || "Unknown"}</p>
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
        <Card className="w-full">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base">Funding Frequency Analysis</CardTitle>
              <CardDescription className="text-xs">Recurring funding patterns and amounts</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {fundingFrequency?.length ? (
                fundingFrequency.map((funding, index) => {
                  return (
                    <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{funding.description as string || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {funding.count} transactions • {funding.frequency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(funding.total as string)}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(funding.amount)} avg</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No funding data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
