import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBalanceOverTime, getChecksVsDebits, getCurrentDeal, getDealById, getDeals, getEndingBalanceOverTime, getFundingAsPercentageOfRevenue, getJobs, getPaymentsVsIncome, getRealRevenue, getRecentDeals, getStatementById, getStatementsByDealId, getStatementUrl, getTransactions, searchDeals, searchTransactions } from "./api";
import { type JobsResponse, type TransactionsTypeOptions } from "../pocketbase-types";
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
            if (jobs?.some((job) => job.status === "CLASSIFY")) {
                return 2000;
            }
            if (query.state.data?.length === 0) {
                return 5000;
            }
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
export function useGetFundingAsPercentageOfRevenue(dealId: string) {
    return useQuery({
        queryKey: ["fundingAsPercentageOfRevenue", dealId],
        queryFn: () => getFundingAsPercentageOfRevenue(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetPaymentsVsIncome(dealId: string) {
    return useQuery({
        queryKey: ["paymentsVsIncome", dealId],
        queryFn: () => getPaymentsVsIncome(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetRealRevenue(dealId: string) {
    return useQuery({
        queryKey: ["realRevenue", dealId],
        queryFn: () => getRealRevenue(dealId),
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

export function useGetChecksVsDebits(dealId: string) {
    return useQuery({
        queryKey: ["checksVsDebits", dealId],
        queryFn: () => getChecksVsDebits(dealId),
        placeholderData: keepPreviousData
    });
}

export function useGetEndingBalanceOverTime(dealId: string) {
    return useQuery({
        queryKey: ["endingBalanceOverTime", dealId],
        queryFn: () => getEndingBalanceOverTime(dealId),
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