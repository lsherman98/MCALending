import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import { useGetCurrentDeal, useGetJobs, useGetRecentDeals } from "@/lib/api/queries";
import type { DealsResponse } from "@/lib/pocketbase-types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CircleCheckBig, CloudAlert, File, ListCheck, LoaderCircle } from "lucide-react";
import type { ExpandStatement } from "@/lib/types";
import { useEffect } from "react";

export function SiteHeader() {
  const route = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();
  const match = matches.find((m) => m.pathname === route.pathname + "/" || m.pathname === route.pathname);
  const { data: recentDeals } = useGetRecentDeals();
  const { currentDeal, setCurrentDeal, setCurrentDealId } = useCurrentDealStore();
  const { data: jobs } = useGetJobs();
  const { data: currentDealData } = useGetCurrentDeal();
  const extractionInProgress = jobs?.some((job) => job.status === "PENDING");

  useEffect(() => {
    if (currentDealData) {
      setCurrentDeal(currentDealData.expand.deal);
      setCurrentDealId(currentDealData.id);
    }
  }, [currentDealData]);

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
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
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
        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger className="text-xs italic" asChild>
              {extractionInProgress ? (
                <Button variant="outline" size={"icon"} className="">
                  <LoaderCircle className="animate-spin text-blue-500" />
                </Button>
              ) : (
                <Button variant="outline" size={"icon"} className="">
                  <ListCheck />
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={12} alignOffset={-36}>
              <div className="text-xs italic">Extractions</div>
              <Separator className="mt-2 mb-4" />
              {jobs?.map((job) => (
                <div key={job.id} className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <File size={12} />
                    <span className="text-xs">{(job.expand as ExpandStatement).statement.filename}</span>
                  </div>
                  {job.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <div className="text-xs italic">Extracting...</div>
                      <LoaderCircle size={18} className="animate-spin text-blue-500" />
                    </div>
                  )}
                  {job.status === "SUCCESS" && <CircleCheckBig size={18} className="text-green-500" />}
                  {job.status === "ERROR" && <CloudAlert size={18} className="text-red-500" />}
                </div>
              ))}
            </PopoverContent>
          </Popover>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
