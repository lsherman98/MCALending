import { pb } from "../pocketbase";
import { Collections, TransactionsTypeOptions, type CurrentDealResponse, type DealsRecord, type JobsResponse, type TransactionsRecord } from "../pocketbase-types";
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

// STATEMENTS
export async function getStatementsByDealId(dealId: string) {
    return await pb.collection(Collections.Statements).getFullList({
        filter: `deal = "${dealId}"`,
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
export async function getTransactions(dealId: string, statement?: string, from?: Date, to?: Date, type?: TransactionsTypeOptions[] | "uncategorized") {
    let filter = `deal = "${dealId}"`;

    if (statement) {
        filter += ` && statement = "${statement}"`;
    }

    if (from) {
        filter += ` && created >= "${from.toISOString()}"`;
    }

    if (to) {
        filter += ` && created <= "${to.toISOString()}"`;
    }

    if (type === "uncategorized") {
        filter += ` && (type = "")`;
    } else if (type && type.length > 0) {
        filter += ` && type ?= "${type.join('","')}"`;
    }

    return await pb.collection(Collections.Transactions).getFullList({
        filter: filter,
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
    return await pb.collection(Collections.FundingAsPercentageOfRevenue).getFirstListItem(`deal = "${deal}"`);
}

export async function getPaymentsVsIncome(deal: string) {
    return await pb.collection(Collections.PaymentsVsIncome).getFirstListItem(`deal = "${deal}"`);
}

export async function getRealRevenue(deal: string) {
    return await pb.collection(Collections.RealRevenueByDeal).getFirstListItem(`deal = "${deal}"`);
}

export async function getBalanceOverTime(deal: string) {
    return await pb.collection(Collections.BalanceOverTime).getList(1, 50, {
        filter: `deal = "${deal}"`
    });
}

export async function getChecksVsDebits(deal: string) {
    return await pb.collection(Collections.ChecksVsDebits).getList(1, 50, {
        filter: `deal = "${deal}"`
    });
}

export async function getEndingBalanceOverTime(deal: string) {
    return await pb.collection(Collections.EndingBalanceOverTime).getList(1, 50, {
        filter: `deal = "${deal}"`
    });
}

// JOBS 
export async function getJobs() {
    const now = new Date();
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    const lastWeekISO = lastWeek.toISOString();

    return await pb.collection(Collections.Jobs).getFullList<JobsResponse<ExpandStatement>>({
        filter: `status = "PENDING" || (status = "SUCCESS" && created > "${lastWeekISO}")`,
        expand: "statement"
    });
}
