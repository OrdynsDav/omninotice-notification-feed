import type { NotificationPicture } from "@/components/molecules/types";
import { settings } from "@/config/settings.config";
import { omni } from "@/helpers/omni";
import { renderIcon } from "@/helpers/renderIcon";
import { resolvePicture } from "@/helpers/resolvePicture";
import { useState } from "react";
import "./NotificationIcon.css"

export default function NotificationIcon({
  picture,
  alt,
}: {
  picture: NotificationPicture;
  alt?: string;
}) {
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
            className={omni("notification-icon__image")}
            src={resolved.src}
            alt={alt}
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
    <div className={omni("notification-icon")}>{renderPicture(isFailed)}</div>
  );
}
