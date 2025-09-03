import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDealById, getDeals, getStatementById, getStatementsByDealId, getStatementUrl, getTransactionsByDealId } from "./api";

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