import NotificationCard from "@/components/molecules/NotificationCard/NotificationCard";
import { NotificationCardProps } from "@/components/molecules/types";
import type { NotificationDetails } from "@/components/molecules/types";
import type { NotificationAction } from "@/api/actions";
import { omni } from "@/helpers/omni";
import "./NotificationList.css";

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
  pendingActionIds,
  onSelect,
}: {
  notifications: NotificationCardProps[];
  onAction?: (action: NotificationAction) => void;
  pendingActionIds?: ReadonlySet<string>;
  onSelect?: (notification: NotificationDetails) => void;
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
                  <NotificationCard
                    {...card}
                    onAction={onAction}
                    onSelect={onSelect}
                    isActionPending={
                      card.readAction
                        ? pendingActionIds?.has(card.readAction.id)
                        : false
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
