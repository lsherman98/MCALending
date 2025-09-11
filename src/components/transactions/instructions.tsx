import { Kbd } from "../kbd";

export function Instructions() {
  return (
    <div className="flex items-center justify-center">
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        navigate •<Kbd>0</Kbd>-<Kbd>5</Kbd>
        categorize •<Kbd>ESC</Kbd>
        exit
      </div>
    </div>
  );
}
