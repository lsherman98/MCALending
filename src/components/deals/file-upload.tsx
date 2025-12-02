import { CloudUploadIcon, CircleAlert } from "lucide-react";
import { Dropzone, DropZoneArea, DropzoneTrigger, useDropzone } from "@/components/dropzone";
import { toast } from "sonner";
import type { Upload } from "@/lib/types";
import { UploadedFile } from "@/components/deals/uploaded-file";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { StatementsResponse } from "@/lib/pocketbase-types";
import { UploadedStatement } from "./uploaded-statement";
import { useGetAgents } from "@/lib/api/queries";

export function FileUpload({
  uploads,
  setUploads,
  handleUpload,
  disabled,
  statements,
  agentId,
  setAgentId,
}: {
  uploads: Upload[];
  setUploads: React.Dispatch<React.SetStateAction<Upload[]>>;
  handleUpload: () => void;
  disabled?: boolean;
  statements: StatementsResponse[];
  agentId: string;
  setAgentId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data: agents } = useGetAgents();

  const allowedMimeTypes = ["application/pdf"];

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > 25 * 1024 * 1024) {
      return { valid: false, error: "File size is too large. Max file size is 25MB." };
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type. Only .pdf files are supported at this time.",
      };
    }

    if (uploads.some((upload) => upload.file.name === file.name)) {
      return { valid: false, error: "File with the same name is already staged for upload." };
    }

    return { valid: true };
  };

  const processFile = (file: File) => {
    const { valid, error } = validateFile(file);
    if (!valid) {
      toast.error("File upload error: " + error);
      return false;
    }
    setUploads((prev) => [...prev, { file, status: "pending" }]);
    return true;
  };

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      if (!processFile(file)) {
        return { status: "error", error: "Validation failed" };
      }
      return { status: "success", result: file };
    },
  });

  const clearFile = (fileName: string) => {
    setUploads((prev) => prev.filter((upload) => upload.file.name !== fileName));
  };

  const totalFiles = uploads.length;
  const successFiles = uploads.filter((u) => u.status === "success").length;
  const progress = totalFiles === 0 ? 0 : Math.round((successFiles / totalFiles) * 100);

  return (
    <Dropzone {...dropzone}>
      <DropZoneArea
        className={`h-full w-full p-2 ${
          uploads.length === 0 && !statements.length ? "border-2 border-dashed" : "border-2"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        {uploads.length === 0 && statements.length === 0 && (
          <DropzoneTrigger
            className={`flex h-full w-full flex-col items-center justify-center bg-transparent text-center text-sm ${
              disabled ? "pointer-events-none" : ""
            }`}
          >
            <div className="items-center justify-center flex flex-col gap-2">
              <CloudUploadIcon className="size-8" />
              <p className="font-semibold">Upload Bank Statements</p>
              <p className="text-sm text-muted-foreground">Click here or drag and drop to upload</p>
              <p className="text-xs text-muted-foreground">
                Only pdf files are supported at this time. Max file size is 25MB.
              </p>
            </div>
          </DropzoneTrigger>
        )}
        {(uploads.length > 0 || statements.length > 0) && (
          <div className="flex flex-col h-full w-full overflow-y-auto">
            {uploads.map((upload) => (
              <UploadedFile
                key={upload.file.name}
                file={upload.file}
                status={upload.status}
                error={upload.error}
                onClear={() => clearFile(upload.file.name)}
              />
            ))}
            {statements.map((statement) => (
              <UploadedStatement key={statement.id} statement={statement} />
            ))}
            <div className="pt-2 border-t mt-auto flex justify-between gap-2 items-center">
              {uploads.some((u) => u.status === "uploading" || u.status === "success") && (
                <div className="flex items-center min-w-3xs mx-2">
                  <Progress value={progress} />
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {successFiles} / {totalFiles} uploaded
                  </span>
                </div>
              )}
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
                    fileInput.click();
                  }}
                >
                  Add Files
                </Button>
                {uploads.filter((u) => u.status === "pending").length > 0 && (
                  <Select value={agentId} onValueChange={setAgentId}>
                    <SelectTrigger
                      className={`w-[180px] ${!agentId ? "border border-destructive !text-destructive" : ""}`}
                    >
                      {!agentId && <CircleAlert className="text-destructive" />}
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents?.map((agent) => (
                        <SelectItem key={agent.id} value={agent.agent_id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  onClick={handleUpload}
                  disabled={uploads.filter((u) => u.status === "pending").length === 0 || !agentId}
                >
                  Start Upload
                </Button>
              </div>
            </div>
          </div>
        )}
      </DropZoneArea>
      <input
        type="file"
        multiple
        accept={allowedMimeTypes.join(",")}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => processFile(file));
          }
        }}
        className="hidden"
        id="file-upload-input"
      />
    </Dropzone>
  );
}
