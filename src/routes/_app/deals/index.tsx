import { useGetDeals } from "@/lib/api/queries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, BarChart3, Edit, Trash2 } from "lucide-react";
import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import type { DealsResponse } from "@/lib/pocketbase-types";
import { useCreateDeal, useDeleteDeal } from "@/lib/api/mutations";
import { getUserId } from "@/lib/utils";

export const Route = createFileRoute("/_app/deals/")({
  component: RouteComponent,
  staticData: {
    routeName: "Deals",
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const deleteDealMutation = useDeleteDeal();
  const createDealMutation = useCreateDeal();
  const { data: deals } = useGetDeals();
  const { setCurrentDeal } = useCurrentDealStore();

  const handleDealClick = (deal: DealsResponse) => {
    navigate({ to: `/deals/${deal.id}` });
    setCurrentDeal(deal);
  };

  const handleMenuAction = (action: string, deal: DealsResponse, event: React.MouseEvent) => {
    event.stopPropagation();
    switch (action) {
      case "transactions":
        navigate({ to: `/deals/transactions/${deal.id}` });
        break;
      case "analytics":
        navigate({ to: `/deals/analytics/${deal.id}` });
        break;
      case "edit":
        navigate({ to: `/deals/${deal.id}` });
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete deal ${deal.id}?`)) {
          deleteDealMutation.mutate(deal.id);
        }
        break;
    }
  };

  const createDeal = () => {
    createDealMutation.mutate(
      { user: getUserId() || "", title: "New Deal" },
      {
        onSuccess: (data) => {
          setCurrentDeal(data);
          navigate({ to: `/deals/${data.id}` });
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-end">
        <Button variant="outline" onClick={createDeal}>
          New Deal
        </Button>
      </div>
      <Table className="relative">
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead className="min-w-[100px] max-w-[100px]">Id</TableHead>
            <TableHead className="min-w-[150px] max-w-[150px]">Title</TableHead>
            <TableHead className="min-w-[250px] max-w-[250px]">Merchant</TableHead>
            <TableHead className="min-w-[150px] max-w-[150px]">Industry</TableHead>
            <TableHead className="min-w-[150px] max-w-[150px]">Bank</TableHead>
            <TableHead className="min-w-[150px] max-w-[150px]">Credit Score</TableHead>
            <TableHead className="min-w-[150px] max-w-[150px]">State</TableHead>
            <TableHead className="min-w-[150px] max-w-[150px]">Created</TableHead>
            <TableHead className="w-[60px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <div className="max-h-[calc(100vh-140px)] overflow-auto">
        <Table>
          <TableBody>
            {deals?.map((deal) => (
              <TableRow key={deal.id} className="cursor-pointer" onClick={() => handleDealClick(deal)}>
                <TableCell className="min-w-[100px] max-w-[100px]">{deal.id}</TableCell>
                <TableCell className="min-w-[150px] max-w-[150px]">{deal.title}</TableCell>
                <TableCell className="min-w-[250px] max-w-[250px]">{deal.merchant}</TableCell>
                <TableCell className="min-w-[150px] max-w-[150px]">{deal.industry}</TableCell>
                <TableCell className="min-w-[150px] max-w-[150px]">{deal.bank}</TableCell>
                <TableCell className="min-w-[150px] max-w-[150px]">{deal.credit_score}</TableCell>
                <TableCell className="min-w-[150px] max-w-[150px]">{deal.state}</TableCell>
                <TableCell className="min-w-[150px] max-w-[150px]">
                  {new Date(deal.created).toLocaleDateString()}
                </TableCell>
                <TableCell className="w-[60px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleMenuAction("transactions", deal, e)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Transactions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleMenuAction("analytics", deal, e)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleMenuAction("edit", deal, e)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Deal
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleMenuAction("delete", deal, e)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Deal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
