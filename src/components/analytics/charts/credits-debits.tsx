import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function CreditsDebitsChart({ dealId }: { dealId: string }) {
  const { totalCreditsAndDebits } = useAnalytics(dealId);

  const chartConfig = {
    credits: {
      label: "Credits",
      color: "var(--chart-1)",
    },
    debits: {
      label: "Debits",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  
  return (
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
  );
}
