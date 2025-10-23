import { keepPreviousData } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { JobsResponse } from '../pocketbase-types';
import { REFETCH_INTERVALS, STALE_TIMES } from '../constants';

export const standardQueryOptions = {
    placeholderData: keepPreviousData,
} as const;

export const createTransactionsRefetchInterval = (queryClient: QueryClient) => {
    return (query: { state: { data?: unknown[] } }) => {
        const jobs = queryClient.getQueryData<JobsResponse[]>(['jobs']);

        if (jobs?.some((job) => job.status === 'CLASSIFY')) {
            return REFETCH_INTERVALS.CLASSIFY_JOB;
        }

        if (query.state.data?.length === 0) {
            return REFETCH_INTERVALS.EMPTY_TRANSACTIONS;
        }

        return false;
    };
};

export const createJobsRefetchInterval = (
    queryClient: QueryClient,
    currentDealId?: string
) => {
    return (query: { state: { data?: JobsResponse[] } }) => {
        const jobs = query.state.data;

        if (!jobs) return false;

        if (jobs.some((job) => job.status === 'CLASSIFY')) {
            return REFETCH_INTERVALS.CLASSIFY_JOB;
        }

        if (jobs.some((job) => job.status === 'PENDING')) {
            return REFETCH_INTERVALS.PENDING_JOB;
        }

        if (currentDealId) {
            setTimeout(async () => {
                await queryClient.invalidateQueries({ queryKey: ['deal', currentDealId] });
            }, REFETCH_INTERVALS.JOB_INVALIDATION_DELAY);
        }

        return false;
    };
};

export const statementUrlQueryOptions = {
    staleTime: STALE_TIMES.STATEMENT_URL,
} as const;

export const searchQueryOptions = (query: string) => ({
    enabled: !!query,
});

export const refetchOnMountOptions = {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
} as const;
