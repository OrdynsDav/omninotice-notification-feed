import { BellRingIcon, Button, NotificationIcon, Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import "./NotificationsState.css";
import { NotificationsStateProps } from "../types";
import { settings } from "@/config/settings.config";

export default function NotificationsState({
  state,
  title,
  description,
  btn,
}: NotificationsStateProps) {
    const content = settings.notificationState[state];

  return (
    <div className={omni("notifications-state", `notifications-state--${state}`)}>
      <NotificationIcon picture={{ icon: <BellRingIcon /> }} />
      <div className={omni("notifications-state__content")}>
        <Text size="lg" weight="medium">
          {title ?? content.title}
        </Text>
        <Text variant="secondary">
          {description ?? content.description}
        </Text>
      </div>
      {btn && (
        <Button><Text size="sm" variant="paper">Повторить</Text></Button>
      )}
    </div>
  );
}
