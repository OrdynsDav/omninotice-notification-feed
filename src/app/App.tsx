import { runAction } from "@core/actions";
import { apiFetch } from "@/api/apiFetch";
import { NotificationCountsResponseSchema } from "@/api/notificationCounts";
import { NotificationDetailsResponseSchema } from "@/api/notificationDetails";
import { NotificationsResponseSchema } from "@/api/notifications";
import NotificationFeedPage from "@/components/pages/NotificationFeedPage";
import type { SettingsOverrides } from "@/config/settings.config";
import "./App.css";
import { NotificationsProvider } from "./providers/NotificationsProvider";
import { NotificationList } from "@/components/molecules";

const auth = { token: "mock", projectId: "mock" };

const settings: SettingsOverrides = {
  sidebarBackdrop: false,
  autoLoadUnread: false,
};

// хелпер: пауза, которая прерывается вместе с запросом
const delay = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });

// --- тест: убрать после проверки ---
let failNext = true; // следующий запрос списка упадёт один раз
(window as unknown as { failNext: () => void }).failNext = () => {
  failNext = true;
};

async function testDelayAndFail(signal: AbortSignal) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (signal.aborted) return;
  if (failNext) {
    failNext = false;
    throw new Error("Тестовая ошибка");
  }
}
// --- конец теста ---

const emptyInfo = {
  api_version: "0.1.0",
  count: 0,
  total: 0,
  page: 1,
  page_size: 20,
};
function App() {
  return (
    <div className="app">
      <img src="/src/assets/menu.png" />
      <NotificationsProvider
        fetchList={async (page, signal) => {
          return apiFetch(
            `/mock/notifications-${page}.json`,
            NotificationsResponseSchema,
            { ...auth, signal },
          );
        }}
        fetchCounts={(signal) =>
          apiFetch(
            "/mock/notification-counts.json",
            NotificationCountsResponseSchema,
            { ...auth, signal },
          )
        }
        fetchDetails={async (messageId, signal) => {
          await delay(3000, signal);
          return apiFetch(
            `/mock/notification-details-${messageId}.json`,
            NotificationDetailsResponseSchema,
            { ...auth, signal },
          );
        }}
        onMarkRead={(messageId) =>
          runAction({ type: "mark-read", id: messageId })
        }
        settings={settings}
      >
        <NotificationFeedPage />
      </NotificationsProvider>
    </div>
  );
}

export default App;
