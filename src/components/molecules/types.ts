import { ComponentType, ReactNode } from "react";
import type { NotificationAction } from "@/api/actions";

export type NotificationState = "empty" | "error" | "allRead" | "noUnreadLoaded";

export interface NotificationPicture {
  /** Путь к картинке */
  image?: string;
  /** Компонент с svg, готовый <svg>…</svg> или путь к svg-файлу */
  icon?: ComponentType | ReactNode;
  /** Эмодзи */
  emoji?: string;
}

export interface NotificationCardProps {
  messageId?: string;
  status: string;
  createdAt?: string;
  time: string;
  title: string;
  description: string;
  picture: NotificationPicture;
  action?: {
    url: string;
    title: string;
  };
  readAction?: NotificationAction | null;
  isRead: boolean;
  isActionPending?: boolean;
  onAction?: (action: NotificationAction) => void | Promise<unknown>;
  onSelect?: (notification: NotificationDetails) => void;
}

export interface NotificationBtn {
  title: string;
  onClick?: () => void;
}

export interface NotificationsStateProps {
  state: NotificationState;
  title?: string;
  description?: string;
  btn?: Partial<NotificationBtn>;
  className?: string;
}

export type NotificationDetails = Pick<
  NotificationCardProps,
  "messageId" | "title" | "description" | "action"
> & {
  /** Полный текст уведомления (есть только в ответе деталей) */
  text?: string;
};

export type NotificationDetailsView =
  | { status: "closed" }
  | { status: "loading"; preview: NotificationDetails }
  | { status: "ready"; details: NotificationDetails }
  | { status: "error"; preview: NotificationDetails };

/** Запрос деталей, который пишет потребитель пакета */
export type LoadNotificationDetails = (
  messageId: string,
  signal: AbortSignal,
) => Promise<NotificationDetails>;

export interface NotificationsStateProps {
  state: NotificationState;
  title?: string;
  description?: string;
  btn?: Partial<NotificationBtn>;
}
