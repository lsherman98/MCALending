import { CloudUploadIcon } from "lucide-react";
import type { FileUploadObj } from "./types";
import { Dropzone, DropZoneArea, DropzoneTrigger, useDropzone } from "@/components/dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function FileUpload({
  uploads,
  setUploads,
  handleUpload,
}: {
  uploads: FileUploadObj[];
  setUploads: React.Dispatch<React.SetStateAction<FileUploadObj[]>>;
  handleUpload: () => void;
}) {
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
      return { valid: false, error: "File is already staged for upload." };
    }

    return { valid: true };
  };

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      const { valid, error } = validateFile(file);

      if (!valid) {
        toast.error("File upload error: " + error);

        return {
          status: "error",
          error: error,
        };
      }

      setUploads((prev) => [
        ...prev,
        {
          file,
          status: "pending",
        },
      ]);

      return {
        status: "success",
        result: file,
      };
    },
  });

  // const handleRemoveUpload = (fileName: string) => {
  //   setUploads((prev) => prev.filter((upload) => upload.file.name !== fileName));
  // };

  return (
    <div className="h-full w-full">
      <Dropzone {...dropzone}>
        <div className="h-full w-full max-h-[calc(100vh-114px)] p-2">
          <DropZoneArea className="h-full w-full">
            {uploads.length === 0 && (
              <DropzoneTrigger className="flex h-full w-full flex-col items-center justify-center bg-transparent text-center text-sm">
                <div className="items-center justify-center flex flex-col gap-2">
                  <CloudUploadIcon className="size-8" />
                  <p className="font-semibold">Upload files</p>
                  <p className="text-sm text-muted-foreground">Click here or drag and drop to upload</p>
                  <p className="text-xs text-muted-foreground">
                    Only pdf files are supported at this time. Max file size is 25MB.
                  </p>
                </div>
              </DropzoneTrigger>
            )}
            {uploads.length > 0 && (
              <div className="flex flex-col h-full gap-3 w-full overflow-y-auto ">
                {uploads.map((upload) => {
                  if (upload.status === "pending") {
                    return <div></div>;
                  } else if (upload.status === "uploading") {
                    return <div></div>;
                  } else if (upload.status === "success") {
                    return <div></div>;
                  } else if (upload.status === "error") {
                    return <div></div>;
                  }
                })}
              </div>
            )}
          </DropZoneArea>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
          <div className="flex justify-end items-center gap-4">
            <input
              type="file"
              multiple
              accept={allowedMimeTypes.join(",")}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  Array.from(files).forEach((file) => {
                    const { valid, error } = validateFile(file);
                    if (!valid) {
                      toast.error("File upload error: " + error);
                    } else {
                      setUploads((prev) => [
                        ...prev,
                        {
                          file,
                          status: "pending",
                        },
                      ]);
                    }
                  });
                }
              }}
              className="hidden"
              id="file-upload-input"
            />
            <Button
              variant={"ghost"}
              onClick={() => {
                const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
                fileInput.click();
              }}
            >
              Add Files
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploads.filter((u) => u.status === "pending").length === 0}
              className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              Start Upload
            </Button>
          </div>
        </div>
      </Dropzone>
    </div>
  );
}
