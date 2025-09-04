import type { DealsResponse, StatementsRecord } from "./pocketbase-types";

export type Upload = {
    file: File;
    status: "pending" | "success" | "error" | "uploading";
    error?: string;
};

export type UploadStatementData = Omit<StatementsRecord, 'file' | 'id'> & { file: File; id?: string };

export type ExpandDeal = {
    deal: DealsResponse
}
