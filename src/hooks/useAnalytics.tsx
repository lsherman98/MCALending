import {
  useGetAvgDailyBalance,
  useGetBalanceOverTime,
  useGetDailyBalance,
  useGetFirstFundingDate,
  useGetFirstPaymentDate,
  useGetGroupedFundingTransactions,
  useGetGroupedPaymentTransactions,
  useGetTotalCreditsAndDebits,
  useGetTransactionTotals,
} from "@/lib/api/queries";
import { convertGroupsToPayments, mergeTransactionGroups } from "@/lib/utils";

export function useAnalytics({ dealId }: { dealId: string }) {
  const { data: avgDailyBalance } = useGetAvgDailyBalance(dealId);
  const { data: dailyBalance } = useGetDailyBalance(dealId);
  const { data: balanceOverTime } = useGetBalanceOverTime(dealId);
  const { data: totalCreditsAndDebits } = useGetTotalCreditsAndDebits(dealId);
  const { data: groupedFundingTransactions } = useGetGroupedFundingTransactions(dealId);
  const { data: groupedPaymentTransactions } = useGetGroupedPaymentTransactions(dealId);
  const { data: transactionTotals } = useGetTransactionTotals(dealId);
  const { data: firstFunding } = useGetFirstFundingDate(dealId);
  const { data: firstPayment } = useGetFirstPaymentDate(dealId);

  const numberOfMonths = transactionTotals?.length || 0;

  const totalFunding = transactionTotals?.reduce((sum, t) => sum + t.funding, 0) || 0;
  const totalPayments = transactionTotals?.reduce((sum, t) => sum + t.payments, 0) || 0;
  const totalRevenue = transactionTotals?.reduce((sum, t) => sum + t.revenue, 0) || 0;

  const averageMonthlyRevenue = totalRevenue / numberOfMonths;
  const averageMonthlyFunding = totalFunding / numberOfMonths;
  const averageMonthlyPayments = totalPayments / numberOfMonths;

  const ratioFundingToRevenue = totalFunding / totalRevenue;
  const ratioAvgPaymentToAvgFunding = averageMonthlyPayments / averageMonthlyFunding;
  const ratioAvgPaymentToAvgRevenue = averageMonthlyPayments / averageMonthlyRevenue;

  const firstFundingDate = firstFunding?.date || null;
  const firstPaymentDate = firstPayment?.date || null;

  const mergedPaymentGroups = mergeTransactionGroups(groupedPaymentTransactions);
  const paymentFrequency = convertGroupsToPayments(mergedPaymentGroups);

  return {};
}
