import { omni } from "@/helpers/omni";
import { mockNotifications } from "@/mock/notifications";
import "./NotificationsSection.css";
import { NotificationList } from "@/components/molecules";

export default function NotificationsSection() {
  return (
    <section className={omni("notifications")}>
      <NotificationList notifications={mockNotifications} />
    </section>
  );
}
