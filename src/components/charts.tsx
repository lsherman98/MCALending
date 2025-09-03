import { useGetBalanceOverTime, useGetChecksVsDebits, useGetEndingBalanceOverTime } from "@/lib/api/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";

export function Charts({ dealId }: { dealId: string }) {
  // type BalanceOverTimeRecord<Tdeal = unknown> = {
  //     beginning_balance?: number
  //     date?: IsoDateString
  //     deal?: null | Tdeal
  //     id: string
  // }
  const { data: balanceOverTime } = useGetBalanceOverTime(dealId);

  // type ChecksVsDebitsRecord<Tdeal = unknown, Ttotal_checks_amount = unknown> = {
  //     date?: IsoDateString
  //     deal?: null | Tdeal
  //     id: string
  //     statement?: RecordIdString
  //     total_checks_amount?: null | Ttotal_checks_amount
  //     total_checks_debits?: number
  // }
  const { data: checksVsDebits } = useGetChecksVsDebits(dealId);

  // export type EndingBalanceOverTimeRecord<Tdeal = unknown> = {
  //     date?: IsoDateString
  //     deal?: null | Tdeal
  //     ending_balance?: number
  //     id: string
  // }
  const { data: endingBalanceOverTime } = useGetEndingBalanceOverTime(dealId);

  // Transform data for charts
  const balanceChartData =
    balanceOverTime?.items.map((record) => ({
      date: record.date ? format(new Date(record.date), "MMM dd") : "",
      balance: record.beginning_balance || 0,
    })) || [];

  const checksDebitsChartData =
    checksVsDebits?.items.map((record) => ({
      date: record.date ? format(new Date(record.date), "MMM dd") : "",
      checks: Number(record.total_checks_amount) || 0,
      debits: record.total_checks_debits || 0,
    })) || [];

  const endingBalanceChartData =
    endingBalanceOverTime?.items.map((record) => ({
      date: record.date ? format(new Date(record.date), "MMM dd") : "",
      balance: record.ending_balance || 0,
    })) || [];

  const balanceChartConfig = {
    balance: {
      label: "Beginning Balance",
      color: "hsl(var(--chart-1))",
    },
  };

  const checksDebitsChartConfig = {
    checks: {
      label: "Checks Amount",
      color: "hsl(var(--chart-1))",
    },
    debits: {
      label: "Debits Amount",
      color: "hsl(var(--chart-2))",
    },
  };

  const endingBalanceChartConfig = {
    balance: {
      label: "Ending Balance",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="h-full p-3 overflow-hidden">
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-3 h-full">
        <Card className="flex flex-col min-h-0 max-h-[750px]">
          <CardHeader className="p-3 pb-2 flex-shrink-0">
            <CardTitle className="text-base">Beginning Balance Over Time</CardTitle>
            <CardDescription className="text-xs">Track how your beginning balance changes over time</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-1 min-h-0">
            <ChartContainer config={balanceChartConfig} className="w-full h-full">
              <LineChart data={balanceChartData}>
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
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Beginning Balance"]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-balance)", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Ending Balance Over Time */}
        <Card className="flex flex-col min-h-0 max-h-[750px]">
          <CardHeader className="p-3 pb-2 flex-shrink-0">
            <CardTitle className="text-base">Ending Balance Over Time</CardTitle>
            <CardDescription className="text-xs">Monitor your ending balance trends</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-1 min-h-0">
            <ChartContainer config={endingBalanceChartConfig} className="w-full h-full">
              <AreaChart data={endingBalanceChartData}>
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
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Ending Balance"]}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  fill="var(--color-balance)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Checks vs Debits */}
        <Card className="flex flex-col min-h-0 max-h-[750px]">
          <CardHeader className="p-3 pb-2 flex-shrink-0">
            <CardTitle className="text-base">Checks vs Debits</CardTitle>
            <CardDescription className="text-xs">Compare check amounts against debit amounts</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-1 min-h-0">
            <ChartContainer config={checksDebitsChartConfig} className="w-full h-full">
              <BarChart data={checksDebitsChartData}>
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
                <Bar dataKey="checks" fill="var(--color-checks)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="debits" fill="var(--color-debits)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
