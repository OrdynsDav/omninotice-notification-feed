import type { ReactNode } from "react";
import { NotificationsSection } from "../organisms";
import { Container } from "../atoms";
import { PageTitle, Tab } from "../molecules";
import styles from "./NotificationFeedPage.module.css";
import NotificationsRoot from "../organisms/NotificationsRoot/NotificationsRoot";
import { classNames } from "../../helpers/classNames";

export interface NotificationFeedPageProps {
  /** Optional custom content rendered before the default page title. */
  header?: ReactNode;
  /** Optional class applied to the page root element. */
  className?: string;
  /** Optional class applied to the notifications section. */
  sectionClassName?: string;
  slot?: string;
  variant?: string;
}

export default function NotificationFeedPage({
  header,
  className,
  sectionClassName,
  slot,
  variant,
}: NotificationFeedPageProps) {
  return (
    <div
      className={classNames(styles.page, className)}
      data-slot={slot}
      data-variant={variant}
    >
      {header}
      <Container>
        <PageTitle />
        <NotificationsRoot>
          <Tab />
          <NotificationsSection className={sectionClassName} />
        </NotificationsRoot>
      </Container>
    </div>
  );
}
