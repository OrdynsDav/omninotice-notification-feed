import { t, type Infer } from "./schema";

export const NotificationCountsSchema = t.object({
  all: t.number,
  unread: t.number,
});

export type NotificationCounts = Infer<typeof NotificationCountsSchema>;