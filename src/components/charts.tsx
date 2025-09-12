import { useGetBalanceOverTime } from "@/lib/api/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import * as React from "react";
import type { ChartConfig } from "@/components/ui/chart";

export function Charts({ dealId }: { dealId: string }) {
  const { data: balanceOverTime } = useGetBalanceOverTime(dealId);

  const combinedBalanceData = React.useMemo(() => {
    const data =
      balanceOverTime?.map((record) => ({
        date: record.date,
        beginning_balance: record.beginning_balance || 0,
        ending_balance: record.ending_balance || 0,
      })) || [];

    return data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        date: format(new Date(item.date), "MMM dd"),
        fullDate: item.date,
        beginning_balance: item.beginning_balance || 0,
        ending_balance: item.ending_balance || 0,
      }));
  }, [balanceOverTime]);

  // const checksDebitsChartData =
  //   checksVsDebits?.map((record) => ({
  //     date: record.date ? format(new Date(record.date), "MMM dd") : "",
  //     checks: Number(record.debits) || 0,
  //     debits: record.debits || 0,
  //   })) || [];

  const balanceChartConfig: ChartConfig = {
    balances: {
      label: "Balance",
    },
    beginning_balance: {
      label: "Beginning Balance",
      color: "var(--chart-1)",
    },
    ending_balance: {
      label: "Ending Balance",
      color: "var(--chart-2)",
    },
  };

  const checksDebitsChartConfig: ChartConfig = {
    checks: {
      label: "Checks Amount",
      color: "var(--chart-1)",
    },
    debits: {
      label: "Debits Amount",
      color: "var(--chart-2)",
    },
  };

  return (
    <div className="flex h-full gap-2 overflow-hidden">
      <Card className="flex-1 flex flex-col min-w-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-base">Balance Over Time</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex-1 min-h-0">
          <ChartContainer config={balanceChartConfig} className="w-full h-full">
            <AreaChart data={combinedBalanceData}>
              <defs>
                <linearGradient id="fillBeginningBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillEndingBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={32} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      name === "beginning_balance" ? "Beginning Balance" : "Ending Balance",
                    ]}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="beginning_balance"
                type="natural"
                fill="url(#fillBeginningBalance)"
                stroke="var(--color-beginning_balance)"
                stackId="a"
              />
              <Area
                dataKey="ending_balance"
                type="natural"
                fill="url(#fillEndingBalance)"
                stroke="var(--color-ending_balance)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="flex-1 flex flex-col min-w-0">
        <CardHeader className="p-3 pb-2 flex-shrink-0">
          <CardTitle className="text-base">Checks vs Debits</CardTitle>
          <CardDescription className="text-xs">Compare check amounts against debit amounts</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex-1 min-h-0">
          <ChartContainer config={checksDebitsChartConfig} className="w-full h-full">
            <BarChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      name === "checks" ? "Checks Amount" : "Debits Amount",
                    ]}
                  />
                }
              />
              <Bar dataKey="checks" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="debits" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
