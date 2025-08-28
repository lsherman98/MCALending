export type FileUploadObj = {
    file: File;
    status: "pending" | "success" | "error" | "uploading";
    error?: string;
};