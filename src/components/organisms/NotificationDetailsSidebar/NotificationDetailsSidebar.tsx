import { Button, Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import type { NotificationDetails } from "@/components/molecules/types";
import "./NotificationDetailsSidebar.css";
import CloseIcon from "@/components/atoms/icons/CloseIcon";
import { useNotificationSettings } from "@/config/SettingsContext";
import NotificationsState from "@/components/molecules/NotificationsState/NotificationsState";

interface NotificationDetailsSidebarProps {
  notification: NotificationDetails | null;
  onClose: () => void;
}

export default function NotificationDetailsSidebar({
  notification,
  onClose,
}: NotificationDetailsSidebarProps) {
  const { sidebarBackdrop } = useNotificationSettings();
  const isOpen = notification !== null;
  const hasAction =
    notification?.action &&
    notification?.action.url != "" &&
    notification?.action.title != "";

  return (
    <div
      className={omni(
        "notification-details-backdrop",
        sidebarBackdrop && "is-filled",
        isOpen && "is-open",
      )}
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
        {notification ? (
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
                <CloseIcon width={9} height={9} />
              </Button>
            </div>
            <div className={omni("notification-details-sidebar__content")}>
              {notification.description && (
                <Text variant="secondary">{notification.description}</Text>
              )}
            </div>
            <div className={omni("notification-details-sidebar__actions")}>
              {hasAction && (
                <Button
                  className={"notification-details-sidebar__btn"}
                  as="a"
                  href={notification.action?.url}
                >
                  {notification.action?.title}
                </Button>
              )}
              <Button
                className="notification-details-sidebar__close"
                variant="secondary"
                onClick={onClose}
              >
                Закрыть
              </Button>
            </div>
          </div>
        ) : (
          <NotificationsState state="error" />
        )}
      </aside>
    </div>
  );
}
