# omninotice-notification-feed

Apiary compatibility: `^1.3.0`.

## Usage

The package reads notification data through Apiary data providers. Register
these providers in the host; loading, error states, pagination, merging pages,
the unread counter and read marks are handled inside the package.

```tsx
import {
  NotificationFeedPage,
  NotificationsProvider,
} from "omninotice-notification-feed";
import "omninotice-notification-feed/style.css";

function Notifications() {
  return (
    <NotificationsProvider>
      <NotificationFeedPage
        header={<h1>Company notifications</h1>}
      />
    </NotificationsProvider>
  );
}
```

`header` is optional and accepts any React node (for example, a component or
custom JSX). It is rendered before the page title.

The host must register the following providers with `@core/data`:

| Provider name | Parameters | Result |
| --- | --- | --- |
| `notifications.doocot.list` | `{ page: number }` | `NotificationsResponse` |
| `notifications.doocot.counts` | none | `NotificationCountsResponse` |
| `notifications.doocot.details` | `{ messageId: string, signal?: AbortSignal }` | `NotificationDetailsResponse` |

The details provider must pass the optional `signal` to its network request
(for example, `fetch(url, { signal })`) so closing the sidebar can cancel the
request itself.

The package executes the read action through
`runAction({ type: "mark-read", id })` after details load successfully for an
unread notification. Register the corresponding action in the host.

The slot reads JSON-safe presentation settings from `SlotComponentProps.settings`:
`sidebarBackdrop`, `autoLoadUnread`, `pageTitle`, and `pageSubtitle`.

| Prop           | Required | Called                                         | Must return                                  |
| -------------- | -------- | ---------------------------------------------- | -------------------------------------------- |
| `getHasMore`   | no       | after every page                               | `boolean`: are there more pages. Gets `(info, loadedCount)` |
| `settings`     | no       |                                                | see `SettingsOverrides`                      |
| `header`       | no       |                                                | React node rendered before the default title |

Notes:

- Whether to show "Show more" is decided by
  `getHasMore(info, loadedCount)` if you pass it;
  otherwise the package compares the loaded count with `total_count` from
  the counts provider. An empty page always ends the list.
- Failed provider calls show the error state; its "Retry" button repeats the
  failed request. The package ignores stale results after a request is
  superseded or the details sidebar closes. The details provider receives an
  optional `AbortSignal`; it must forward it to its network request to stop
  the underlying work.

### Responses

All three providers return the backend envelope `{ detail, data, info }`:

- list: `data` is an array of `{ status, created_date, modified_date, chit, is_read }`;
- counts: `data[0]` is `{ total_count, unread_count }`;
- details: `data[0]` is the same item as in the list, with `chit.text`,
  `chit.action` (`{ url, title, type }`) and `chit.extra` added.

The details sidebar shows `chit.text` (falls back to `chit.description`) and
`chit.action` as a link.

Types and runtime schemas are exported (`NotificationsResponse`,
`NotificationCountsResponse`, `NotificationDetailsResponse`,
`NotificationsResponseSchema`, ...) if you want to type or validate your client.

The published stylesheet defines `--omni-*` variables on the page root from
Apiary theme tokens when available:
`--color-primary`, `--color-primary-hover`, `--color-text-primary`,
`--color-text-secondary`, `--color-shadow`, `--color-surface`,
`--color-bg-hover`, `--color-primary-soft`, `--color-danger`,
`--color-danger-soft`, and `--radius-md`. Local values remain as fallbacks;
layout-specific values continue to use the package defaults. CSS Modules scope
component styles; variables are not declared on `:root`.

## Registering in an Apiary host

Build and publish/install this package, then import its registration entry once
from the host application's startup module:

```ts
import "omninotice-notification-feed/register-all";
import "omninotice-notification-feed/style.css";
```

The registration entry calls
`registerSlotComponent("notifications", NotificationFeedSlot)` and wraps the
page in `NotificationsProvider`, so no provider wrapper is needed in the host
tree. When rendering `NotificationFeedPage` directly, wrap it in
`NotificationsProvider` as shown above.
The host provides `@core/hive`, `@core/data` and `@core/actions`; the package
keeps these Apiary modules external rather than bundling them.

Add `"notifications"` to `SlotConfig.components` in the desired slot:

```ts
{
  name: "sidebar",
  components: [{ id: "notifications", order: 2 }],
}
```

## Local preview and mocks

`npm run dev` runs the preview app (`src/app/App.tsx`) against static files in
`public/mock`. Generate them with `npm run generate:mock`; the files for the
counts and for the details are git-ignored, so run it once after cloning.
In the preview the first list request fails on purpose (to check the error
state); call `failNext()` in the browser console to make the next one fail again.
