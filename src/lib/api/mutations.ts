import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "../utils";
import { FileUploadObj } from "@/pages/_app/upload.lazy";

export function useUploadBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: FileUploadObj) => uploadBook(file),
        onError: handleError,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    })
}