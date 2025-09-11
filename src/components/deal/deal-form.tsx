import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BriefcaseBusiness,
  Building2,
  CalendarIcon,
  House,
  Landmark,
  Map,
  MapPin,
  PencilLine,
  PiggyBank,
} from "lucide-react";
import { format } from "date-fns";
import type { DealsResponse } from "@/lib/pocketbase-types";
import { FormInput } from "./form-input";
import { IndustryInput } from "./industry-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

export const createDealFormSchema = z.object({
  title: z.string().min(2).max(100),
  merchant: z.string().optional(),
  industry: z.string().optional(),
  bank: z.string().optional(),
  founded: z.date().optional(),
  iso: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  creditScore: z.number().optional(),
});

export function DealForm({
  handleUpdateDeal,
  disabled,
  deal,
}: {
  handleUpdateDeal: (data: z.infer<typeof createDealFormSchema>) => void;
  disabled?: boolean;
  deal?: DealsResponse;
}) {
  const form = useForm<z.infer<typeof createDealFormSchema>>({
    resolver: zodResolver(createDealFormSchema),
    defaultValues: {
      title: deal?.title || "",
      merchant: deal?.merchant || "",
      industry: deal?.industry || "",
      bank: deal?.bank || "",
      founded: deal?.founded ? new Date(deal.founded) : undefined,
      iso: deal?.iso || "",
      address: deal?.address || "",
      city: deal?.city || "",
      state: deal?.state || "",
      zipCode: deal?.zip_code || "",
      creditScore: deal?.credit_score || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof createDealFormSchema>) {
    handleUpdateDeal(values);
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="flex items-center justify-center h-full"
      >
        <div className="space-y-6 h-full">
          <div className="italic text-sm text-muted-foreground">Deal Reference number: {deal?.id}</div>
          <FormInput disabled={disabled} form={form} name="title" type="text" icon={PencilLine} label="Title" />
          <div className="flex gap-4">
            <FormInput
              disabled={disabled}
              form={form}
              name="merchant"
              type="text"
              icon={BriefcaseBusiness}
              label="Merchant"
            />
            <FormField
              disabled={disabled}
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>Industry</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <IndustryInput
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Type to search industries..."
                        disabled={disabled}
                        icon={<Building2 className="size-4" strokeWidth={2} />}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormInput disabled={disabled} form={form} name="bank" type="text" icon={PiggyBank} label="Bank" />
            <FormInput
              disabled={disabled}
              form={form}
              name="creditScore"
              type="number"
              icon={Landmark}
              label="Credit Score"
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="founded"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>Founded</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={disabled}
                            variant={"outline"}
                            className="justify-start text-left font-normal w-full"
                            id="founded"
                            name=""
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" initialFocus onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormInput disabled={disabled} form={form} name="iso" type="text" icon={BriefcaseBusiness} label="ISO" />
          </div>
          <FormInput disabled={disabled} form={form} name="address" type="text" icon={House} label="Address" />
          <div className="flex gap-4">
            <FormInput disabled={disabled} form={form} name="city" type="text" icon={Building2} label="City" />
            <FormInput disabled={disabled} form={form} name="state" type="text" icon={Map} label="State" />
            <FormInput disabled={disabled} form={form} name="zipCode" type="number" icon={MapPin} label="Zip Code" />
          </div>
          <Button type="submit" variant="default" disabled={disabled}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
