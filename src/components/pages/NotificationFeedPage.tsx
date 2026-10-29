import { Header, NotificationsSection } from "@/components/organisms";
import { Container } from "@/components/atoms";
import { PageTitle, Tab } from "@/components/molecules";
import TabProvider from "@/app/providers/TabProvider";
import "./NotificationFeedPage.css"
import { omni } from "@/helpers/omni";
import NotificationsRoot from "../organisms/NotificationsRoot/NotificationsRoot";
import NotificationDetailsSidebar from "../organisms/NotificationDetailsSidebar/NotificationDetailsSidebar";
import type { NotificationDetails } from "@/components/molecules/types";
import { useState } from "react";

export default function NotificationFeedPage() {
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationDetails | null>(null);

  return (
    <div className={omni("notification-page")}>
      <Header />
        <Container>
          <PageTitle />
          <NotificationsRoot>
            <Tab />
            <NotificationsSection
              onSelectNotification={setSelectedNotification}
              onNotificationRead={(id) => {
                setSelectedNotification((current) =>
                  current?.messageId === id
                    ? { ...current, isRead: true }
                    : current,
                );
              }}
            />
          </NotificationsRoot>
        </Container>
      <NotificationDetailsSidebar
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  );
}
