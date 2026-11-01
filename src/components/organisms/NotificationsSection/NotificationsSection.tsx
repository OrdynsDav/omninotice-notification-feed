import { omni } from "@/helpers/omni";
import { NotificationList } from "@/components/molecules";
import { Button, SpinnerLoader, Text } from "@/components/atoms";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toCardProps } from "@/api/notificationMapper";
import type { NotificationAction } from "@/api/actions";
import { useTab } from "@/hooks/useTab";
import NotificationsState from "@/components/molecules/NotificationsState/NotificationsState";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import "./NotificationsSection.css";
import { useNotificationSettings } from "@/config/SettingsContext";

export default function NotificationsSection() {
  const { state, onMarkRead } = useNotificationsContext();
  const {
    items,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    markRead,
    loadMore,
    retry,
  } = state;
  const { tab, unreadCount } = useTab();
  const { autoLoadUnread } = useNotificationSettings();
  const pendingActionIdsRef = useRef(new Set<string>());
  const [actionError, setActionError] = useState<string | null>(null);
  const cards = useMemo(() => items.map(toCardProps), [items]);
  const visibleCards = useMemo(
    () => (tab === "unread" ? cards.filter((card) => !card.isRead) : cards),
    [cards, tab],
  );

  const needsMoreUnread =
    tab === "unread" &&
    !isLoading &&
    !isLoadingMore &&
    !error &&
    visibleCards.length === 0 &&
    unreadCount > 0 &&
    hasMore;

  useEffect(() => {
    if (needsMoreUnread && autoLoadUnread) loadMore();
  }, [needsMoreUnread, autoLoadUnread, loadMore]);

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
      {isLoading && items.length === 0 && (
        <div className={omni("notifications-loader-container")}>
          <SpinnerLoader variant="primary" size="lg"/>
        </div>
      )}
      {error && (
        <NotificationsState
          state="error"
          description={error.message}
          btn={{ onClick: retry }}
        />
      )}
      {actionError && <p role="alert">{actionError}</p>}
      {tab === "unread" &&
        !isLoading &&
        !error &&
        visibleCards.length === 0 &&
        (unreadCount === 0 || !hasMore ? (
          <NotificationsState state="allRead" />
        ) : autoLoadUnread ? null : (
          <NotificationsState
            state="noUnreadLoaded"
            btn={{ onClick: loadMore }}
          />
        ))}
      <NotificationList notifications={visibleCards} onAction={handleAction} />

      {hasMore && !(tab === "unread" && unreadCount === 0) && (
        <div className={omni("notifications-action")}>
          <Button variant="link" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Загрузка..." : "Показать больше"}
          </Button>
        </div>
      )}
    </section>
  );
}
