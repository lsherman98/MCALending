import type { StatementsResponse } from "@/lib/pocketbase-types";
import { CircleCheck } from "lucide-react";

export function UploadedStatement({ statement }: { statement: StatementsResponse }) {
  return (
    <div className="flex items-center px-4 py-2 justify-between border-b">
      <div className="flex flex-col">
        <div className="font-medium text-sm">{statement.filename}</div>
      </div>
      <div className="flex items-center justify-end">
        <CircleCheck className="text-green-500" />
      </div>
    </div>
  );
}
