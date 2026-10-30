import { t, type Infer } from './schema';

const maybeString = t.optional(t.nullable(t.string));

const PictureSchema = t.object({
  main: maybeString,
  preview: maybeString,
  cover: maybeString,
  icon: maybeString,
  emoji: maybeString
});

const ActionSchema = t.object({
  url: t.string,
  title: t.string
});

export const NotificationSchema = t.object({
  status: t.string,
  created_date: t.string,
  modified_date: t.string,
  chit: t.object({
    status: t.string,
    created_date: t.string,
    modified_date: t.string,
    message_type: t.string,
    title: t.string,
    description: maybeString,
    picture: t.optional(t.nullable(PictureSchema)),
    action: t.optional(t.nullable(ActionSchema)),
    message_id: t.string
  }),
  is_read: t.boolean
});

export const NotificationsResponseSchema = t.object({
  data: t.array(NotificationSchema),
  info: t.object({
    api_version: t.string,
    count: t.number,
    total: t.number,
    page: t.number,
    page_size: t.number
  })
});

export type Notification = Infer<typeof NotificationSchema>;
export type NotificationsInfo = Infer<
  typeof NotificationsResponseSchema
>['info'];