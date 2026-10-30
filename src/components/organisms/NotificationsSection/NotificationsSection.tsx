import { omni } from "@/helpers/omni";
import "./NotificationsSection.css";
import { NotificationList } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { useNotifications } from "@/hooks/useNotifications";
import { useCallback, useMemo, useRef, useState } from "react";
import { toCardProps } from "@/api/notificationMapper";
import type { NotificationAction } from "@/api/actions";
import { useTab } from "@/hooks/useTab";
import NotificationsState from "@/components/molecules/NotificationsState/NotificationsState";

export default function NotificationsSection() {
  const {
    items,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    markRead,
    markAllRead,
  } = useNotifications({
    baseUrl: "/mock",
    buildUrl: (page) => `/mock/notifications-${page}.json`,
    token: "mock",
    projectId: "mock",
    perPage: 10,
  });
  const { decrementUnreadCount, clearUnreadCount, tab, unreadCount } = useTab();
  const pendingActionIdsRef = useRef(new Set<string>());
  const [actionError, setActionError] = useState<string | null>(null);

  const cards = useMemo(() => items.map(toCardProps), [items]);
  const visibleCards = useMemo(
    () => (tab === "unread" ? cards.filter((card) => !card.isRead) : cards),
    [cards, tab],
  );

  const handleAction = useCallback(
    async (action: NotificationAction) => {
      if (pendingActionIdsRef.current.has(action.id)) return false;
      pendingActionIdsRef.current.add(action.id);
      setActionError(null);
      try {
        const wasMarkedRead = await markRead(action.id);
        if (wasMarkedRead) {
          decrementUnreadCount();
        }
        return wasMarkedRead;
      } catch (cause) {
        setActionError(
          cause instanceof Error
            ? cause.message
            : "Не удалось выполнить действие",
        );
        return false;
      } finally {
        pendingActionIdsRef.current.delete(action.id);
      }
    },
    [decrementUnreadCount, markRead],
  );

  const handleMarkAllRead = () => {
    setActionError(null);
    markAllRead();
    clearUnreadCount();
  };

  return (
    <section className={omni("notifications")}>
      <div className={omni("notifications-action")}>
        <Button
          variant="link"
          onClick={handleMarkAllRead}
          disabled={isLoading || isLoadingMore || unreadCount === 0}
        >
          Прочитать все
        </Button>
      </div>

      {isLoading && items.length === 0 && <p>Загрузка...</p>}
      {error && <p>{error.message}</p>}
      {actionError && <p role="alert">{actionError}</p>}
      {tab === "unread" && !isLoading && visibleCards.length === 0 && (
        unreadCount === 0 || !hasMore ? (
          <NotificationsState state="allRead" />
        ) : (
          <p>На загруженных страницах нет непрочитанных уведомлений.</p>
        )
      )}

      <NotificationList
        notifications={visibleCards}
        onAction={handleAction}
      />

      {hasMore && !(tab === "unread" && unreadCount === 0) && (
        <div className={omni("notifications-action")}>
          <Button
            variant="link"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Загрузка..." : "Показать больше"}
          </Button>
        </div>
      )}
    </section>
  );
}
