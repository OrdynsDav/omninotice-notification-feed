import { useEffect } from "react";
import { Button, NotificationIcon, Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import type { NotificationDetails } from "@/components/molecules/types";
import "./NotificationDetailsSidebar.css";
import CloseIcon from "@/components/atoms/icons/CloseIcon";

interface NotificationDetailsSidebarProps {
  notification: NotificationDetails | null;
  onClose: () => void;
}

export default function NotificationDetailsSidebar({
  notification,
  onClose,
}: NotificationDetailsSidebarProps) {
  const isOpen = notification !== null;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={omni("notification-details-backdrop", isOpen && "is-open")}
      aria-hidden={!isOpen}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className={omni("notification-details-sidebar", isOpen && "is-open")}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? true : undefined}
        aria-labelledby={isOpen ? "notification-details-title" : undefined}
        aria-hidden={!isOpen}
      >
        {notification && (
          <div className={omni("notification-details-sidebar__wrapper")}>
            <div className={omni("notification-details-sidebar__header")}>
              <Text as="h2" size="md" weight="semibold">
                {notification.title}
              </Text>
              <Button
                variant="icon"
                aria-label="Закрыть уведомление"
                tabIndex={isOpen ? undefined : -1}
                onClick={onClose}
              >
                <CloseIcon />
              </Button>
            </div>
            <div className={omni("notification-details-sidebar__content")}>
              {notification.description && (
                <Text variant="secondary">{notification.description}</Text>
              )}
            </div>
            {/* <div className={omni("notification-details-sidebar__actions")}>
              <Button as="a" href={notification.action.url}>{notification.action.title}</Button>
            </div> */}
          </div>
        )}
      </aside>
    </div>
  );
}
