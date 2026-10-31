import { omni } from "@/helpers/omni";
import { NotificationList } from "@/components/molecules";
import { Button, Text } from "@/components/atoms";
import { useCallback, useMemo, useRef, useState } from "react";
import { toCardProps } from "@/api/notificationMapper";
import type { NotificationAction } from "@/api/actions";
import { useTab } from "@/hooks/useTab";
import NotificationsState from "@/components/molecules/NotificationsState/NotificationsState";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import "./NotificationsSection.css";

export default function NotificationsSection() {
  const { state, onMarkRead, onLoadMore } = useNotificationsContext();
  const {
    items,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    markRead,
  } = state;
  const { tab, unreadCount } = useTab();
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
        const notification = items.find(
          (item) => item.chit.message_id === action.id,
        );
        if (!notification || notification.is_read) return false;

        await onMarkRead(action.id);
        const wasMarkedRead = markRead(action.id);
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
    [items, markRead, onMarkRead],
  );

  return (
    <section className={omni("notifications")}>
      {isLoading && items.length === 0 && <p>Загрузка...</p>}
      {error && <p>{error.message}</p>}
      {actionError && <p role="alert">{actionError}</p>}
      {tab === "unread" &&
        !isLoading &&
        visibleCards.length === 0 &&
        (unreadCount === 0 || !hasMore ? (
          <NotificationsState state="allRead" />
        ) : (
          <NotificationsState state="noUnreadLoaded" />
        ))}
      <NotificationList notifications={visibleCards} onAction={handleAction} /> 

      {hasMore && !(tab === "unread" && unreadCount === 0) && (
        <div className={omni("notifications-action")}>
          <Button
            variant="link"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Загрузка..." : "Показать больше"}
          </Button>
        </div>
      )}
    </section>
  );
}
