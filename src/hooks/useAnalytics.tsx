import {
  useGetBalanceOverTime,
  useGetCreditsAndDebits,
  useGetDailyBalance,
  useGetFirstFundingDate,
  useGetFirstPaymentDate,
  useGetGroupedFundingTransactions,
  useGetGroupedPaymentTransactions,
  useGetTransactionTotals,
} from "@/lib/api/queries";
import { convertGroupsToPayments, mergeTransactionGroups } from "@/lib/utils";

export function useAnalytics(dealId: string) {
  const { data: dailyBalanceData } = useGetDailyBalance(dealId);
  const { data: balanceByMonthData } = useGetBalanceOverTime(dealId);
  const { data: creditsAndDebitsData } = useGetCreditsAndDebits(dealId);
  const { data: groupedFundingTransactions } = useGetGroupedFundingTransactions(dealId);
  const { data: groupedPaymentTransactions } = useGetGroupedPaymentTransactions(dealId);
  const { data: transactionTotals } = useGetTransactionTotals(dealId);
  const { data: firstFunding } = useGetFirstFundingDate(dealId);
  const { data: firstPayment } = useGetFirstPaymentDate(dealId);

  const numberOfMonths = transactionTotals?.length || 0;

  const totalFunding = transactionTotals?.reduce((sum, t) => sum + (t.funding as number), 0) || 0;
  const totalPayments = transactionTotals?.reduce((sum, t) => sum + (t.payments as number), 0) || 0;
  const totalRevenue = transactionTotals?.reduce((sum, t) => sum + (t.revenue as number), 0) || 0;
  const totalExpenses = transactionTotals?.reduce((sum, t) => sum + (t.expenses as number), 0) || 0;
  const totalTransfers = transactionTotals?.reduce((sum, t) => sum + (t.transfers as number), 0) || 0;
  const averageMonthlyRevenue = totalRevenue / numberOfMonths;
  const averageMonthlyFunding = totalFunding / numberOfMonths;
  const averageMonthlyPayments = totalPayments / numberOfMonths;

  const ratioFundingToRevenue = totalRevenue === 0 ? undefined : totalFunding / totalRevenue;
  const ratioAvgPaymentToAvgFunding =
    averageMonthlyFunding === 0 ? undefined : averageMonthlyPayments / averageMonthlyFunding;
  const ratioAvgPaymentToAvgRevenue =
    averageMonthlyRevenue === 0 ? undefined : averageMonthlyPayments / averageMonthlyRevenue;

  const firstFundingDate = firstFunding?.date || "";
  const firstPaymentDate = firstPayment?.date || "";

  const mergedPaymentGroups = mergeTransactionGroups(groupedPaymentTransactions);
  const mergedFundingGroups = mergeTransactionGroups(groupedFundingTransactions);
  const paymentFrequency = convertGroupsToPayments(mergedPaymentGroups);
  const fundingFrequency = convertGroupsToPayments(mergedFundingGroups);

  const dailyBalance = dailyBalanceData || [];
  const balanceByMonth = balanceByMonthData || [];
  const totalCreditsAndDebits = creditsAndDebitsData || [];

  const netCashFlow = totalRevenue - totalExpenses - totalPayments;
  const negativeBalanceDays = dailyBalance.filter((b) => b.balance < 0).length;
  const totalPaymentTransactions = groupedPaymentTransactions?.reduce((sum, g) => sum + g.count, 0) || 0;
  const averagePaymentSize = totalPayments / totalPaymentTransactions;

  return {
    totalFunding,
    totalPayments,
    totalRevenue,
    totalExpenses,
    totalTransfers,
    averageMonthlyRevenue,
    averageMonthlyFunding,
    averageMonthlyPayments,
    ratioFundingToRevenue,
    ratioAvgPaymentToAvgFunding,
    ratioAvgPaymentToAvgRevenue,
    firstFundingDate,
    firstPaymentDate,
    transactionTotals,
    paymentFrequency,
    fundingFrequency,
    dailyBalance,
    balanceByMonth,
    totalCreditsAndDebits,
    netCashFlow,
    negativeBalanceDays,
    averagePaymentSize,
  };
}
