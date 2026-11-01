import { Button, NotificationIcon, Text } from "@/components/atoms";
import { omni } from "@/helpers/omni";
import "./NotificationsState.css";
import { NotificationsStateProps } from "../types";
import { useNotificationSettings } from "@/config/SettingsContext";
import { decode } from "@/helpers/decoder";

export default function NotificationsState({
  state,
  title,
  description,
  btn,
}: NotificationsStateProps) {
  const { notificationState } = useNotificationSettings();
  const content = notificationState[state];
  const btnTitle = btn?.title ?? content.btn?.title;
  const btnOnClick = btn?.onClick ?? content.btn?.onClick;

  return (
    <div
      className={omni("notifications-state", `notifications-state--${state}`)}
    >
      <NotificationIcon picture={{ icon: content.icon }} />
      <div className={omni("notifications-state__content")}>
        <Text
          className={omni("notifications-state__title")}
          size="lg"
          weight="medium"
        >
          {decode(title ?? content.title)}
        </Text>
        <Text
          className={omni("notifications-state__subtitle")}
          variant="secondary"
        >
          {decode(description ?? content.description)}
        </Text>
      </div>
      {btnTitle && btnOnClick && (
        <Button className="notifications-state__btn" onClick={btnOnClick}>
          <Text size="sm" variant="paper">
            {btnTitle}
          </Text>
        </Button>
      )}
    </div>
  );
}
