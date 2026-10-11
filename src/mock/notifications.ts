import { BellRingIcon } from "@/components/atoms";
import { NotificationCardProps } from "@/components/molecules/types";

export const mockNotifications: NotificationCardProps[] = [
  {
    status: "info",
    time: "2 минуты назад",
    title: "Новый комментарий",
    description:
      "Анна Смирнова оставила комментарий к вашему pull request #142.",
    picture: { image: "https://picsum.photos/seed/anna/96" },
    action: { url: "https://example.com/pr/142", title: "Открыть PR" },
    isRead: true,
  },
  {
    status: "success",
    time: "15 минут назад",
    title: "Деплой завершён",
    description: "Версия 2.0.0 успешно выкачена на production.",
    picture: { icon: "https://api.iconify.design/lucide:rocket.svg" },
    action: {
      url: "https://example.com/deploys/2-0-0",
      title: "Посмотреть деплой",
    },
    isRead: true,
  },
  {
    status: "warning",
    time: "1 час назад",
    title: "Заканчивается место",
    description:
      "Хранилище заполнено на 92%. Освободите место или расширьте тариф.",
    picture: { icon: "https://api.iconify.design/lucide:hard-drive.svg" },
    action: {
      url: "https://example.com/storage",
      title: "Управление хранилищем",
    },
    isRead: true,
  },
  {
    status: "error",
    time: "2 часа назад",
    title: "Сборка упала",
    description: "Пайплайн #873 завершился с ошибкой на шаге «Run tests».",
    picture: { emoji: "🔥" },
    action: { url: "https://example.com/pipelines/873", title: "Открыть логи" },
    isRead: true,
  },
  {
    status: "info",
    time: "Сегодня, 12:30",
    title: "Напоминание о встрече",
    description: "Созвон с заказчиком по проекту начнётся через 30 минут.",
    picture: { icon: BellRingIcon },
    action: {
      url: "https://example.com/calendar/event/55",
      title: "Присоединиться",
    },
    isRead: true,
  },
  {
    status: "success",
    time: "Вчера, 18:04",
    title: "Оплата получена",
    description: "Заказ №4521 оплачен. Можно приступать к работе.",
    picture: { emoji: "💸" },
    action: {
      url: "https://example.com/orders/4521",
      title: "Перейти к заказу",
    },
    isRead: true,
  },
  {
    status: "info",
    time: "Вчера, 09:15",
    title: "Новый подписчик",
    description: "На вас подписался Дмитрий Орлов.",
    picture: { image: "https://picsum.photos/seed/dmitry/96" },
    action: {
      url: "https://example.com/users/dmitry",
      title: "Посмотреть профиль",
    },
    isRead: true,
  },
  {
    status: "warning",
    time: "2 дня назад",
    title: "Устаревшая зависимость",
    description:
      "Пакет react-markdown имеет критическое обновление безопасности.",
    picture: { icon: BellRingIcon },
    action: {
      url: "https://example.com/security/advisories",
      title: "Подробнее",
    },
    isRead: true,
  },
  {
    status: "error",
    time: "3 дня назад",
    title: "Не удалось загрузить аватар",
    description: "Картинка битая: должен сработать fallback на эмодзи.",
    picture: {
      image: "https://broken.example.invalid/avatar.png",
      icon: "https://broken.example.invalid/icon.svg",
      emoji: "🖼️",
    },
    action: {
      url: "https://example.com/settings/profile",
      title: "Загрузить заново",
    },
    isRead: true,
  },
  {
    status: "info",
    time: "Неделю назад",
    title: "Добро пожаловать!",
    description:
      "Аккаунт создан. Здесь без картинки, поэтому должна показаться иконка по умолчанию.",
    picture: {},
    action: { url: "https://example.com/onboarding", title: "Начать" },
    isRead: false,
  },
];
