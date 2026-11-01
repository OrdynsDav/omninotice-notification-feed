import { useRef } from "react";
import { Button, Text } from "@/components/atoms";
import CloseIcon from "@/components/atoms/icons/CloseIcon";
import NotificationsState from "@/components/molecules/NotificationsState/NotificationsState";
import type { NotificationDetailsView } from "@/components/molecules/types";
import { useNotificationSettings } from "@/config/SettingsContext";
import { omni } from "@/helpers/omni";
import "./NotificationDetailsSidebar.css";

interface NotificationDetailsSidebarProps {
  view: NotificationDetailsView;
  onClose: () => void;
  onRetry: () => void;
}

export default function NotificationDetailsSidebar({
  view,
  onClose,
  onRetry,
}: NotificationDetailsSidebarProps) {
  const { sidebarBackdrop } = useNotificationSettings();
  const isOpen = view.status !== "closed";

  // чтобы при анимации закрытия содержимое не пропадало
  const lastViewRef = useRef(view);
  if (isOpen) lastViewRef.current = view;
  const shown = lastViewRef.current;

  const details =
    shown.status === "ready" ? shown.details
    : shown.status === "closed" ? null
    : shown.preview;

  const body =
    shown.status === "ready"
      ? shown.details.text || shown.details.description
      : null;

  const action =
    shown.status === "ready" &&
    shown.details.action?.url &&
    shown.details.action.title
      ? shown.details.action
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
              {details?.title}
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
            {shown.status === "loading" && (
              <Text variant="secondary">Загрузка...</Text>
            )}
            {shown.status === "error" && (
              <NotificationsState state="error" btn={{ onClick: onRetry }} />
            )}
            {body && <Text variant="secondary">{body}</Text>}
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