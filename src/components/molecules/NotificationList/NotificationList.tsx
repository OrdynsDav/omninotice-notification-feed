import NotificationCard from "@/components/molecules/NotificationCard/NotificationCard";
import { NotificationCardProps } from "@/components/molecules/types";
import type { NotificationAction } from "@/api/actions";
import { omni } from "@/helpers/omni";
import "./NotificationList.css";

export default function NotificationList({
  notifications,
  onAction,
  pendingActionIds,
}: {
  notifications: NotificationCardProps[];
  onAction?: (action: NotificationAction) => void;
  pendingActionIds?: ReadonlySet<string>;
}) {
  return (
    <ul className={omni("notifications__list")}>
      {notifications.map((card) => {
        return (
          <li className={omni("notifications__item")} key={card.title}>
            <NotificationCard
              {...card}
              onAction={onAction}
              isActionPending={
                card.readAction
                  ? pendingActionIds?.has(card.readAction.id)
                  : false
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
