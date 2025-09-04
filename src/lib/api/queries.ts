import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBalanceOverTime, getChecksVsDebits, getDealById, getDeals, getEndingBalanceOverTime, getFundingAsPercentageOfRevenue, getJobs, getPaymentsVsIncome, getRealRevenue, getStatementById, getStatementsByDealId, getStatementUrl, getTransactionsByDealId } from "./api";

// DEALS
export function useGetDeals() {
    return useQuery({
        queryKey: ["deals"],
        queryFn: getDeals,
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
export function useGetTransactionsByDealId(dealId: string) {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: () => getTransactionsByDealId(dealId),
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
        queryFn: () => getJobs(),
        placeholderData: keepPreviousData,
        refetchInterval: (query) => {
            const jobs = query.state.data;
            if (jobs && jobs.some((job) => job.status === "PENDING")) {
                return 5000;
            }
            return false;
        }
    });
}