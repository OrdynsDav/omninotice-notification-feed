import { ComponentType, ReactElement } from "react";

export interface NotificationPicture {
  /** Путь к картинке */
  image?: string;
  /** Компонент с svg, готовый <svg>…</svg> или путь к svg-файлу */
  icon?: ComponentType | ReactElement | string;
  /** Эмодзи */
  emoji?: string;
}

export interface NotificationCardProps {
  status: string;
  time: string;
  title: string;
  description: string;
  picture: NotificationPicture;
  action: {
    url: string;
    title: string;
  };
  isRead: boolean;
}

export interface NotificationsStateProps {
  state: "empty" | "error";
  title?: string;
  description?: string;
  btn?: boolean;
}
