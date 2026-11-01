import type { ReactNode } from "react";
import { NotificationsSection } from "@/components/organisms";
import { Container } from "@/components/atoms";
import { PageTitle, Tab } from "@/components/molecules";
import "./NotificationFeedPage.css"
import { omni } from "@/helpers/omni";
import NotificationsRoot from "../organisms/NotificationsRoot/NotificationsRoot";

export interface NotificationFeedPageProps {
  /** Replaces the default page title. */
  header?: ReactNode;
}

export default function NotificationFeedPage({
  header,
}: NotificationFeedPageProps) {
  return (
    <div className={omni("notification-page")}>
        {header}
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
