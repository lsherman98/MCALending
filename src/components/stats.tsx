import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";

export function Stats({ dealId }: { dealId: string }) {
  return (
    <div className="">
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Total Revenue</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">{}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader className="p-2">
          <CardDescription className="text-xs">Funding as % of Revenue</CardDescription>
          <CardTitle className="text-sm font-semibold tabular-nums @[250px]/card:text-base">{}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
