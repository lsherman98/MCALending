import {
  useGetBalanceOverTime,
  useGetCreditsAndDebits,
  useGetDailyBalance,
  useGetFirstFundingDate,
  useGetFirstPaymentDate,
  useGetGroupedFundingTransactions,
  useGetGroupedPaymentTransactions,
  useGetStatementDetails,
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
  const { data: statementDetails } = useGetStatementDetails(dealId);

  const numberOfMonths = transactionTotals?.length || 0;

  const totalFunding = transactionTotals?.reduce((sum, t) => sum + t.funding, 0) || 0;
  const totalPayments = transactionTotals?.reduce((sum, t) => sum + t.payments, 0) || 0;
  const totalRevenue = transactionTotals?.reduce((sum, t) => sum + t.revenue, 0) || 0;
  const totalExpenses = transactionTotals?.reduce((sum, t) => sum + t.expenses, 0) || 0;
  const totalTransfers = transactionTotals?.reduce((sum, t) => sum + t.transfers, 0) || 0;

  const averageMonthlyRevenue = totalRevenue / numberOfMonths;
  const averageMonthlyFunding = totalFunding / numberOfMonths;
  const averageMonthlyPayments = totalPayments / numberOfMonths;

  const ratioFundingToRevenue = totalFunding / totalRevenue;
  const ratioAvgPaymentToAvgFunding = averageMonthlyPayments / averageMonthlyFunding;
  const ratioAvgPaymentToAvgRevenue = averageMonthlyPayments / averageMonthlyRevenue;

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
  const avgDailyBalance = dailyBalance.reduce((sum, b) => sum + b.balance, 0) / dailyBalance.length;
  const negativeBalanceDays = dailyBalance.filter((b) => b.balance < 0).length;
  const totalPaymentTransactions = groupedPaymentTransactions?.reduce((sum, g) => sum + g.count, 0) || 0;
  const averagePaymentSize = totalPayments / totalPaymentTransactions;
  const totalFundingTransactions = groupedFundingTransactions?.reduce((sum, g) => sum + g.count, 0) || 0;
  const averageFundingSize = totalFunding / totalFundingTransactions;
  const fundingToPaymentTime =
    firstFundingDate && firstPaymentDate
      ? new Date(firstPaymentDate).getTime() - new Date(firstFundingDate).getTime()
      : 0;
  const fundingToPaymentDays = Math.ceil(fundingToPaymentTime / (1000 * 60 * 60 * 24));
  const totalOverdraftFees = statementDetails?.reduce((sum, d) => sum + (d.overdraft_fee || 0), 0) || 0;

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
    avgDailyBalance,
    negativeBalanceDays,
    averagePaymentSize,
    averageFundingSize,
    fundingToPaymentDays,
    totalOverdraftFees,
  };
}
