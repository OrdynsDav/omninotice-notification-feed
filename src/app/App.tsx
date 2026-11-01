import type { SettingsOverrides } from "../config/settings.config";
import NotificationFeedPage from "../components/pages/NotificationFeedPage";
import { NotificationsProvider } from "./providers/NotificationsProvider";
import "./App.css";

const settings: SettingsOverrides = {
  sidebarBackdrop: false,
  autoLoadUnread: false,
};

function App() {
  return (
    <div className="app">
      <img src="/src/assets/menu.png" />
      <NotificationsProvider settings={settings}>
        <NotificationFeedPage />
      </NotificationsProvider>
    </div>
  );
}

export default App;
