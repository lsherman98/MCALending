import { BarChart3, CreditCard, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";

export function Shortcuts({ pathname, currentDealId }: { pathname: string; currentDealId: string }) {
  const navigate = useNavigate();

  const navigateToDeal = () => {
    navigate({ to: "/deals/$dealId", params: { dealId: currentDealId } });
  };

  const navigateToTransactions = () => {
    navigate({ to: "/transactions/$dealId", params: { dealId: currentDealId } });
  };

  const navigateToAnalytics = () => {
    navigate({ to: "/analytics/$dealId", params: { dealId: currentDealId } });
  };

  return (
    <div className="ml-auto mr-auto flex items-center gap-1">
      <Button
        variant={pathname === `/deals/${currentDealId}` ? "default" : "outline"}
        size="sm"
        onClick={navigateToDeal}
        className="flex items-center gap-1"
      >
        <FileText size={14} />
        Deal
      </Button>
      <Button
        variant={pathname === `/transactions/${currentDealId}` ? "default" : "outline"}
        size="sm"
        onClick={navigateToTransactions}
        className="flex items-center gap-1"
      >
        <CreditCard size={14} />
        Transactions
      </Button>
      <Button
        variant={pathname === `/analytics/${currentDealId}` ? "default" : "outline"}
        size="sm"
        onClick={navigateToAnalytics}
        className="flex items-center gap-1"
      >
        <BarChart3 size={14} />
        Analytics
      </Button>
    </div>
  );
}
