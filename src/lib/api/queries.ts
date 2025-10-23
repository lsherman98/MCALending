import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAgents, getAvgDailyBalance, getBalanceOverTime, getCreditsAndDebits, getCurrentDeal, getDailyBalance, getDealById, getDeals, getFirstTransactionDate, getGroupedTransactions, getJobs, getRecentDeals, getStatementById, getStatementsByDealId, getStatementUrl, getTransactions, getTransactionTotals, searchDeals, searchTransactions } from "./api";
import { TransactionsTypeOptions } from "../pocketbase-types";
import { useCurrentDealStore } from "../stores/current-deal-store";
import { QUERY_KEYS } from "../constants";
import {
    standardQueryOptions,
    statementUrlQueryOptions,
    searchQueryOptions,
    refetchOnMountOptions,
    createTransactionsRefetchInterval,
    createJobsRefetchInterval
} from "./query-config";

// DEALS
export function useGetDeals() {
    return useQuery({
        queryKey: QUERY_KEYS.DEALS,
        queryFn: getDeals,
        ...standardQueryOptions
    });
}

export function useGetRecentDeals() {
    return useQuery({
        queryKey: QUERY_KEYS.RECENT_DEALS,
        queryFn: getRecentDeals,
        ...standardQueryOptions
    });
}

export function useGetDealById(id?: string) {
    return useQuery({
        queryKey: QUERY_KEYS.DEAL(id),
        queryFn: () => getDealById(id),
        ...standardQueryOptions
    });
}

export function useSearchDeals(query: string) {
    return useQuery({
        queryKey: QUERY_KEYS.SEARCH_DEALS(query),
        queryFn: () => searchDeals(query),
        ...searchQueryOptions(query),
    });
}

// STATEMENTS
export function useGetStatementsByDealId(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.STATEMENTS(dealId),
        queryFn: () => getStatementsByDealId(dealId),
        ...standardQueryOptions
    });
}

export function useGetStatementById(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.STATEMENT(id),
        queryFn: () => getStatementById(id),
        ...standardQueryOptions
    });
}

export function useGetStatementUrl(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.STATEMENT_URL(id),
        queryFn: () => getStatementUrl(id),
        ...statementUrlQueryOptions
    });
}

export function useGetTransactions(
    dealId: string,
    statement?: string,
    type?: TransactionsTypeOptions[],
    from?: string,
    to?: string,
    hideCredits?: boolean,
    hideDebits?: boolean,
    sortField?: string,
    sortDir?: 'asc' | 'desc'
) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: QUERY_KEYS.TRANSACTIONS(dealId, statement, type, from, to, hideCredits, hideDebits, sortField, sortDir),
        queryFn: () => getTransactions(dealId, statement, type, from, to, hideCredits, hideDebits, sortField, sortDir),
        ...standardQueryOptions,
        ...refetchOnMountOptions,
        refetchInterval: createTransactionsRefetchInterval(queryClient)
    });
}

export function useSearchTransactions(query: string) {
    return useQuery({
        queryKey: QUERY_KEYS.SEARCH_TRANSACTIONS(query),
        queryFn: () => searchTransactions(query),
        ...searchQueryOptions(query),
    });
}

export function useGetAvgDailyBalance(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.AVG_DAILY_BALANCE(dealId),
        queryFn: () => getAvgDailyBalance(dealId),
        ...standardQueryOptions
    });
}

export function useGetDailyBalance(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.DAILY_BALANCE(dealId),
        queryFn: () => getDailyBalance(dealId),
        ...standardQueryOptions
    });
}

export function useGetBalanceOverTime(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.BALANCE_OVER_TIME(dealId),
        queryFn: () => getBalanceOverTime(dealId),
        ...standardQueryOptions
    });
}

export function useGetCreditsAndDebits(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.CREDITS_AND_DEBITS(dealId),
        queryFn: () => getCreditsAndDebits(dealId),
        ...standardQueryOptions
    });
}

export function useGetGroupedFundingTransactions(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.GROUPED_FUNDING_TRANSACTIONS(dealId),
        queryFn: () => getGroupedTransactions(dealId, TransactionsTypeOptions.funding),
        ...standardQueryOptions
    });
}

export function useGetGroupedPaymentTransactions(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.GROUPED_PAYMENT_TRANSACTIONS(dealId),
        queryFn: () => getGroupedTransactions(dealId, TransactionsTypeOptions.payment),
        ...standardQueryOptions
    });
}

export function useGetTransactionTotals(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.TRANSACTION_TOTALS(dealId),
        queryFn: () => getTransactionTotals(dealId),
        ...standardQueryOptions
    });
}

export function useGetFirstFundingDate(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.FIRST_FUNDING_DATE(dealId),
        queryFn: () => getFirstTransactionDate(dealId, TransactionsTypeOptions.funding),
        ...standardQueryOptions
    });
}

export function useGetFirstPaymentDate(dealId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.FIRST_PAYMENT_DATE(dealId),
        queryFn: () => getFirstTransactionDate(dealId, TransactionsTypeOptions.payment),
        ...standardQueryOptions
    });
}

export function useGetJobs() {
    const queryClient = useQueryClient();
    const { currentDeal } = useCurrentDealStore();

    return useQuery({
        queryKey: QUERY_KEYS.JOBS,
        queryFn: getJobs,
        refetchInterval: createJobsRefetchInterval(queryClient, currentDeal?.id)
    });
}

export function useGetCurrentDeal() {
    return useQuery({
        queryKey: QUERY_KEYS.CURRENT_DEAL,
        queryFn: getCurrentDeal,
        ...standardQueryOptions,
        retryDelay: 1000,
        refetchOnWindowFocus: false
    });
}

export function useGetAgents() {
    return useQuery({
        queryKey: QUERY_KEYS.AGENTS,
        queryFn: getAgents,
        ...standardQueryOptions,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
}