import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function MonthlyBalanceChart({ dealId }: { dealId: string }) {
  const { balanceByMonth } = useAnalytics(dealId);

  const chartConfig = {
    beginning_balance: {
      label: "Beginning Balance",
      color: "var(--chart-1)",
    },
    ending_balance: {
      label: "Ending Balance",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
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
  );
}
