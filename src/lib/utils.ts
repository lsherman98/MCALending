import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pb } from "./pocketbase";
import { toast } from "sonner";
import type { GroupedTransactionsResponse } from "./pocketbase-types";
import { CURRENCY_FORMAT, FILE_SIZE, PAYMENT_FREQUENCY_THRESHOLDS, VALIDATION } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError(error: Error) {
  if (error instanceof Error && error.message.includes("The request was autocancelled")) {
    return;
  }
  console.error(error)
  toast.error("An error occurred", {
    description: error.message,

  })
}

export function getUserId(msg: string = 'No logged in user detected.'): string | null {
  const user = pb.authStore.record;
  if (!user?.id) {
    handleError(new Error(msg));
    return null
  }
  return user.id;
}

export const formatFileSize = (size: number): string => {
  if (size < FILE_SIZE.KILOBYTE) return `${size} B`;
  if (size < FILE_SIZE.MEGABYTE) return `${(size / FILE_SIZE.KILOBYTE).toFixed(1)} KB`;
  return `${(size / FILE_SIZE.MEGABYTE).toFixed(2)} MB`;
};

export const formatCurrency = (value: string | number | undefined): string => {
  if (!value) return "$0.00";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat(CURRENCY_FORMAT.LOCALE, {
    style: "currency",
    currency: CURRENCY_FORMAT.CURRENCY,
  }).format(numValue);
};


export const formatPercentage = (value: string | number | undefined): string => {
  if (!value) return "0%";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return `${numValue.toFixed(2)}%`;
};

export const normalizeDescription = (description: string | null): string => {
  if (!description) return "unknown";
  return description
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\b(ccd|fmd\w+|[a-z]{9,})\b/gi, "")
    .trim();
};

export const areDescriptionsSimilar = (desc1: string | null, desc2: string | null): boolean => {
  const norm1 = normalizeDescription(desc1);
  const norm2 = normalizeDescription(desc2);

  if (norm1 === norm2) return true;
  const longer = norm1.length > norm2.length ? norm1 : norm2;
  const shorter = norm1.length > norm2.length ? norm2 : norm1;

  return longer.includes(shorter) && shorter.length > VALIDATION.MIN_DESCRIPTION_LENGTH;
};

export const calculatePaymentFrequency = (datesString: string): string => {
  const dates = datesString
    .split(",")
    .map((d) => new Date(d.trim()))
    .sort();
  if (dates.length < VALIDATION.MIN_TRANSACTIONS_FOR_FREQUENCY) return "one-time";

  const intervals = [];
  for (let i = 1; i < dates.length; i++) {
    const diff = dates[i].getTime() - dates[i - 1].getTime();
    intervals.push(Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

  if (avgInterval <= PAYMENT_FREQUENCY_THRESHOLDS.DAILY) return "daily";
  if (avgInterval <= PAYMENT_FREQUENCY_THRESHOLDS.EVERY_FEW_DAYS) return "every-few-days";
  if (avgInterval <= PAYMENT_FREQUENCY_THRESHOLDS.WEEKLY) return "weekly";
  if (avgInterval <= PAYMENT_FREQUENCY_THRESHOLDS.BI_WEEKLY) return "bi-weekly";
  if (avgInterval <= PAYMENT_FREQUENCY_THRESHOLDS.MONTHLY) return "monthly";
  if (avgInterval <= PAYMENT_FREQUENCY_THRESHOLDS.QUARTERLY) return "quarterly";
  return "irregular";
};

export const mergeTransactionGroups = (groupedTransactions?: GroupedTransactionsResponse[]) => {
  return groupedTransactions?.reduce((merged, current) => {
    const existingGroup = merged.find((group) =>
      areDescriptionsSimilar(
        group.gdescription as string,
        current.gdescription as string
      )
    );

    if (existingGroup) {
      existingGroup.total = (existingGroup.total as number || 0) + (current.total as number || 0);
      existingGroup.count = (existingGroup.count || 0) + (current.count || 0);

      const existingDates = (existingGroup.dates as string).split(",");
      const currentDates = (current.dates as string).split(",");
      existingGroup.dates = [...existingDates, ...currentDates].join(",");
    } else {
      merged.push({ ...current });
    }

    return merged;
  }, [] as typeof groupedTransactions) || [];
};

export const convertGroupsToPayments = (groups: GroupedTransactionsResponse[]) => {
  return groups.map((group) => {
    const dates = (group.dates as string)
      .split(",")
      .map((d) => new Date(d.trim()))
      .sort();

    return {
      description: group.gdescription,
      frequency: calculatePaymentFrequency(group.dates as string),
      amount: (group.total as number || 0) / (group.count || 1),
      total: group.total || 0,
      count: group.count || 0,
      dates: group.dates,
      first: dates[0] || null,
      latest: dates[dates.length - 1] || null,
    };
  });
};