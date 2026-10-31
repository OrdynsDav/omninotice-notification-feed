import { createElement, type ReactNode } from "react";
import { NotificationsContext } from "../contexts/NotificationsContext";
import type { NotificationsState } from "@/hooks/useNotifications";
import {
  resolveSettings,
  type SettingsOverrides,
} from "@/config/settings.config";
import { SettingsContext } from "@/config/SettingsContext";

export interface NotificationsProviderProps {
  value: NotificationsState;
  onMarkRead: (messageId: string) => Promise<unknown>;
  onLoadMore: () => void | Promise<unknown>;
  settings?: SettingsOverrides;
  children: ReactNode;
}

export function NotificationsProvider({
  value,
  onMarkRead,
  onLoadMore,
  settings,
  children,
}: NotificationsProviderProps) {
  return createElement(
    SettingsContext.Provider,
    { value: resolveSettings(settings) },
    createElement(
      NotificationsContext.Provider,
      { value: { state: value, onMarkRead, onLoadMore } },
      children,
    ),
  );
}