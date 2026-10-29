import { NotificationCardProps } from "@/components/molecules/types";
import type { Notification } from "./notifications";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function toCardProps(n: Notification): NotificationCardProps {
  const { chit } = n;
  return {
    status: n.status,
    time: dateFormatter.format(new Date(n.created_date)), // например, «14 окт., 12:15»
    title: chit.title,
    description: chit.description ?? "",
    picture: {
      image: chit.picture?.main ?? chit.picture?.preview ?? chit.picture?.cover ?? undefined,
      icon: chit.picture?.icon ?? undefined,
      emoji: chit.picture?.emoji ?? undefined,
    },
    action: { url: "", title: "" },
    readAction: n.is_read ? null : { type: "mark-read", id: chit.message_id },
    isRead: n.is_read,
  };
}