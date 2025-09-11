import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../mode-toggle";
import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import { useGetCurrentDeal, useGetRecentDeals } from "@/lib/api/queries";
import type { DealsResponse } from "@/lib/pocketbase-types";
import { useEffect } from "react";
import { Shortcuts } from "./shortcuts";
import { RunningJobs } from "./running-jobs";

export function AppHeader() {
  const route = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();
  const match = matches.find((m) => m.pathname === route.pathname + "/" || m.pathname === route.pathname);
  const { data: recentDeals } = useGetRecentDeals();
  const { currentDeal, setCurrentDeal, setCurrentDealId } = useCurrentDealStore();
  const { data: currentDealData } = useGetCurrentDeal();

  useEffect(() => {
    if (currentDealData) {
      setCurrentDeal(currentDealData.expand.deal);
      setCurrentDealId(currentDealData.id);
    }
  }, [currentDealData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentDeal?.id) return;
      if ((event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey) {
        switch (event.key) {
          case "1":
            event.preventDefault();
            navigate({ to: "/deals/$dealId", params: { dealId: currentDeal.id } });
            break;
          case "2":
            event.preventDefault();
            navigate({ to: "/transactions/$dealId", params: { dealId: currentDeal.id } });
            break;
          case "3":
            event.preventDefault();
            navigate({ to: "/analytics/$dealId", params: { dealId: currentDeal.id } });
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentDeal?.id, navigate]);

  const handleDealClick = (deal: DealsResponse) => {
    setCurrentDeal(deal);
    switch (match?.fullPath) {
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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 relative">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{match?.staticData.routeName}</h1>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Select
          value={currentDeal?.id || ""}
          onValueChange={(value) => {
            const deal = recentDeals?.items?.find((d) => d.id === value);
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
              {recentDeals?.items?.map((deal) => (
                <SelectItem key={deal.id} value={deal.id}>
                  {deal.title} - #{deal.id}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {currentDeal?.id && <Shortcuts pathname={route.pathname} currentDealId={currentDeal.id} />}
        <div className="ml-auto flex items-center gap-2">
          <RunningJobs />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
