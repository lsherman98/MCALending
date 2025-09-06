import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/transactions/")({
  component: RouteComponent,
  staticData: {
    routeName: "Transactions",
  },
});

function RouteComponent() {
  const { currentDeal } = useCurrentDealStore();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/transactions/$dealId", params: { dealId: currentDeal?.id || "" } });
  }, [currentDeal]);

  return;
}
