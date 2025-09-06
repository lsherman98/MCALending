import { CreateDealForm, createDealFormSchema } from "@/components/create-deal-form";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useUpdateDeal, useUploadStatement } from "@/lib/api/mutations";
import { useGetDealById, useGetStatementsByDealId } from "@/lib/api/queries";
import type { Upload } from "@/lib/types";
import { getUserId } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import type z from "zod";

export const Route = createFileRoute("/_app/deals/$dealId")({
  component: RouteComponent,
  staticData: {
    routeName: "View Deal",
  },
});

function RouteComponent() {
  const { dealId } = Route.useParams();
  const { data: deal, refetch, isFetched } = useGetDealById(dealId);
  const { data: statements } = useGetStatementsByDealId(dealId);
  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const [uploads, setUploads] = useState<Upload[]>([]);

  const updateDealMutation = useUpdateDeal();
  const uploadStatementMutation = useUploadStatement();

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
    const userId = getUserId();
    if (!userId) throw new Error("No logged in user detected.");
    if (!dealId) throw new Error("No deal ID provided.");
    uploads.forEach(async (statement) => {
      if (statement.status === "pending") {
        updateStatus(statement.file.name, "uploading");
        await uploadStatementMutation
          .mutateAsync({
            deal: dealId,
            file: statement.file,
            filename: statement.file.name,
          })
          .then(() => setUploads((prev) => prev.filter((u) => u.file.name !== statement.file.name)))
          .then(() => {
            refetch();
            setFormDisabled(false);
          })
          .catch((error: Error) => updateStatus(statement.file.name, "error", error.message));
      }
    });
  };

  return (
    <div className="relative flex h-full">
      <div className={`flex-[1.5] px-2`}>
        <FileUpload
          uploads={uploads}
          statements={statements || []}
          setUploads={setUploads}
          handleUpload={handleUpload}
        />
      </div>
      <div className="flex-[2] px-2 flex flex-col justify-center">
        <div className="mt-16">
          {!isFetched && <CreateDealForm handleUpdateDeal={handleUpdateDeal} disabled={formDisabled} deal={deal} />}
          {isFetched && <CreateDealForm handleUpdateDeal={handleUpdateDeal} disabled={formDisabled} deal={deal} />}
        </div>
        <div className="flex-grow"></div>
        <div className="flex w-full justify-end mb-4">
          <Button variant={"ghost"}>
            <Link to={`/transactions/$dealId`} params={{ dealId }} className="flex items-center gap-2">
              Transactions
              <MoveRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
