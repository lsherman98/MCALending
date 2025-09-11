import type { LucideIcon } from "lucide-react";
import type { createDealFormSchema } from "./deal-form";
import type { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import type z from "zod";
import { cn } from "@/lib/utils";

export function FormInput({
  disabled,
  form,
  name,
  type,
  icon: Icon,
  label,
  className,
}: {
  disabled?: boolean;
  form: ReturnType<typeof useForm<z.infer<typeof createDealFormSchema>>>;
  type: "text" | "number";
  icon: LucideIcon;
  name: "title" | "merchant" | "bank" | "iso" | "address" | "city" | "state" | "zipCode" | "creditScore";
  label: string;
  className?: string;
}) {
  return (
    <FormField
      disabled={disabled}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col gap-2 items-start max-w-sm", className)}>
          <FormLabel>{label}</FormLabel>
          <div className="w-full">
            <FormControl>
              <div className="relative w-full">
                <Input key="text-input-0" placeholder="" type={type} id={name} className="ps-9" {...field} />
                <div
                  className={
                    "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                  }
                >
                  <Icon className="size-4" strokeWidth={2} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
