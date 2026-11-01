import { useCallback, useRef, useState } from "react";
import type {
  LoadNotificationDetails,
  NotificationDetails,
  NotificationDetailsView,
} from "@/components/molecules/types";

export function useNotificationDetails(onLoadDetails?: LoadNotificationDetails) {
  const [view, setView] = useState<NotificationDetailsView>({ status: "closed" });
  const abortRef = useRef<AbortController | null>(null);
  const previewRef = useRef<NotificationDetails | null>(null);

  const run = useCallback(
    (preview: NotificationDetails) => {
      abortRef.current?.abort();

      if (!onLoadDetails || !preview.messageId) {
        setView({ status: "ready", details: preview });
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setView({ status: "loading", preview });

      onLoadDetails(preview.messageId, controller.signal)
        .then((details) => {
          if (!controller.signal.aborted) setView({ status: "ready", details });
        })
        .catch(() => {
          if (!controller.signal.aborted) setView({ status: "error", preview });
        });
    },
    [onLoadDetails],
  );

  const open = useCallback(
    (preview: NotificationDetails) => {
      previewRef.current = preview;
      run(preview);
    },
    [run],
  );

  const retry = useCallback(() => {
    if (previewRef.current) run(previewRef.current);
  }, [run]);

  const close = useCallback(() => {
    abortRef.current?.abort();
    setView({ status: "closed" });
  }, []);

  return { view, open, retry, close };
}
