import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAgents, getAvgDailyBalance, getBalanceOverTime, getCreditsAndDebits, getCurrentDeal, getDailyBalance, getDealById, getDeals, getFirstTransactionDate, getGroupedTransactions, getJobs, getRecentDeals, getStatementById,  getStatementsByDealId, getStatementUrl, getTransactions, getTransactionTotals, searchDeals, searchTransactions } from "./api";
import { TransactionsTypeOptions, type JobsResponse } from "../pocketbase-types";
import { useCurrentDealStore } from "../stores/current-deal-store";

// DEALS
export function useGetDeals() {
    return useQuery({
        queryKey: ["deals"],
        queryFn: getDeals,
        placeholderData: keepPreviousData
    });
}

export function useGetRecentDeals() {
    return useQuery({
        queryKey: ["recentDeals"],
        queryFn: getRecentDeals,
        placeholderData: keepPreviousData
    });
}

export function useGetDealById(id?: string) {
    return useQuery({
        queryKey: ["deal", id],
        queryFn: () => getDealById(id),
        placeholderData: keepPreviousData
    });
}

export function useSearchDeals(query: string) {
    return useQuery({
        queryKey: ['searchDeals', query],
        queryFn: () => searchDeals(query),
        enabled: !!query,
    });
}

// STATEMENTS
export function useGetStatementsByDealId(dealId: string) {
    return useQuery({
        queryKey: ["statements", dealId],
        queryFn: () => getStatementsByDealId(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetStatementById(id: string) {
    return useQuery({
        queryKey: ["statement", id],
        queryFn: () => getStatementById(id),
        placeholderData: keepPreviousData
    });
}

export function useGetStatementUrl(id: string) {
    return useQuery({
        queryKey: ["statementUrl", id],
        queryFn: () => getStatementUrl(id),
        staleTime: 60000
    });
}

// TRANSACTIONS
export function useGetTransactions(dealId: string, statement?: string, type?: TransactionsTypeOptions[], from?: string, to?: string, hideCredits?: boolean, hideDebits?: boolean, sortField?: string, sortDir?: 'asc' | 'desc') {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["transactions", dealId, statement, type, from, to, hideCredits, hideDebits, sortField, sortDir],
        queryFn: () => getTransactions(dealId, statement, type, from, to, hideCredits, hideDebits, sortField, sortDir),
        placeholderData: keepPreviousData,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchInterval: (query) => {
            const jobs = queryClient.getQueryData<JobsResponse[]>(["jobs"]);
            if (jobs?.some((job) => job.status === "CLASSIFY")) return 2000;
            if (query.state.data?.length === 0) return 5000;
            return false;
        }
    });
}

export function useSearchTransactions(query: string) {
    return useQuery({
        queryKey: ['searchTransactions', query],
        queryFn: () => searchTransactions(query),
        enabled: !!query,
    });
}

//ANALYTICS
export function useGetAvgDailyBalance(dealId: string) {
    return useQuery({
        queryKey: ["avgDailyBalance", dealId],
        queryFn: () => getAvgDailyBalance(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetDailyBalance(dealId: string) {
    return useQuery({
        queryKey: ["dailyBalance", dealId],
        queryFn: () => getDailyBalance(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetBalanceOverTime(dealId: string) {
    return useQuery({
        queryKey: ["balanceOverTime", dealId],
        queryFn: () => getBalanceOverTime(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetCreditsAndDebits(dealId: string) {
    return useQuery({
        queryKey: ["totalCreditsAndDebits", dealId],
        queryFn: () => getCreditsAndDebits(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetGroupedFundingTransactions(dealId: string) {
    return useQuery({
        queryKey: ["groupedFundingTransactions", dealId],
        queryFn: () => getGroupedTransactions(dealId, TransactionsTypeOptions.funding),
        placeholderData: keepPreviousData
    });
}

export function useGetGroupedPaymentTransactions(dealId: string) {
    return useQuery({
        queryKey: ["groupedPaymentTransactions", dealId],
        queryFn: () => getGroupedTransactions(dealId, TransactionsTypeOptions.payment),
        placeholderData: keepPreviousData
    });
}

export function useGetTransactionTotals(dealId: string) {
    return useQuery({
        queryKey: ["transactionTotals", dealId],
        queryFn: () => getTransactionTotals(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetFirstFundingDate(dealId: string) {
    return useQuery({
        queryKey: ["firstFundingDate", dealId],
        queryFn: () => getFirstTransactionDate(dealId, TransactionsTypeOptions.funding),
        placeholderData: keepPreviousData
    });
}

export function useGetFirstPaymentDate(dealId: string) {
    return useQuery({
        queryKey: ["firstPaymentDate", dealId],
        queryFn: () => getFirstTransactionDate(dealId, TransactionsTypeOptions.payment),
        placeholderData: keepPreviousData
    });
}

// JOBS
export function useGetJobs() {
    const queryClient = useQueryClient();
    const { currentDeal } = useCurrentDealStore();

    return useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
        refetchInterval: (query) => {
            const jobs = query.state.data;
            if (jobs && jobs.some((job) => job.status === "CLASSIFY")) {
                return 2000;
            }
            if (jobs && jobs.some((job) => job.status === "PENDING")) {
                return 5000;
            }
            setTimeout(async () => {
                await queryClient.invalidateQueries({ queryKey: ["deal", currentDeal?.id] });
            }, 2000);
            return false;
        }
    });
}

// CURRENT_DEAL
export function useGetCurrentDeal() {
    return useQuery({
        queryKey: ["currentDeal"],
        queryFn: getCurrentDeal,
        placeholderData: keepPreviousData,
        retryDelay: 1000,
        refetchOnWindowFocus: false
    });
}

// AGENTS
export function useGetAgents() {
    return useQuery({
        queryKey: ["agents"],
        queryFn: getAgents,
        placeholderData: keepPreviousData,
        refetchInterval: false, 
        refetchIntervalInBackground: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
}