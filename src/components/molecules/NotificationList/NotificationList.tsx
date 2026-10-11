import NotificationCard from "@/components/molecules/NotificationCard/NotificationCard";
import { NotificationCardProps } from "@/components/molecules/types";
import { omni } from "@/helpers/omni";
import { useTab } from "@/hooks/useTab";
import "./NotificationList.css";

export default function NotificationList({
  notifications,
}: {
  notifications: NotificationCardProps[];
}) {
  return (
    <ul className={omni("notifications__list")}>
      {notifications.map((card) => {
        return (
          <li className={omni("notifications__item")} key={card.title}>
            <NotificationCard {...card} />
          </li>
        );
      })}
    </ul>
  );
}
