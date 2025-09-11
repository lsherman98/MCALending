import type { StatementsResponse } from "@/lib/pocketbase-types";
import { Eye, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useDeleteStatement } from "@/lib/api/mutations";
import { PDFViewer } from "./pdf-viewer";
import { useState } from "react";
import { useGetStatementUrl } from "@/lib/api/queries";

export function UploadedStatement({ statement }: { statement: StatementsResponse }) {
  const deleteStatementMutation = useDeleteStatement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: pdfFile } = useGetStatementUrl(statement?.id || "");

  return (
    <div className="flex items-center pl-2 py-2 justify-between border-b">
      <div className="font-medium text-sm">{statement.filename}</div>
      <div className="flex items-center justify-end gap-2 pr-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Eye />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[95vh] min-w-[50vw] overflow-hidden ">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle>{statement.filename}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden h-[calc(100%-80px)]">
              <PDFViewer pdfFile={pdfFile} showFileViewer={false} />
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => deleteStatementMutation.mutate(statement.id)}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
