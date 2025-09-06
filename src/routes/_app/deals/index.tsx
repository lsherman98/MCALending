import { useGetDeals } from "@/lib/api/queries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div>
      <Table className="relative">
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Credit Score</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <div className="max-h-[calc(100vh-140px)] overflow-auto">
        <Table>
          <TableBody>
            {deals?.map((deal, idx) => (
              <TableRow key={deal.id} className="cursor-pointer" onClick={() => handleDealClick(deal)}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{deal.merchant}</TableCell>
                <TableCell>{deal.industry}</TableCell>
                <TableCell>{deal.bank}</TableCell>
                <TableCell>{deal.credit_score}</TableCell>
                <TableCell>{deal.state}</TableCell>
                <TableCell>{new Date(deal.created).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
