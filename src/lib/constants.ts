export const QUERY_KEYS = {
    DEALS: ['deals'] as const,
    RECENT_DEALS: ['recentDeals'] as const,
    DEAL: (id?: string) => ['deal', id] as const,
    SEARCH_DEALS: (query: string) => ['searchDeals', query] as const,
    CURRENT_DEAL: ['currentDeal'] as const,
    STATEMENTS: (dealId: string) => ['statements', dealId] as const,
    STATEMENT: (id: string) => ['statement', id] as const,
    STATEMENT_URL: (id: string) => ['statementUrl', id] as const,

    TRANSACTIONS: (
        dealId: string,
        statement?: string,
        type?: string[],
        from?: string,
        to?: string,
        hideCredits?: boolean,
        hideDebits?: boolean,
        sortField?: string,
        sortDir?: 'asc' | 'desc'
    ) =>
        [
            'transactions',
            dealId,
            statement,
            type,
            from,
            to,
            hideCredits,
            hideDebits,
            sortField,
            sortDir,
        ] as const,
    SEARCH_TRANSACTIONS: (query: string) => ['searchTransactions', query] as const,

    AVG_DAILY_BALANCE: (dealId: string) => ['avgDailyBalance', dealId] as const,
    DAILY_BALANCE: (dealId: string) => ['dailyBalance', dealId] as const,
    BALANCE_OVER_TIME: (dealId: string) => ['balanceOverTime', dealId] as const,
    CREDITS_AND_DEBITS: (dealId: string) => ['totalCreditsAndDebits', dealId] as const,
    GROUPED_FUNDING_TRANSACTIONS: (dealId: string) =>
        ['groupedFundingTransactions', dealId] as const,
    GROUPED_PAYMENT_TRANSACTIONS: (dealId: string) =>
        ['groupedPaymentTransactions', dealId] as const,
    TRANSACTION_TOTALS: (dealId: string) => ['transactionTotals', dealId] as const,
    FIRST_FUNDING_DATE: (dealId: string) => ['firstFundingDate', dealId] as const,
    FIRST_PAYMENT_DATE: (dealId: string) => ['firstPaymentDate', dealId] as const,

    JOBS: ['jobs'] as const,

    AGENTS: ['agents'] as const,
} as const;

export const REFETCH_INTERVALS = {
    CLASSIFY_JOB: 2000,
    PENDING_JOB: 5000,
    EMPTY_TRANSACTIONS: 5000,
    JOB_INVALIDATION_DELAY: 2000,
} as const;

export const STALE_TIMES = {
    STATEMENT_URL: 60000,
} as const;

export const AUTH_CONSTANTS = {
    REDIRECT_PARAM: 'redirect',
} as const;

export const TRANSACTION_CONSTANTS = {
    CHUNK_SIZE: 15,
    DEFAULT_SORT_FIELD: 'date',
} as const;

export const PAYMENT_FREQUENCY_THRESHOLDS = {
    DAILY: 1.5,
    EVERY_FEW_DAYS: 3.5,
    WEEKLY: 8,
    BI_WEEKLY: 16,
    MONTHLY: 35,
    QUARTERLY: 95,
} as const;

export const FILE_SIZE = {
    KILOBYTE: 1024,
    MEGABYTE: 1024 * 1024,
} as const;

export const CURRENCY_FORMAT = {
    LOCALE: 'en-US',
    CURRENCY: 'USD',
} as const;

export const VALIDATION = {
    MIN_DESCRIPTION_LENGTH: 3,
    MIN_TRANSACTIONS_FOR_FREQUENCY: 2,
} as const;
