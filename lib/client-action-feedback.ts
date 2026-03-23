"use client";

import { toast } from "sonner";

export interface ClientActionResultLike<T = unknown> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}

interface NotifyOptions<T> {
  successMessage?: string | ((result: ClientActionResultLike<T>) => string);
  errorMessage?: string | ((result: ClientActionResultLike<T>) => string);
  silentSuccess?: boolean;
}

export function notifyActionResult<T>(
  result: ClientActionResultLike<T>,
  options: NotifyOptions<T> = {}
): boolean {
  if (result.isSuccess) {
    if (!options.silentSuccess) {
      const successMessage =
        typeof options.successMessage === "function"
          ? options.successMessage(result)
          : options.successMessage || result.message || "Action completed successfully";
      toast.success(successMessage);
    }
    return true;
  }

  const errorMessage =
    typeof options.errorMessage === "function"
      ? options.errorMessage(result)
      : options.errorMessage || result.message || "Action failed";
  toast.error(errorMessage);
  return false;
}

export function notifyUnexpectedError(context?: string): void {
  toast.error(context ? `Failed to ${context}` : "Something went wrong");
}

