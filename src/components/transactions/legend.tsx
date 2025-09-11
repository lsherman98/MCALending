import { Kbd } from "../kbd";

export function Legend() {
  const items = [
    { key: "revenue", kbd: "1", label: "Revenue" },
    { key: "transfer", kbd: "2", label: "Transfer" },
    { key: "funding", kbd: "3", label: "Funding" },
    { key: "payment", kbd: "4", label: "Payment" },
    { key: "expense", kbd: "5", label: "Expense" },
  ] as const;

  return (
    <div className="flex items-center gap-1">
      {items.map(({ key, kbd, label }) => (
        <div key={key} className={`flex items-center gap-2 px-2 py-1 rounded bg-${key}-bg`}>
          <Kbd>{kbd}</Kbd>
          <div className={`w-1.5 h-1.5 bg-${key} rounded-full`}></div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
