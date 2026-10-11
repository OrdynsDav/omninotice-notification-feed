import { Button, NotificationIcon, Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import type { NotificationCardProps } from "../types";
import { renderIcon } from "@/helpers/renderIcon";
import { resolvePicture } from "@/helpers/resolvePicture";
import { useState } from "react";
import { settings } from "@/config/settings.config";
import "./NotificationCard.css";

export default function NotificationCard({
  status,
  isRead,
  picture,
  title,
  description,
  time,
  action,
}: NotificationCardProps) {

  return (
    <div
      className={omni(
        "notification-card",
        !isRead && "nofification-card--unread",
      )}
      data-status={status}
      data-is-read={isRead}
    >
      <div className={omni("notification-card__left")}>
        <NotificationIcon picture={picture} alt={`Картинка уведомления с названием ${title}`}/>
        <div className={omni("notification-card__content")}>
          <Text size="lg" weight="medium">
            {title}
          </Text>
          <Text variant="secondary">{description}</Text>
        </div>
      </div>
      <div className={omni("notification-card__right")}>
        <Text as="time" variant="secondary">
          {time}
        </Text>
        {action && (
          <Button className={"notification-card__btn"} as="a" href={action.url}>
            {action.title}
          </Button>
        )}
        {!isRead && <div className={omni("notification-card__dot")}></div>}
      </div>
    </div>
  );
}
