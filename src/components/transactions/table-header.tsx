export function TableHeader({
  sortField,
  sortDir,
  handleSort,
  open,
}: {
  sortField?: string;
  sortDir: "asc" | "desc";
  handleSort: (field: string) => void;
  open: boolean;
}) {
  return (
    <div className="flex bg-muted/50 border-b">
      <div
        className="flex-shrink-0 w-27.5 px-3 py-2 text-sm text-left font-semibold border-r whitespace-nowrap overflow-hidden cursor-pointer hover:bg-muted/70 flex items-center gap-1"
        onClick={() => handleSort("date")}
      >
        Date
        {sortField === "date" && <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </div>
      <div
        className={`flex-shrink-0 ${
          open ? "w-100" : "w-140"
        } px-3 py-2 text-sm text-left font-semibold border-r whitespace-nowrap overflow-hidden`}
      >
        Description
      </div>
      <div
        className="flex-shrink-0 w-32 px-3 py-2 text-sm text-left font-semibold border-r whitespace-nowrap overflow-hidden cursor-pointer hover:bg-muted/70 flex items-center gap-1"
        onClick={() => handleSort("type")}
      >
        Category
        {sortField === "type" && <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </div>
      <div
        className="flex-shrink-0 w-28 py-2 text-sm text-center font-semibold whitespace-nowrap overflow-hidden cursor-pointer hover:bg-muted/70 flex items-center justify-center gap-1"
        onClick={() => handleSort("amount")}
      >
        Amount
        {sortField === "amount" && <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </div>
    </div>
  );
}
