# omninotice-notification-feed

Apiary compatibility: `^1.3.0`.

## Registering in an Apiary host

Build and publish/install this package, then import its registration entry once
from the host application's startup module:

```ts
import "omninotice-notification-feed/register-all";
import "omninotice-notification-feed/style.css";
```

The registration entry calls
`registerSlotComponent("notifications", NotificationFeedPage)`. It registers
the existing page component directly; it does not introduce a replacement UI
or combine the existing component tree.

The host application owns all notification requests. `useNotifications` keeps
the feed state, and `NotificationsProvider` shares it with the package page:

```tsx
import {
  NotificationFeedPage,
  NotificationsProvider,
  useNotifications,
} from "omninotice-notification-feed";

function Notifications() {
  const state = useNotifications({ perPage: 20 });

  const loadMore = async () => {
    state.setIsLoadingMore(true);
    try {
      const response = await hostApi.notifications.list({
        page: state.page + 1,
        perPage: 20,
      });
      state.appendPage(response.data, response.info, response.info.page);
    } catch (error) {
      state.setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      state.setIsLoadingMore(false);
    }
  };

  return (
    <NotificationsProvider
      value={state}
      onMarkRead={(id) => hostApi.notifications.markRead(id)}
      onLoadMore={loadMore}
    >
      <NotificationFeedPage />
    </NotificationsProvider>
  );
}
```

The host fetches notification pages and counts, updates loading/error state
through the returned controller (for example, `replacePage` and `setCounts`),
and supplies its own mark-read request. After that request succeeds, the page
updates its local read state and unread count. `register-all` can be used in a
host tree wrapped by the same provider.

An optional `chit.action` with `url` and `title` is shown as a link in the
notification details sidebar.