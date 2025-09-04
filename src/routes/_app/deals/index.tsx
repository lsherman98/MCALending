import { useGetDeals } from "@/lib/api/queries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import type { DealsResponse } from "@/lib/pocketbase-types";

export const Route = createFileRoute("/_app/deals/")({
  component: RouteComponent,
  staticData: {
    routeName: "Deals",
  },
});

function RouteComponent() {
  const { data: deals } = useGetDeals();
  const navigate = useNavigate();
  const { setCurrentDeal } = useCurrentDealStore();

  const handleDealClick = (deal: DealsResponse) => {
    navigate({ to: `/deals/${deal.id}` });
    setCurrentDeal(deal);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Merchant</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Credit Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deals?.map((deal) => (
          <TableRow key={deal.id} className="cursor-pointer" onClick={() => handleDealClick(deal)}>
            <TableCell className="font-medium">{deal.merchant ?? "-"}</TableCell>
            <TableCell>{deal.industry ?? "-"}</TableCell>
            <TableCell>{deal.state ?? "-"}</TableCell>
            <TableCell>{deal.credit_score ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}