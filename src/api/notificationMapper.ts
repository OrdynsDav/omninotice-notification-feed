import { NotificationCardProps } from "@/components/molecules/types";
import type { Notification } from "./notifications";

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

export function toCardProps(n: Notification): NotificationCardProps {
  const { chit } = n;
  const createdAt = n.created_date;
  const createdDate = new Date(createdAt);
  return {
    messageId: chit.message_id,
    status: n.status,
    createdAt,
    time: Number.isNaN(createdDate.getTime())
      ? ""
      : timeFormatter.format(createdDate),
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