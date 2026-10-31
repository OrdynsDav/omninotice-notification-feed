import NotificationCard from "@/components/molecules/NotificationCard/NotificationCard";
import { NotificationCardProps } from "@/components/molecules/types";
import type { NotificationDetails } from "@/components/molecules/types";
import type { NotificationAction } from "@/api/actions";
import { memo, useState } from "react";
import { omni } from "@/helpers/omni";
import "./NotificationList.css";
import NotificationDetailsSidebar from "@/components/organisms/NotificationDetailsSidebar/NotificationDetailsSidebar";
import { useNotificationDetails } from "@/hooks/useNotificationDetails";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";

type DayGroup = "today" | "yesterday" | "earlier";

const dayLabels: Record<DayGroup, string> = {
  today: "Сегодня",
  yesterday: "Вчера",
  earlier: "Ранее",
};

function getDayGroup(createdAt?: string): DayGroup {
  if (!createdAt) return "earlier";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "earlier";

  const today = new Date();
  const todaySerial = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const notificationDaySerial = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const daysAgo = (todaySerial - notificationDaySerial) / 86_400_000;

  if (daysAgo === 0) return "today";
  if (daysAgo === 1) return "yesterday";
  return "earlier";
}

export default function NotificationList({
  notifications,
  onAction,
}: {
  notifications: NotificationCardProps[];
  onAction?: (action: NotificationAction) => void | Promise<unknown>;
}) {
  const { onLoadDetails, onRetry } = useNotificationsContext();
const { view, open, retry, close } = useNotificationDetails(onLoadDetails, onRetry?.details);


  return (
    <>
      <NotificationListContent
        notifications={notifications}
        onAction={onAction}
        onSelect={open}
      />
      <NotificationDetailsSidebar
        view={view}
        onClose={close}
        onRetry={retry}
      />
    </>
  );
}

const NotificationListContent = memo(function NotificationListContent({
  notifications,
  onAction,
  onSelect,
}: {
  notifications: NotificationCardProps[];
  onAction?: (action: NotificationAction) => void | Promise<unknown>;
  onSelect: (notification: NotificationDetails) => void;
}) {
  const groupedNotifications = notifications.reduce<
    Record<DayGroup, NotificationCardProps[]>
  >(
    (groups, notification) => {
      groups[getDayGroup(notification.createdAt)].push(notification);
      return groups;
    },
    { today: [], yesterday: [], earlier: [] },
  );

  return (
    <div className={omni("notifications__groups")}>
      {(Object.keys(dayLabels) as DayGroup[]).map((group) => {
        const groupNotifications = groupedNotifications[group];
        if (groupNotifications.length === 0) return null;

        return (
          <section
            className={omni("notifications__group")}
            key={group}
            aria-label={dayLabels[group]}
          >
            <h2 className={omni("notifications__group-title")}>
              {dayLabels[group]}
            </h2>
            <ul className={omni("notifications__list")}>
              {groupNotifications.map((card) => (
                <li
                  className={omni("notifications__item")}
                  key={card.messageId ?? card.title}
                >
                  <NotificationListItem
                    card={card}
                    onAction={onAction}
                    onSelect={onSelect}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
});

const NotificationListItem = memo(function NotificationListItem({
  card,
  onAction,
  onSelect,
}: NotificationListItemProps) {
  const [isActionPending, setIsActionPending] = useState(false);

  const handleAction = async (action: NotificationAction) => {
    if (!onAction) return;
    setIsActionPending(true);
    try {
      await onAction(action);
    } finally {
      setIsActionPending(false);
    }
  };

  return (
    <NotificationCard
      {...card}
      onAction={handleAction}
      onSelect={onSelect}
      isActionPending={isActionPending}
    />
  );
}, areNotificationCardPropsEqual);

function areNotificationCardPropsEqual(
  previous: NotificationListItemProps,
  next: NotificationListItemProps,
): boolean {
  const previousPicture = previous.card.picture;
  const nextPicture = next.card.picture;
  const previousAction = previous.card.action;
  const nextAction = next.card.action;
  const previousReadAction = previous.card.readAction;
  const nextReadAction = next.card.readAction;

  return (
    previous.onAction === next.onAction &&
    previous.onSelect === next.onSelect &&
    previous.card.messageId === next.card.messageId &&
    previous.card.status === next.card.status &&
    previous.card.createdAt === next.card.createdAt &&
    previous.card.time === next.card.time &&
    previous.card.title === next.card.title &&
    previous.card.description === next.card.description &&
    previous.card.isRead === next.card.isRead &&
    previous.card.isActionPending === next.card.isActionPending &&
    previousPicture.image === nextPicture.image &&
    previousPicture.icon === nextPicture.icon &&
    previousPicture.emoji === nextPicture.emoji &&
    previousAction?.url === nextAction?.url &&
    previousAction?.title === nextAction?.title &&
    previousReadAction?.type === nextReadAction?.type &&
    previousReadAction?.id === nextReadAction?.id
  );
}

type NotificationListItemProps = {
  card: NotificationCardProps;
  onAction?: (action: NotificationAction) => void | Promise<unknown>;
  onSelect: (notification: NotificationDetails) => void;
};
