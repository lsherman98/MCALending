import type { TransactionsTypeOptions } from '../pocketbase-types';

export interface TransactionFilters {
    dealId: string;
    statement?: string;
    type?: TransactionsTypeOptions[];
    from?: string;
    to?: string;
    hideCredits?: boolean;
    hideDebits?: boolean;
}

export function buildTransactionFilter(filters: TransactionFilters): string {
    const conditions: string[] = [`deal = "${filters.dealId}"`];

    if (filters.type && filters.type.length > 0) {
        conditions.push(`type ?= "${filters.type.join('","')}"`);
    }

    if (filters.statement) {
        conditions.push(`statement = "${filters.statement}"`);
    }

    if (filters.from) {
        conditions.push(`date >= "${filters.from}"`);
    }

    if (filters.to) {
        conditions.push(`date <= "${filters.to}"`);
    }

    if (filters.hideCredits) {
        conditions.push(`amount < 0`);
    }

    if (filters.hideDebits) {
        conditions.push(`amount > 0`);
    }

    return conditions.join(' && ');
}

export function buildTransactionSort(
    sortField?: string,
    sortDir?: 'asc' | 'desc'
): string {
    if (!sortField) {
        return 'date';
    }

    return sortDir === 'asc' ? sortField : `-${sortField}`;
}

export function buildDealFilter(dealId: string): string {
    return `deal = "${dealId}"`;
}

export function buildStatementFilter(dealId: string): string {
    return `deal = "${dealId}"`;
}
