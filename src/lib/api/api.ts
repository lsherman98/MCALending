import { pb } from "../pocketbase";
import { Collections, type DealsRecord, type TransactionsRecord } from "../pocketbase-types";
import type { UploadStatementData } from "../types";

// DEALS
export async function getDeals() {
    return await pb.collection(Collections.Deals).getFullList();
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
    return await pb.collection(Collections.Statements).create(data);
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
export async function getTransactionsByDealId(dealId: string) {
    return await pb.collection(Collections.Transactions).getFullList({
        filter: `deal = "${dealId}"`,
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