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
export async function getTransactions(dealId: string, statement?: string, type?: TransactionsTypeOptions[] | "uncategorized", from?: string, to?: string, hideCredits?: boolean, hideDebits?: boolean, sortField?: string, sortDir?: 'asc' | 'desc') {
    let filter = `deal = "${dealId}"`;
    let sort = '';

    if (statement) filter += ` && statement = "${statement}"`;
    if (type === "uncategorized") filter += ` && (type = "")`;
    else if (type && type.length > 0) filter += ` && type ?= "${type.join('","')}"`;
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
    return await pb.collection(Collections.Transactions).update(id, { ...data, type: data.type || "" });
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
export async function getFundingAsPercentageOfRevenue(deal: string) {
    return await pb.collection(Collections.FundingAsPercentageOfRevenue).getOne(deal);
}

export async function getPaymentsVsIncome(deal: string) {
    return await pb.collection(Collections.PaymentsVsIncome).getOne(deal);
}

export async function getRealRevenue(deal: string) {
    return await pb.collection(Collections.RealRevenueByDeal).getOne(deal);
}

export async function getBalanceOverTime(deal: string) {
    return await pb.collection(Collections.BalanceOverTime).getFullList({
        filter: `deal="${deal}"`
    });
}

export async function getChecksVsDebits(deal: string) {
    return await pb.collection(Collections.ChecksVsDebits).getFullList({
        filter: `deal="${deal}"`
    });
}

export async function getEndingBalanceOverTime(deal: string) {
    return await pb.collection(Collections.EndingBalanceOverTime).getFullList({
        filter: `deal="${deal}"`
    });
}

// JOBS 
export async function getJobs() {
    const now = new Date();
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    const lastWeekISO = lastWeek.toISOString();

    return await pb.collection(Collections.Jobs).getFullList<JobsResponse<ExpandStatement>>({
        filter: `status = "PENDING" || status = "CLASSIFY" || (status = "SUCCESS" && created > "${lastWeekISO}")`,
        expand: "statement"
    });
}
