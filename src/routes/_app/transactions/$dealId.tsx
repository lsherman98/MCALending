import { PDFViewer } from "@/components/pdf-viewer";
import Transactions from "@/components/transactions";
import { Button } from "@/components/ui/button";
import { useGetStatementById, useGetStatementsByDealId, useGetStatementUrl } from "@/lib/api/queries";
import type { StatementsResponse } from "@/lib/pocketbase-types";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/transactions/$dealId")({
  component: RouteComponent,
  staticData: {
    routeName: "Transactions",
  },
});

function RouteComponent() {
  const { dealId } = Route.useParams();
  const [isCollapsed, setIsCollapsed] = useState(true);
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
      <div
        className={`${
          isCollapsed ? "w-12" : "w-64"
        } border-2 rounded-lg bg-background transition-all duration-300 relative`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        {!isCollapsed && (
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Statements</h3>
            <div className="space-y-2">
              {statements?.map((stmt) => (
                <Button
                  key={stmt.id}
                  variant={statement?.id === stmt.id ? "outline" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => setSelectedStatement(stmt)}
                >
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {stmt.filename || `Statement ${stmt.id.slice(-6)}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stmt.created ? new Date(stmt.created).toLocaleDateString() : "No date"}
                    </div>
                  </div>
                </Button>
              ))}
              {(!statements || statements.length === 0) && (
                <div className="text-sm text-muted-foreground text-center py-4">No statements found</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex-[1.5] border-2 overflow-hidden">
        <PDFViewer pdfFile={pdfFile} />
      </div>
      <div className="flex-[2]">
        <Transactions dealId={dealId} statement={statement} />
      </div>
    </div>
  );
}
