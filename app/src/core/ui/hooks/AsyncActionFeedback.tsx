import { useActionFeedback } from "@core/ui/hooks/ActionFeedback";
export function useAsyncAction() {
  const { success, error } = useActionFeedback();

  return async function run<T>(
    action: () => Promise<T>,
    messages?: { success?: string; error?: string }
  ) {
    try {
      const result = await action();
      if (messages?.success) success(messages.success);
      return result;
    } catch (e) {
      if (messages?.error) error(messages.error);
      throw e;
    }
  };
}