import { Header, NotificationsSection } from "@/components/organisms";
import { Container } from "@/components/atoms";
import { PageTitle, Tab } from "@/components/molecules";
import TabProvider from "@/app/providers/TabProvider";
import "./NotificationFeedPage.css"
import NotificationsState from "../molecules/NotificationsState/NotificationsState";

export default function NotificationFeedPage() {
  return (
    <div>
      <Header />
        <Container>
          <PageTitle />
          <TabProvider>
            <Tab />
            <NotificationsState state={"error"} btn/>
            {/* <NotificationsSection /> */}
          </TabProvider>
        </Container>
    </div>
  );
}
