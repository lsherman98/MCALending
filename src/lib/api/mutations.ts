import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DealsRecord } from "../pocketbase-types";
import { createDeal, deleteDeal, updateDeal, uploadStatement } from "./api";
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
        mutationFn: (data: UploadStatementData) => uploadStatement(data),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["statements"] });
        }
    })
}