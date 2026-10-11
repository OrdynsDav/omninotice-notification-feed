import { Header, NotificationList } from "@/components/organisms";
import { Container } from "@/components/atoms";
import { PageTitle, Tab } from "@/components/molecules";
import TabProvider from "@/app/providers/TabProvider";

export default function NotificationFeedPage() {
  return (
    <div>
      <Header />
      <Container>
        <PageTitle />
        <TabProvider>
          <Tab />
          <NotificationList />
        </TabProvider>
      </Container>
    </div>
  );
}
