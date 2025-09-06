import type { StatementsResponse } from "@/lib/pocketbase-types";
import { CircleCheck, Trash, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useDeleteStatement } from "@/lib/api/mutations";

export function UploadedStatement({ statement }: { statement: StatementsResponse }) {
  const deleteStatementMutation = useDeleteStatement();

  return (
    <div className="flex items-center pl-2 py-2 justify-between border-b">
      <div className="flex flex-col">
        <div className="font-medium text-sm">{statement.filename}</div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <CircleCheck className="text-green-500" />
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
