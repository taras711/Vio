// src/core/ui/hooks/useAsyncSafe.ts
import { useState, useCallback } from "react";
import { useActionFeedback } from "@hooks/ActionFeedback";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface Options<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  initialData?: T;
}

export function useAsyncSafe<T>(
  asyncFn: () => Promise<T>,
  options: Options<T> = {}
) {
  const { error: showError, success: showSuccess } = useActionFeedback();

  const [state, setState] = useState<AsyncState<T>>({
    data: options.initialData ?? null,
    loading: false,
    error: null,
  });

  const run = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
      if (options.successMessage) showSuccess(options.successMessage);
      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({ ...prev, loading: false, error }));

      const msg = options.errorMessage ?? error.message;
      showError(msg);
      options.onError?.(error);
      return null;
    }
  }, [asyncFn]);

  return { ...state, run };
}