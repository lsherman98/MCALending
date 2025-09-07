import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import type { DealsResponse } from "@/lib/pocketbase-types";

export const createDealFormSchema = z.object({
  title: z.string().min(2).max(100),
  merchant: z.string().optional(),
  industry: z.string().optional(),
  bank: z.string().optional(),
  founded: z.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  creditScore: z.number().optional(),
});

export function CreateDealForm({
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
          <FormField
            disabled={disabled}
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 items-start max-w-md">
                <FormLabel>Title</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input key="text-input-0" placeholder="" type="text" id="title" className="ps-9" {...field} />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <PencilLine className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              disabled={disabled}
              control={form.control}
              name="merchant"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>Merchant</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-0"
                          placeholder=""
                          type="text"
                          id="merchant"
                          className="ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <BriefcaseBusiness className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
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
                      <div className="relative w-full">
                        <Input
                          key="text-input-1"
                          placeholder=""
                          type="text"
                          id="industry"
                          className="ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <Building2 className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              disabled={disabled}
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>Bank</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input key="text-input-2" placeholder="" type="text" id="bank" className="ps-9" {...field} />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <PiggyBank className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              disabled={disabled}
              control={form.control}
              name="creditScore"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>Credit Score</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="number-input-1"
                          placeholder=""
                          type="number"
                          id="credit-score"
                          className="ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <Landmark className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="founded"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 items-start max-w-md">
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
          <FormField
            disabled={disabled}
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 items-start max-w-md">
                <FormLabel>Address</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input key="text-input-3" placeholder="" type="text" id="address" className="ps-9" {...field} />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <House className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              disabled={disabled}
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>City</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input key="text-input-3" placeholder="" type="text" id="city" className="ps-9" {...field} />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <Building2 className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              disabled={disabled}
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>State</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input key="text-input-4" placeholder="" type="text" id="state" className="ps-9" {...field} />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <Map className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              disabled={disabled}
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start flex-1">
                  <FormLabel>Zip Code</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="number-input-0"
                          placeholder=""
                          type="number"
                          id="zip-code"
                          className="ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <MapPin className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" variant="default" disabled={disabled}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
