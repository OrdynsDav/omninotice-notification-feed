import { useCallback, useRef, useState } from "react";
import type {
  LoadNotificationDetails,
  NotificationDetails,
  NotificationDetailsView,
} from "@/components/molecules/types";

export function useNotificationDetails(
  onLoadDetails?: LoadNotificationDetails,
  onRetryDetails?: LoadNotificationDetails,
) {
  const [view, setView] = useState<NotificationDetailsView>({ status: "closed" });
  const abortRef = useRef<AbortController | null>(null);
  const previewRef = useRef<NotificationDetails | null>(null);

  const run = useCallback(
    (preview: NotificationDetails, loader?: LoadNotificationDetails) => {
      abortRef.current?.abort();

      if (!loader || !preview.messageId) {
        setView({ status: "ready", details: preview });
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setView({ status: "loading", preview });

      loader(preview.messageId, controller.signal)
        .then((details) => {
          if (!controller.signal.aborted) setView({ status: "ready", details });
        })
        .catch(() => {
          if (!controller.signal.aborted) setView({ status: "error", preview });
        });
    },
    [],
  );

  const open = useCallback(
    (preview: NotificationDetails) => {
      previewRef.current = preview;
      run(preview, onLoadDetails);
    },
    [run, onLoadDetails],
  );

  const retry = useCallback(() => {
    if (previewRef.current) run(previewRef.current, onRetryDetails ?? onLoadDetails);
  }, [run, onRetryDetails, onLoadDetails]);

  const close = useCallback(() => {
    abortRef.current?.abort();
    setView({ status: "closed" });
  }, []);

  return { view, open, retry, close };
}