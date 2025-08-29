import { pb } from "../pocketbase";
import { Collections, type DealsRecord } from "../pocketbase-types";
import type { UploadStatementData } from "../types";

// DEALS
export function getDeals() {
    return pb.collection(Collections.Deals).getFullList();
}

export function getDealById(id?: string) {
    if (!id) throw new Error("No ID provided");
    return pb.collection(Collections.Deals).getOne(id);
}

export function createDeal(data: Omit<DealsRecord, 'id'>) {
    return pb.collection(Collections.Deals).create(data);
}

export function updateDeal(id: string, data: Partial<DealsRecord>) {
    return pb.collection(Collections.Deals).update(id, data);
}

export function deleteDeal(id: string) {
    return pb.collection(Collections.Deals).delete(id);
}

// STATEMENTS
export function getStatementsByDealId(dealId: string) {
    return pb.collection(Collections.Statements).getFullList({
        filter: `deal = "${dealId}"`,
    })
}

export function getStatementById(id: string) {
    return pb.collection(Collections.Statements).getOne(id);
}

export function uploadStatement(data: UploadStatementData) {
    return pb.collection(Collections.Statements).create(data);
}

export function deleteStatement(id: string) {
    return pb.collection(Collections.Statements).delete(id);
}

export async function getStatementUrl(id: string) {
    const [record, token] = await Promise.all([
        pb.collection(Collections.Statements).getOne(id),
        pb.files.getToken()
    ]);

    return pb.files.getURL(record, record.file, { "token": token });
}

