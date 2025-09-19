import { useGetCurrentDeal, useGetRecentDeals } from "@/lib/api/queries";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";
import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import type { DealsResponse } from "@/lib/pocketbase-types";
import { useNavigate } from "@tanstack/react-router";

export function DealSelect({ path }: { path?: string }) {
  const { data: recentDeals } = useGetRecentDeals();
  const { currentDeal, setCurrentDeal, setCurrentDealId } = useCurrentDealStore();
  const { data: currentDealData } = useGetCurrentDeal();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentDealData) {
      setCurrentDeal(currentDealData.expand.deal);
      setCurrentDealId(currentDealData.id);
    }
  }, [currentDealData]);

  const handleDealClick = (deal: DealsResponse) => {
    setCurrentDeal(deal);
    switch (path) {
      case "/deals/$dealId":
        navigate({ to: "/deals/$dealId", params: { dealId: deal.id } });
        break;
      case "/transactions/$dealId":
        navigate({ to: "/transactions/$dealId", params: { dealId: deal.id } });
        break;
      case "/analytics/$dealId":
        navigate({ to: "/analytics/$dealId", params: { dealId: deal.id } });
        break;
      default:
        break;
    }
  };

  return (
    <Select
      value={currentDeal?.id || ""}
      onValueChange={(value) => {
        const deal = recentDeals?.find((d) => d.id === value);
        if (deal) {
          handleDealClick(deal);
        }
      }}
    >
      <SelectTrigger className="w-54">
        <SelectValue placeholder="Select a deal" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Recent Deals</SelectLabel>
          {recentDeals?.map((deal) => (
            <SelectItem key={deal.id} value={deal.id}>
              {deal.title} - #{deal.id}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
