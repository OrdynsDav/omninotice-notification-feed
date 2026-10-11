import { Button, Text } from "@/components/atoms";
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
  const [failedUrls, setFailedUrls] = useState<string[]>([]);

  const markFailed = (url: string) =>
    setFailedUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));

  const isFailed = (url: string) => failedUrls.includes(url);

  const renderPicture = (isFailed: (src: string) => boolean) => {
    const resolved = resolvePicture(picture, isFailed);

    switch (resolved.kind) {
      case "image":
        return (
          <img
            className={omni("notification-card__image")}
            src={resolved.src}
            alt={`Картинка уведомления с названием ${title}`}
            onError={() => markFailed(resolved.src)}
            data-type={resolved.src.endsWith(".svg") ? "icon" : "image"}
          />
        );
      case "element":
        return resolved.element;
      case "component": {
        const Icon = resolved.Component;
        return <Icon />;
      }
      case "emoji":
        return <span>{resolved.value}</span>;
      default:
        return renderIcon(settings.defaultIcon);
    }
  };

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
        <div className={omni("notification-card__icon")}>
          {renderPicture(isFailed)}
        </div>
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
