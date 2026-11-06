# omninotice-notification-feed

Совместимость с Apiary: `^1.3.0`. Требуется React `>=18.2`.

**Карта:** [Подключение](#быстрое-подключение) · [Apiary-слот](#apiary-слот) ·
[Запросы](#запросы) · [Настройки](#настройки) · [API](#api-пакета) ·
[CSS-токены](#css-токены) · [Локальный просмотр](#локальный-просмотр)

## Быстрое подключение

```tsx
import {
  NotificationFeedPage,
  NotificationsFeedProvider,
} from "omninotice-notification-feed";
import "omninotice-notification-feed/style.css";

export function Notifications() {
  return (
    <NotificationsFeedProvider>
      <NotificationFeedPage />
    </NotificationsFeedProvider>
  );
}
```

Этот способ использует провайдеры `@core/data` и действие `@core/actions`.
Для обычного React-приложения без Apiary используйте точку входа
`omninotice-notification-feed/standalone` и передайте API-функции:

```tsx
import {
  NotificationFeedPage,
  NotificationsFeedProvider,
} from "omninotice-notification-feed/standalone";
import "omninotice-notification-feed/style.css";

const api = {
  fetchList: (page: number) => myApi.getNotifications({ page }),
  fetchCounts: () => myApi.getNotificationCounts(),
  fetchDetails: (messageId: string, signal?: AbortSignal) =>
    myApi.getNotificationDetails(messageId, { signal }),
  markRead: (messageId: string) => myApi.markNotificationRead(messageId),
};

export function Notifications() {
  return (
    <NotificationsFeedProvider api={api}>
      <NotificationFeedPage />
    </NotificationsFeedProvider>
  );
}
```

Функции API должны возвращать ответы в формате, описанном в разделе
[Запросы](#запросы). Передавайте `signal` в запрос деталей, чтобы он
отменялся при закрытии панели. `markRead` вызывается после успешной загрузки
деталей непрочитанного уведомления и при нажатии на действие карточки;
локальное состояние меняется только после успешного выполнения функции.
Существующий корневой импорт и Apiary-слот сохраняют прежний контракт.

### Apiary-слот

В точке входа приложения импортируйте регистрацию и стили:

```ts
import "omninotice-notification-feed/register-all";
import "omninotice-notification-feed/style.css";
```

Добавьте компонент в конфигурацию слота:

```ts
{ name: "sidebar", components: [{ id: "notifications", order: 2 }] }
```

Обёртка `NotificationsFeedProvider` и регистрация компонента выполняются пакетом.
Хост должен предоставлять `@core/hive`, `@core/data` и `@core/actions`.

## Запросы

Пакет вызывает провайдеры через `callProvider`. Зарегистрируйте обработчики в
`@core/data` под этими именами:

| Провайдер | Параметры | Результат |
| --- | --- | --- |
| `notifications.doocot.list` | `{ page: number }` | Ответ списка |
| `notifications.doocot.counts` | нет | Ответ счётчиков |
| `notifications.doocot.details` | `{ messageId: string, signal?: AbortSignal }` | Ответ деталей |

Пример обработчиков для хоста (замените URL на адреса своего API), которые
затем нужно зарегистрировать в `@core/data`:

```ts
import { NOTIFICATION_PROVIDERS } from "omninotice-notification-feed";

async function getJson(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export const notificationProviders = {
  [NOTIFICATION_PROVIDERS.list]: ({ page }: { page: number }) =>
    getJson(`/my/chits?page=${page}`),
  [NOTIFICATION_PROVIDERS.counts]: () =>
    getJson("/my/chits/status"),
  [NOTIFICATION_PROVIDERS.details]: ({
    messageId,
    signal,
  }: {
    messageId: string;
    signal?: AbortSignal;
  }) =>
    getJson(
      `/my/chit/${encodeURIComponent(messageId)}`,
      signal,
    ),
};
```

Каждый обработчик должен вернуть JSON-ответ в формате ниже. Если в приложении
уже есть API-клиент, используйте его вместо `fetch`.

Провайдер деталей должен передавать `signal` в сетевой запрос, например
`fetch(url, { signal })`: при закрытии панели запрос отменяется.

Все ответы имеют вид `{ detail, data, info }`. `data` — массив:

- список: элементы с `status`, `created_date`, `modified_date`, `is_read` и
  `chit` (`message_id`, `message_type`, `title`, `description`, `picture`,
  `action`);
- счётчики: первый элемент — `{ total_count, unread_count }`;
- детали: элемент списка с дополнительными `chit.text`, `chit.action` и
  `chit.extra`.

`info` содержит `api_version`, `count`, `total`, `page`, `page_size`.
Пустая страница завершает загрузку. Если стандартная пагинация по
`total_count` не подходит, передайте `getHasMore(info, loadedCount)` в
`NotificationsFeedProvider`.

После успешной загрузки деталей непрочитанного уведомления и при нажатии на
действие карточки пакет вызывает `runAction({ type: "mark-read", id })`, где
`id` — `messageId`. Зарегистрируйте обработчик этого действия в `@core/actions`:

```ts
async function markRead({ id }: { id: string }) {
  const response = await fetch(
    `/my/${encodeURIComponent(id)}/read`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chit_id: id }),
    },
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}
```

`id` передаётся как `chit_id` в URL и JSON-теле запроса. Подключите функцию к
действию `mark-read` в конфигурации `@core/actions`. При ошибке пакет показывает
сообщение, а локально отмечает уведомление прочитанным только после успеха.

## Настройки

Передайте настройки в `NotificationsFeedProvider`:

```tsx
<NotificationsFeedProvider
  settings={{
    pageTitle: "Уведомления",
    pageSubtitle: "Новости и задачи",
    autoLoadUnread: true,
    sidebarBackdrop: true,
  }}
>
  <NotificationFeedPage header={<MyHeader />} />
</NotificationsFeedProvider>
```

| Настройка | По умолчанию | Назначение |
| --- | --- | --- |
| `pageTitle` | `Уведомления` | Заголовок |
| `pageSubtitle` | описание ленты | Подзаголовок |
| `autoLoadUnread` | `true` | Загружать страницы, пока не найдутся непрочитанные |
| `sidebarBackdrop` | `true` | Затемнение за панелью деталей |
| `defaultIcon` | иконка уведомления | Иконка без изображения |
| `notificationState` | тексты пакета | Содержимое состояний `empty`, `error`, `allRead`, `noUnreadLoaded` |

Для `notificationState` можно переопределить `title`, `description`, `btn`
(`title`, `onClick`), `className` и `icon`. Настройки объединяются с
значениями по умолчанию. `defaultIcon` и `notificationState` доступны при
прямом использовании `NotificationsFeedProvider`; в `SlotComponentProps.settings`
поддерживаются только первые четыре настройки таблицы.

`NotificationFeedPage` принимает необязательный `header` — React-узел перед
заголовком страницы.

## API пакета

Из корневого импорта экспортируются `NotificationsFeedProvider`,
`NotificationFeedPage`, `SettingsOverrides`, `GetHasMore`, `NOTIFICATION_PROVIDERS`,
типы ответов и уведомлений (`NotificationsResponse`, `Notification`,
`NotificationCountsResponse`, `NotificationDetailsResponse`) и соответствующие
схемы (`NotificationsResponseSchema`, `NotificationCountsResponseSchema`,
`NotificationDetailsResponseSchema` и схемы элементов). Детали показывают
`chit.text`, а при его отсутствии — `chit.description`; `chit.action`
отображается как ссылка.

## CSS-токены

Чтобы переопределить оформление, задайте публичные токены `--onf-*` на
родительском элементе `NotificationFeedPage`. Переносить переменные в `:root`
не нужно:

```css
.my-notifications {
  --onf-primary: #7c3aed;
  --onf-radius: 12px;
  --onf-card-bg: #fff;
}
```

```tsx
<div className="my-notifications">
  <NotificationFeedPage />
</div>
```

Публичные токены:

| Токен | Назначение |
| --- | --- |
| `--onf-main-bg` | фон страницы |
| `--onf-primary`, `--onf-primary-hover` | основной цвет и цвет при наведении |
| `--onf-primary-text`, `--onf-secondary-text` | основной и вторичный текст |
| `--onf-icon` | цвет иконки-крошки |
| `--onf-sidebar-box-shadow`, `--onf-state-box-shadow` | тени панели и состояния |
| `--onf-card-bg`, `--onf-card-bg-hover` | фон карточки и при наведении |
| `--onf-icon-color`, `--onf-icon-bg` | цвет и фон иконки уведомления |
| `--onf-error-icon-color`, `--onf-error-icon-bg` | цвет и фон иконки ошибки |
| `--onf-border-color`, `--onf-border-hover` | цвет границы и цвет при наведении |
| `--onf-radius` | радиус скругления |
| `--onf-container-padding-inline` | горизонтальные отступы контейнера |
| `--onf-icon-container-size`, `--onf-icon-chevron-size` | размеры иконки и шеврона |
| `--onf-tabs-margin-block` | вертикальные отступы вкладок |
| `--onf-transition` | длительность и функция перехода |

Если `--onf-*` не задан, пакет сохраняет значения по умолчанию и совместимость
с цветовыми переменными хоста `--color-*` и `--radius-md`. Внутренние
`--omni-*` — детали реализации, для переопределения используйте `--onf-*`.
Стили компонентов изолированы CSS Modules.

## Локальный просмотр

`npm run dev` запускает превью с моками из `public/mock`. Создайте их командой
`npm run generate:mock`; после клонирования её нужно выполнить один раз.
