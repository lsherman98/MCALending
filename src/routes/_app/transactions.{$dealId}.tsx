import { PDFViewer } from "@/components/pdf-viewer";
import Transactions from "@/components/transactions";
import { useGetStatementById, useGetStatementsByDealId, useGetStatementUrl } from "@/lib/api/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/transactions/{$dealId}")({
  component: RouteComponent,
});

function RouteComponent() {
  const { dealId } = Route.useParams();
  const { data: statements } = useGetStatementsByDealId(dealId);
  const { data: statement } = useGetStatementById(statements?.[0]?.id || "");
  const { data: pdfFile } = useGetStatementUrl(statement?.id || "");

  return (
    <div className="flex max-h-[89vh] overflow-hidden">
      <div className="max-w-[40%] h-full p-4 border-2 overflow-hidden">
        <PDFViewer pdfFile={pdfFile} />
      </div>
      <div className="max-w-[60%] w-[60%]">
        <Transactions dealId={dealId} />
      </div>
    </div>
  );
}
