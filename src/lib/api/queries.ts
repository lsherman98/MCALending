import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBalanceOverTime, getChecksVsDebits, getDealById, getDeals, getEndingBalanceOverTime, getFundingAsPercentageOfRevenue, getJobs, getPaymentsVsIncome, getRealRevenue, getRecentDeals, getStatementById, getStatementsByDealId, getStatementUrl, getTransactions } from "./api";
import type { TransactionsTypeOptions } from "../pocketbase-types";

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
export function useGetTransactions(dealId: string, statement?: string, from?: Date, to?: Date, type?: TransactionsTypeOptions[] | "uncategorized") {
    return useQuery({
        queryKey: ["transactions", dealId, statement, from, to, type],
        queryFn: () => getTransactions(dealId, statement, from, to, type),
        placeholderData: keepPreviousData
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
    return useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
        refetchInterval: (query) => {
            const jobs = query.state.data;
            if (jobs && jobs.some((job) => job.status === "PENDING")) {
                return 5000;
            }
            return false;
        }
    });
}