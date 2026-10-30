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

Unread notification cards and the “Прочитать загруженные” button dispatch
`{ type: "mark-read", id: "<message_id>" }` through `runAction` from
`@core/actions`. The UI marks each notification as read and decrements the
unread counter only after that action succeeds. If the host rejects an action,
the error is shown and the notification remains unread.

An optional `chit.action` with `url` and `title` is shown as a link in the
notification details sidebar.