import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LabelList, Pie, PieChart } from "recharts";

export function TotalsPieChart({ dealId }: { dealId: string }) {
  const {
    totalExpenses,
    totalFunding,
    totalPayments,
    totalRevenue,
    totalTransfers,
  } = useAnalytics(dealId);

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

  const chartData = [
    { category: "expenses", amount: Math.abs(totalExpenses), fill: "var(--color-expense)" },
    { category: "funding", amount: Math.abs(totalFunding), fill: "var(--color-funding-text)" },
    { category: "payments", amount: Math.abs(totalPayments), fill: "var(--color-payment)" },
    { category: "revenue", amount: Math.abs(totalRevenue), fill: "var(--color-revenue-text)" },
    { category: "transfers", amount: Math.abs(totalTransfers), fill: "var(--color-transfer)" },
  ].filter((item) => item.amount > 0);

  return (
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
  );
}
