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

Unread notification cards dispatch
`{ type: "mark-read", id: "<message_id>" }` through `runAction` from
`@core/actions`. The “Прочитать все уведомления” button currently marks all
notifications read in local UI state without fetching remaining pages or
dispatching an action. Notifications loaded later are also treated as read for
the current feed session.

An optional `chit.action` with `url` and `title` is shown as a link in the
notification details sidebar.