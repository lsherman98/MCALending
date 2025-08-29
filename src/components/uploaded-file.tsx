import { CheckCircleIcon, LoaderIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { formatFileSize } from "@/lib/utils";

export function UploadedFile({
  file,
  status,
  error,
  onClear,
}: {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  onClear: () => void;
}) {
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
        return <LoaderIcon className="text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircleIcon className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center px-4 py-2 justify-between border-b">
      <div className="flex flex-col">
        <div className="font-medium text-sm">{file.name}</div>
        <div className="text-xs">{formatFileSize(file.size)}</div>
        {status === "error" && error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </div>
      <div className="flex items-center justify-end">
        {status === "error" || status === "pending" ? (
          <Button onClick={onClear} size={"icon"} variant={"ghost"}>
            <Trash />
          </Button>
        ) : (
          getStatusIcon()
        )}
      </div>
    </div>
  );
}
