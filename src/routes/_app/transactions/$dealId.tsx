import { PDFViewer } from "@/components/pdf-viewer";
import Transactions from "@/components/transactions/transactions";
import { useGetStatementById, useGetStatementsByDealId, useGetStatementUrl } from "@/lib/api/queries";
import type { StatementsResponse } from "@/lib/pocketbase-types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/transactions/$dealId")({
  component: RouteComponent,
  staticData: {
    routeName: "Transactions",
  },
});

function RouteComponent() {
  const { dealId } = Route.useParams();
  const [selectedStatement, setSelectedStatement] = useState<StatementsResponse>();

  const { data: statements } = useGetStatementsByDealId(dealId);
  const { data: statement } = useGetStatementById(selectedStatement?.id || "");
  const { data: pdfFile } = useGetStatementUrl(statement?.id || "");

  useEffect(() => {
    if (statements && statements.length > 0) {
      setSelectedStatement(statements[0]);
    }
  }, [statements]);

  return (
    <div className="w-full flex gap-4">
      <div className="flex-[1.5] border-2 overflow-hidden">
        <PDFViewer
          pdfFile={pdfFile}
          statements={statements}
          selectedStatement={selectedStatement}
          onStatementSelect={setSelectedStatement}
        />
      </div>
      <div className="flex-[2]">
        <Transactions dealId={dealId} statement={statement} />
      </div>
    </div>
  );
}
