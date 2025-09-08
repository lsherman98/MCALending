import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DealsRecord, TransactionsRecord } from "../pocketbase-types";
import { bulkUpdateTransaction, createDeal, deleteDeal, deleteStatement, updateDeal, updateTransaction, uploadStatement } from "./api";
import { handleError } from "../utils";
import type { UploadStatementData } from "../types";

// DEALS
export function useCreateDeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<DealsRecord, 'id'>) => createDeal(data),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["deals"] });
            await queryClient.invalidateQueries({ queryKey: ["recentDeals"] });
        }
    })
}

export function useUpdateDeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<DealsRecord> }) => updateDeal(id, data),
        onError: handleError,
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ["deal", data.id] });
        }
    })
}

export function useDeleteDeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteDeal(id),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["deals"] });
        }
    })
}

// STATEMENTS
export function useUploadStatement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (statement: UploadStatementData) => uploadStatement(statement),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["statements"] });
            setTimeout(async () => {
                await queryClient.invalidateQueries({ queryKey: ["jobs"] });
            }, 3000);
            setTimeout(async () => {
                await queryClient.invalidateQueries({ queryKey: ["jobs"] });
            }, 4000);
            setTimeout(async () => {
                await queryClient.invalidateQueries({ queryKey: ["jobs"] });
            }, 5000);
        }
    })
}

export function useDeleteStatement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteStatement(id),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["statements"] });
            await queryClient.invalidateQueries({ queryKey: ["jobs"] });
        }
    })
}

// TRANSACTIONS
export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<TransactionsRecord> }) => updateTransaction(id, data),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        }
    })
}

export function useBulkUpdateTransactions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ids, data }: { ids: string[], data: Partial<TransactionsRecord> }) => bulkUpdateTransaction(ids, data),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        }
    })
}
