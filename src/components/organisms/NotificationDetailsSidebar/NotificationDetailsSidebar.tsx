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

  const title = notification?.title ?? "Произошла ошибка";
  const action =
    notification?.action?.url && notification.action.title
      ? notification.action
      : null;

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
        <div className={omni("notification-details-sidebar__wrapper")}>
          <div className={omni("notification-details-sidebar__header")}>
            <Text as="h2" id="notification-details-title" size="md" weight="semibold">
              {title}
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
            {notification ? (
              notification.description && (
                <Text variant="secondary">{notification.description}</Text>
              )
            ) : (
              <NotificationsState state="error" />
            )}
          </div>

          <div className={omni("notification-details-sidebar__actions")}>
            {action && (
              <Button
                className="notification-details-sidebar__btn"
                as="a"
                href={action.url}
              >
                {action.title}
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
      </aside>
    </div>
  );
}
