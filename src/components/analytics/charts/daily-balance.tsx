import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function DailyBalanceChart({ dealId }: { dealId: string }) {
  const { dailyBalance } = useAnalytics(dealId);

  const chartConfig = {
    balance: {
      label: "Balance",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
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
  );
}
