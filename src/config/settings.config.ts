import { BellRingIcon } from "@/components/atoms";

export const settings = {
    defaultIcon: BellRingIcon,
    notificationState: {
        empty: {
            title: "Пока нет уведомлений",
            description: "Здесь появятся объявления компании и сообщения о ваших задачах."
        },
        error: {
            title: "Не удалось загрузить уведомления",
            description: "Проверьте соединение и повторите. Ничего не потеряется."
        }
    }
}