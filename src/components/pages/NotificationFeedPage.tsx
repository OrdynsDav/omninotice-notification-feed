import { NotificationsSection } from "@/components/organisms";
import { Container } from "@/components/atoms";
import { PageTitle, Tab } from "@/components/molecules";
import "./NotificationFeedPage.css"
import { omni } from "@/helpers/omni";
import NotificationsRoot from "../organisms/NotificationsRoot/NotificationsRoot";

export default function NotificationFeedPage() {
  return (
    <div className={omni("notification-page")}>
        <Container>
          <PageTitle />
          <NotificationsRoot>
            <Tab />
            <NotificationsSection />
          </NotificationsRoot>
        </Container>
    </div>
  );
}
