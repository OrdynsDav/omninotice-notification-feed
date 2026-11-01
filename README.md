# omninotice-notification-feed

Apiary compatibility: `^1.3.0`.

## Usage

You make the requests, the package does the rest. Pass functions that call your
backend and return its response as is; loading and error states, pagination,
merging pages, the unread counter and read marks are handled inside the package.

```tsx
import {
  NotificationFeedPage,
  NotificationsProvider,
} from "omninotice-notification-feed";
import "omninotice-notification-feed/style.css";

function Notifications() {
  return (
    <NotificationsProvider
      fetchList={(page, signal) => hostApi.notifications.list({ page, pageSize: 20 }, signal)}
      fetchCounts={(signal) => hostApi.notifications.counts(signal)}
      fetchDetails={(messageId, signal) => hostApi.notifications.details(messageId, signal)}
      onMarkRead={(messageId) => hostApi.notifications.markRead(messageId)}
    >
      <NotificationFeedPage />
    </NotificationsProvider>
  );
}
```

| Prop           | Required | Called                                         | Must return                                  |
| -------------- | -------- | ---------------------------------------------- | -------------------------------------------- |
| `fetchList`    | yes      | on mount, then for every next page (from `1`)  | `NotificationsResponse`                      |
| `fetchCounts`  | yes      | on mount, together with page `1`               | `NotificationCountsResponse`                 |
| `fetchDetails` | no       | when a notification is opened                  | `NotificationDetailsResponse`                |
| `onMarkRead`   | yes      | when an unread notification is opened          | any promise; the package updates the feed and the counter after it resolves |
| `getHasMore`   | no       | after every page                               | `boolean`: are there more pages. Gets `(info, loadedCount)` |
| `settings`     | no       |                                                | see `SettingsOverrides`                      |

Notes:

- Page size is yours: put it in the `fetchList` request. Whether to show
  "Show more" is decided by `getHasMore(info, loadedCount)` if you pass it;
  otherwise the package compares the loaded count with `total_count` from
  `fetchCounts`. An empty page always ends the list.
- Every request gets an `AbortSignal`. Pass it to `fetch` so that stale requests
  are cancelled. A rejected promise shows the error state; its "Retry" button
  repeats the request that failed.
- Without `fetchDetails` the sidebar shows what the card already has.
- Functions may be created inline on every render, no `useCallback` needed.

### Responses

All three requests return the backend envelope `{ detail, data, info }`:

- list: `data` is an array of `{ status, created_date, modified_date, chit, is_read }`;
- counts: `data[0]` is `{ total_count, unread_count }`;
- details: `data[0]` is the same item as in the list, with `chit.text`,
  `chit.action` (`{ url, title, type }`) and `chit.extra` added.

The details sidebar shows `chit.text` (falls back to `chit.description`) and
`chit.action` as a link.

Types and runtime schemas are exported (`NotificationsResponse`,
`NotificationCountsResponse`, `NotificationDetailsResponse`,
`NotificationsResponseSchema`, ...) if you want to type or validate your client.

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
or combine the existing component tree. `register-all` can be used in a host
tree wrapped by `NotificationsProvider`.

## Local preview and mocks

`npm run dev` runs the preview app (`src/app/App.tsx`) against static files in
`public/mock`. Generate them with `npm run generate:mock`; the files for the
counts and for the details are git-ignored, so run it once after cloning.
In the preview the first list request fails on purpose (to check the error
state); call `failNext()` in the browser console to make the next one fail again.
