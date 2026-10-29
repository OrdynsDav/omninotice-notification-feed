import { ChevronIcon, Button, NotificationIcon, Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import type { NotificationCardProps } from "../types";
import "./NotificationCard.css";

export default function NotificationCard({
  status,
  isRead,
  picture,
  title,
  description,
  time,
  readAction,
  isActionPending = false,
  onAction,
}: NotificationCardProps) {
  return (
    <button
      className={omni(
        "notification-card",
        !isRead && "nofification-card--unread",
      )}
      data-status={status}
      data-is-read={isRead}
      onClick={() => readAction && onAction?.(readAction)}
      disabled={!readAction || isActionPending}
      aria-busy={isActionPending}
    >
      <div className={omni("notification-card__left")}>
        <NotificationIcon
          picture={picture}
          alt={`Картинка уведомления с названием ${title}`}
        />
        <div className={omni("notification-card__content")}>
          <Text size="lg" weight="medium">
            {title}
          </Text>
          <Text variant="secondary">{description}</Text>
        </div>
      </div>
      <div className={omni("notification-card__right")}>
        <Text
          className={omni("notification-card__time")}
          as="time"
          variant="secondary"
        >
          {time}
        </Text>
        <div className={"notification-card__chevron"}>
          <ChevronIcon />
        </div>
      </div>
    </button>
  );
}
