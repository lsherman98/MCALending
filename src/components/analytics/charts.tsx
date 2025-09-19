import { TotalsChart } from "./charts/totals";
import { DailyBalanceChart } from "./charts/daily-balance";
import { MonthlyBalanceChart } from "./charts/monthly-balance";
import { CreditsDebitsChart } from "./charts/credits-debits";
import { TotalsPieChart } from "./charts/totals-pie-chart";
import { PaymentFrequencyChart } from "./charts/payment-frequency";
import { FundingFrequencyChart } from "./charts/funding-frequency";

export function Charts({ dealId }: { dealId: string }) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-2 max-h-[400px]">
        <TotalsChart dealId={dealId} />
        <DailyBalanceChart dealId={dealId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <MonthlyBalanceChart dealId={dealId} />
        <CreditsDebitsChart dealId={dealId} />
        <TotalsPieChart dealId={dealId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <PaymentFrequencyChart dealId={dealId} />
        <FundingFrequencyChart dealId={dealId} />
      </div>
    </div>
  );
}
