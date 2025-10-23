import type { QueryClient } from '@tanstack/react-query';

export function scheduleQueryInvalidations(
    queryClient: QueryClient,
    queryKey: unknown[],
    delays: readonly number[]
) {
    delays.forEach((delay) => {
        setTimeout(async () => {
            await queryClient.invalidateQueries({ queryKey });
        }, delay);
    });
}

export const JOB_POLLING_DELAYS = [3000, 4000, 5000] as const;

export function scheduleJobInvalidations(queryClient: QueryClient) {
    scheduleQueryInvalidations(queryClient, ['jobs'], JOB_POLLING_DELAYS);
}
