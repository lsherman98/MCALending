import type { FileUploadObj } from "@/lib/types";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/_app/upload")({
  component: Index,
});

function Index() {
  const [uploads, setUploads] = useState<FileUploadObj[]>([]);

  const handleUpload = () => {
    uploads.forEach((upload) => {
      if (upload.status === "pending") {
        setUploads((prev) => prev.map((u) => (u.file.name === upload.file.name ? { ...u, status: "uploading" } : u)));
        // uploadFilesMutation
        //   .mutateAsync(upload)
        //   .then(() => {
        //     setUploads((prev) =>
        //       prev.map((u) => {
        //         if (u.file.name === upload.file.name) {
        //           return { ...u, status: "success" };
        //         }
        //         return u;
        //       }),
        //     );
        //   })
        //   .catch((error: Error) => {
        //     setUploads((prev) =>
        //       prev.map((u) => {
        //         if (u.file.name === upload.file.name) {
        //           return { ...u, status: "error", error: error.message };
        //         }
        //         return u;
        //       }),
        //     );
        //   });
      }
    });
  };

  return (
    // <div>
    //   <FileUpload uploads={uploads} setUploads={setUploads} handleUpload={handleUpload} />
    // </div>
    // <div className="@container/main flex flex-1 flex-col gap-2">
    //   <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    //     <div className="px-4 lg:px-6"></div>
    //   </div>
    // </div>
    <div>upload page</div>
  );
}
