import { runAction } from "@core/actions";
import { apiFetch } from "@/api/apiFetch";
import { NotificationCountsResponseSchema } from "@/api/notificationCounts";
import { NotificationDetailsResponseSchema } from "@/api/notificationDetails";
import { NotificationsResponseSchema } from "@/api/notifications";
import NotificationFeedPage from "@/components/pages/NotificationFeedPage";
import type { SettingsOverrides } from "@/config/settings.config";
import "./App.css";
import { NotificationsProvider } from "./providers/NotificationsProvider";

const auth = { token: "mock", projectId: "mock" };

const settings: SettingsOverrides = {
  sidebarBackdrop: false,
  autoLoadUnread: false,
};

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

function App() {
  return (
    <div className="app">
      <img src="/src/assets/menu.png" />
      <NotificationsProvider
        fetchList={async (page, signal) => {
          await testDelayAndFail(signal);
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
        fetchDetails={(messageId, signal) =>
          apiFetch(
            `/mock/notification-details-${messageId}.json`,
            NotificationDetailsResponseSchema,
            { ...auth, signal },
          )
        }
        onMarkRead={(messageId) => runAction({ type: "mark-read", id: messageId })}
        settings={settings}
      >
        <NotificationFeedPage />
      </NotificationsProvider>
    </div>
  );
}

export default App;
