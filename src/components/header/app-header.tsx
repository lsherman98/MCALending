import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../mode-toggle";
import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import { useEffect } from "react";
import { Shortcuts } from "./shortcuts";
import { RunningJobs } from "./running-jobs";
import { DealSelect } from "./deal-select";

export function AppHeader() {
  const route = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();
  const match = matches.find((m) => m.pathname === route.pathname + "/" || m.pathname === route.pathname);
  const { currentDeal } = useCurrentDealStore();

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

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 relative">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{match?.staticData.routeName}</h1>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <DealSelect path={match?.fullPath} />
        {currentDeal?.id && <Shortcuts pathname={route.pathname} currentDealId={currentDeal.id} />}
        <div className="ml-auto flex items-center gap-2">
          <RunningJobs />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
