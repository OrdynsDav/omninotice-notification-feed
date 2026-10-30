import NotificationCard from "@/components/molecules/NotificationCard/NotificationCard";
import { NotificationCardProps } from "@/components/molecules/types";
import type { NotificationDetails } from "@/components/molecules/types";
import type { NotificationAction } from "@/api/actions";
import { memo, useState } from "react";
import { omni } from "@/helpers/omni";
import "./NotificationList.css";
import NotificationDetailsSidebar from "@/components/organisms/NotificationDetailsSidebar/NotificationDetailsSidebar";

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
  isMarkingAll,
}: {
  notifications: NotificationCardProps[];
  onAction?: (action: NotificationAction) => void | Promise<unknown>;
  isMarkingAll: boolean;
}) {
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationDetails | null>(null);

  return (
    <>
      <NotificationListContent
        notifications={notifications}
        onAction={onAction}
        onSelect={setSelectedNotification}
        isMarkingAll={isMarkingAll}
      />
      <NotificationDetailsSidebar
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </>
  );
}

const NotificationListContent = memo(function NotificationListContent({
  notifications,
  onAction,
  onSelect,
  isMarkingAll,
}: {
  notifications: NotificationCardProps[];
  onAction?: (action: NotificationAction) => void | Promise<unknown>;
  onSelect: (notification: NotificationDetails) => void;
  isMarkingAll: boolean;
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
                    isMarkingAll={isMarkingAll}
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

function NotificationListItem({
  card,
  onAction,
  onSelect,
  isMarkingAll,
}: {
  card: NotificationCardProps;
  onAction?: (action: NotificationAction) => void | Promise<unknown>;
  onSelect: (notification: NotificationDetails) => void;
  isMarkingAll: boolean;
}) {
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
      isActionPending={isMarkingAll || isActionPending}
    />
  );
}
