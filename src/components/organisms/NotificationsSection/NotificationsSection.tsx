import { omni } from "@/helpers/omni";
import { mockNotifications } from "@/mock/notifications";
import "./NotificationsSection.css";
import { NotificationList } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { useNotifications } from "@/hooks/useNotifications";
import { useMemo } from "react";
import { toCardProps } from "@/api/notificationMapper";

export default function NotificationsSection() {
  const { items, error, isLoading, isLoadingMore, hasMore, loadMore } =
    useNotifications({
      baseUrl: "/mock",
      buildUrl: (page) => `/mock/notifications-${page}.json`,
      token: "mock",
      projectId: "mock",
      perPage: 10,
    });

  const cards = useMemo(() => items.map(toCardProps), [items]);

  return (
    <section className={omni("notifications")}>
      <div className={omni("notifications-action")}>
        <Button variant="link">Прочитать все</Button>
      </div>

      {isLoading && items.length === 0 && <p>Загрузка...</p>}
      {error && <p>{error.message}</p>}

      <NotificationList notifications={cards} />

      {hasMore && (
        <div className={omni("notifications-action")}>
          <Button variant="link" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Загрузка..." : "Показать больше"}
          </Button>
        </div>
      )}
    </section>
  );
}
