import { useGetDeals } from "@/lib/api/queries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_app/deals/")({
  component: RouteComponent,
  staticData: {
    routeName: "Deals",
  },
});

function RouteComponent() {
  const { data: deals } = useGetDeals();
  const navigate = useNavigate();

  return (
    <Table>
      <TableCaption>A list of your deals.</TableCaption>
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
          <TableRow key={deal.id} className="cursor-pointer" onClick={() => navigate({ to: `/deals/${deal.id}` })}>
            <TableCell className="font-medium">{deal.merchant ?? "-"}</TableCell>
            <TableCell>{deal.industry ?? "-"}</TableCell>
            <TableCell>{deal.state ?? "-"}</TableCell>
            <TableCell>{deal.credit_score ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* Optionally add a footer if needed */}
    </Table>
  );
}
