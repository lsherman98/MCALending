export const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="bg-muted/80 text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
    {children}
  </kbd>
);
