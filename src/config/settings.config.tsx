import { BellRingIcon } from "@/components/atoms";
import CheckIcon from "@/components/atoms/icons/CheckIcon";
import type {
  NotificationPicture,
  NotificationState,
  NotificationsStateProps,
} from "@/components/molecules/types";
import type { ComponentType, ReactNode } from "react";

type NotificationStateContent = Omit<
  NotificationsStateProps,
  "btn" | "state"
> & {
  icon?: NotificationPicture["icon"];
};

export interface SettingsProps {
  defaultIcon?: ComponentType | ReactNode;
  notificationState?: Record<NotificationState, NotificationStateContent>;
}

export const settings = {
  defaultIcon: <BellRingIcon />,
  notificationState: {
    empty: {
      icon: <BellRingIcon />,
      title: "Пока нет уведомлений",
      description:
        "Здесь появятся объявления компании и сообщения о ваших задачах.",
    },
    error: {
      icon: <BellRingIcon />,
      title: "Не удалось загрузить уведомления",
      description: "Проверьте соединение и повторите. Ничего не потеряется.",
    },
    allRead: {
      icon: <CheckIcon />,
      title: "Все уведомления прочитаны",
      description: "Прочитанные уведомления — на вкладке «Все».",
    },
  },
} satisfies SettingsProps;
