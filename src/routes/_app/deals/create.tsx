import { CreateDealForm, createDealFormSchema } from "@/components/create-deal-form";
import { FileUpload } from "@/components/file-upload";
import { useCreateDeal, useUpdateDeal, useUploadStatement } from "@/lib/api/mutations";
import { useGetDealById } from "@/lib/api/queries";
import type { Upload } from "@/lib/types";
import { getUserId } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type z from "zod";

export const Route = createFileRoute("/_app/deals/create")({
  component: RouteComponent,
  staticData: {
    routeName: "Create Deal",
  },
});

function RouteComponent() {
  const createDealMutation = useCreateDeal();
  const updateDealMutation = useUpdateDeal();
  const uploadStatementMutation = useUploadStatement();

  const [dealId, setDealId] = useState<string>();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [formDisabled, setFormDisabled] = useState<boolean>(true);

  const { data: deal } = useGetDealById(dealId);

  useEffect(() => {
    if (!dealId) createDeal();
  }, []);

  const createDeal = () => {
    createDealMutation.mutate(
      { user: getUserId() || "" },
      {
        onSuccess: (data) => {
          setDealId(data.id);
        },
      }
    );
  };

  const handleUpdateDeal = (data: z.infer<typeof createDealFormSchema>) => {
    if (!dealId) return;
    updateDealMutation.mutate({
      id: dealId,
      data: {
        address: data.address,
        state: data.state,
        zip_code: data.zipCode,
        credit_score: data.creditScore,
        bank: data.bank,
        founded: data.founded?.toISOString(),
        industry: data.industry,
        merchant: data.merchant,
      },
    });
  };

  const updateStatus = (fileName: string, status: Upload["status"], error?: string) => {
    setUploads((prev) =>
      prev.map((u) => {
        if (u.file.name === fileName) {
          return { ...u, status, error };
        }
        return u;
      })
    );
  };

  const handleUpload = () => {
    uploads.forEach((statement) => {
      const userId = getUserId();
      if (!userId) throw new Error("No logged in user detected.");
      if (!dealId) throw new Error("No deal ID provided.");

      if (statement.status === "pending") {
        updateStatus(statement.file.name, "uploading");
        uploadStatementMutation
          .mutateAsync({
            deal: dealId,
            user: userId,
            file: statement.file,
            filename: statement.file.name,
          })
          .then(() => updateStatus(statement.file.name, "success"))
          .catch((error: Error) => updateStatus(statement.file.name, "error", error.message));
      }
    });
  };

  return (
    <div className="relative flex h-full">
      <div className={`flex-[1.5] px-2`}>
        <FileUpload uploads={uploads} setUploads={setUploads} handleUpload={handleUpload} disabled={!dealId} />
      </div>
      <div className={`flex-[2] px-2`}>
        <CreateDealForm handleUpdateDeal={handleUpdateDeal} disabled={!dealId || formDisabled} deal={deal} />
      </div>
    </div>
  );
}
