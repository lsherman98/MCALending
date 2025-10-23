import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DealsRecord, TransactionsRecord } from "../pocketbase-types";
import { bulkUpdateTransaction, createDeal, deleteDeal, deleteStatement, deleteTransaction, updateDeal, updateTransaction, uploadStatement } from "./api";
import { handleError } from "../utils";
import type { UploadStatementData } from "../types";
import { QUERY_KEYS } from "../constants";
import { scheduleJobInvalidations } from "./query-utils";

export function useCreateDeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<DealsRecord, 'id'>) => createDeal(data),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEALS });
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENT_DEALS });
        }
    })
}

export function useUpdateDeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<DealsRecord> }) => updateDeal(id, data),
        onError: handleError,
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEAL(data.id) });
        }
    })
}

export function useDeleteDeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteDeal(id),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEALS });
        }
    })
}

export function useUploadStatement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (statement: UploadStatementData) => uploadStatement(statement),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['statements'] });
            scheduleJobInvalidations(queryClient);
        }
    })
}

export function useDeleteStatement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteStatement(id),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['statements'] });
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
        }
    })
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<TransactionsRecord> }) => updateTransaction(id, data),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    })
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    })
}

export function useBulkUpdateTransactions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ids, data }: { ids: string[], data: Partial<TransactionsRecord> }) => bulkUpdateTransaction(ids, data),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    })
}
