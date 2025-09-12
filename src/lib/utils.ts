import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pb } from "./pocketbase";
import { toast } from "sonner";
import type { useGetGroupedPaymentTransactions } from "./api/queries";
import type { GroupedTransactionsResponse } from "./pocketbase-types";

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

export const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatCurrency = (value: string | number | undefined) => {
  if (!value) return "$0.00";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numValue);
};

export const formatPercentage = (value: string | number | undefined) => {
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

  return longer.includes(shorter) && shorter.length > 3;
};

export const calculatePaymentFrequency = (datesString: string): string => {
  const dates = datesString
    .split(",")
    .map((d) => new Date(d.trim()))
    .sort();
  if (dates.length < 2) return "one-time";

  const intervals = [];
  for (let i = 1; i < dates.length; i++) {
    const diff = dates[i].getTime() - dates[i - 1].getTime();
    intervals.push(Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

  if (avgInterval <= 1.5) return "daily";
  if (avgInterval <= 3.5) return "every-few-days";
  if (avgInterval <= 8) return "weekly";
  if (avgInterval <= 16) return "bi-weekly";
  if (avgInterval <= 35) return "monthly";
  if (avgInterval <= 95) return "quarterly";
  return "irregular";
};

export const mergeTransactionGroups = (groupedTransactions?: GroupedTransactionsResponse[]) => {
  return groupedTransactions?.reduce((merged, current) => {
    const existingGroup = merged.find((group) =>
      areDescriptionsSimilar(
        group.gdescription,
        current.gdescription
      )
    );

    if (existingGroup) {
      existingGroup.total = (existingGroup.total || 0) + (current.total || 0);
      existingGroup.count = (existingGroup.count || 0) + (current.count || 0);

      const existingDates = existingGroup.dates.split(",");
      const currentDates = current.dates.split(",");
      existingGroup.dates = [...existingDates, ...currentDates].join(",");
    } else {
      merged.push({ ...current });
    }

    return merged;
  }, [] as typeof groupedTransactions) || [];
};

export const convertGroupsToPayments = (groups: GroupedTransactionsResponse[]) => {
  return groups.map((group) => {
    const dates = group.dates
      .split(",")
      .map((d) => new Date(d.trim()))
      .sort();

    return {
      description: group.gdescription,
      frequency: calculatePaymentFrequency(group.dates),
      amount: (group.total || 0) / (group.count || 1),
      paymentCount: group.count || 0,
      dates: group.dates,
      firstPayment: dates[0] || null,
      lastPayment: dates[dates.length - 1] || null,
    };
  });
};