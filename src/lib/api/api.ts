import { pb } from "../pocketbase";
import { Collections, TransactionsTypeOptions, type CurrentDealResponse, type DealsRecord, type DealsResponse, type JobsResponse, type TransactionsRecord, type TransactionsResponse } from "../pocketbase-types";
import type { ExpandDeal, ExpandStatement, UploadStatementData } from "../types";
import { getUserId } from "../utils";

// DEALS
export async function getDeals() {
    return await pb.collection(Collections.Deals).getFullList();
}

export async function getRecentDeals() {
    return await pb.collection(Collections.Deals).getList(1, 5, {
        sort: '-updated',
    });
}

export async function getDealById(id?: string) {
    if (!id) throw new Error("No ID provided");
    return await pb.collection(Collections.Deals).getOne(id);
}

export async function createDeal(data: Omit<DealsRecord, 'id'>) {
    return await pb.collection(Collections.Deals).create(data);
}

export async function updateDeal(id: string, data: Partial<DealsRecord>) {
    return await pb.collection(Collections.Deals).update(id, data);
}

export async function deleteDeal(id: string) {
    return await pb.collection(Collections.Deals).delete(id);
}

export const searchDeals = async (query: string) => {
    if (!getUserId()) return
    return await pb.send<DealsResponse[]>(`/api/collections/deals/records/full-text-search?search=${query}`, { method: 'GET' });
}

// STATEMENTS
export async function getStatementsByDealId(dealId: string) {
    return await pb.collection(Collections.Statements).getFullList({
        filter: `deal = "${dealId}"`,
        sort: '-details.date',
    })
}

export async function getStatementById(id: string) {
    return await pb.collection(Collections.Statements).getOne(id);
}

export async function uploadStatement(data: UploadStatementData) {
    return await pb.collection(Collections.Statements).create(data, { requestKey: data.file.name });
}

export async function deleteStatement(id: string) {
    return await pb.collection(Collections.Statements).delete(id);
}

export async function getStatementUrl(id: string) {
    const [record, token] = await Promise.all([
        pb.collection(Collections.Statements).getOne(id),
        pb.files.getToken()
    ]);

    return pb.files.getURL(record, record.file, { "token": token });
}


// TRANSACTIONS
export async function getTransactions(dealId: string, statement?: string, type?: TransactionsTypeOptions[], from?: string, to?: string, hideCredits?: boolean, hideDebits?: boolean, sortField?: string, sortDir?: 'asc' | 'desc') {
    let filter = `deal = "${dealId}"`;
    let sort = '';

    if (type && type.length > 0) filter += ` && type ?= "${type.join('","')}"`;
    if (statement) filter += ` && statement = "${statement}"`;
    if (from) filter += ` && date >= "${from}"`;
    if (to) filter += ` && date <= "${to}"`;
    if (hideCredits) filter += ` && amount < 0`;
    if (hideDebits) filter += ` && amount > 0`;

    if (sortField) {
        sort = (sortDir === 'asc' ? '' : '-') + sortField;
    }

    return await pb.collection(Collections.Transactions).getFullList({
        filter: filter,
        sort: sort || 'date',
    });
}

export async function updateTransaction(id: string, data: Partial<TransactionsRecord>) {
    return await pb.collection(Collections.Transactions).update(id, data);
}

export async function deleteTransaction(id: string) {
    return await pb.collection(Collections.Transactions).delete(id);
}

export async function bulkUpdateTransaction(ids: string[], data: Partial<TransactionsRecord>) {
    const batch = pb.createBatch()
    ids.forEach(id => {
        batch.collection(Collections.Transactions).update(id, { ...data, type: data.type || "" });
    });
    return await batch.send();
}

export const searchTransactions = async (query: string) => {
    if (!getUserId()) return
    return await pb.send<TransactionsResponse[]>(`/api/collections/transactions/records/full-text-search?search=${query}`, { method: 'GET' });
}

//CURRENT DEAL
export async function getCurrentDeal() {
    return await pb.collection(Collections.CurrentDeal).getFirstListItem<CurrentDealResponse<ExpandDeal>>(`user = "${getUserId()}"`, {
        expand: 'deal'
    });
}

export async function updateCurrentDeal(currentDealId: string, dealId: string) {
    await pb.collection(Collections.CurrentDeal).update(currentDealId, {
        deal: dealId
    });
}

// ANALYTICS
export async function getAvgDailyBalance(deal: string) {
    return await pb.collection(Collections.AvgDailyBalance).getFullList({
        filter: `deal="${deal}"`,
        sort: "month"
    });
}

export async function getStatementDetails(deal: string) {
    return await pb.collection(Collections.StatementDetails).getFullList({
        filter: `deal="${deal}"`,
    });
}

export async function getDailyBalance(deal: string) {
    return await pb.collection(Collections.DailyBalance).getFullList({
        filter: `deal="${deal}"`,
        sort: "date"
    });
}

export async function getBalanceOverTime(deal: string) {
    return await pb.collection(Collections.BalanceOverTime).getFullList({
        filter: `deal="${deal}"`,
        sort: "date"
    });
}

export async function getCreditsAndDebits(deal: string) {
    return await pb.collection(Collections.CreditsAndDebits).getFullList({
        filter: `deal="${deal}"`,
        sort: "date"
    });
}

export async function getGroupedTransactions(deal: string, type: TransactionsTypeOptions.funding | TransactionsTypeOptions.payment) {
    return await pb.collection(Collections.GroupedTransactions).getFullList({
        filter: `deal="${deal}" && type="${type}"`
    });
}

export async function getTransactionTotals(deal: string) {
    return await pb.collection(Collections.TotalsByMonth).getFullList({
        filter: `deal="${deal}"`,
        sort: "date"
    });
}

export async function getFirstTransactionDate(deal: string, type: TransactionsTypeOptions.payment | TransactionsTypeOptions.funding) {
    return await pb.collection(Collections.Transactions).getFirstListItem(`deal="${deal}" && type="${type}"`, {
        sort: 'date'
    });
}


// JOBS 
export async function getJobs() {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const lastHourISO = lastHour.toISOString();

    return await pb.collection(Collections.Jobs).getFullList<JobsResponse<ExpandStatement & ExpandDeal>>({
        filter: `status = "PENDING" || status = "CLASSIFY" || (status = "SUCCESS" && created > "${lastHourISO}")`,
        expand: "statement,deal"
    });
}
