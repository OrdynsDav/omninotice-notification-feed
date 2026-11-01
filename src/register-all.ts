import { createElement } from "react";
import type { SlotComponentProps } from "@core/hive";
import { registerSlotComponent } from "@core/hive/react";
import NotificationFeedPage from "./components/pages/NotificationFeedPage";

function NotificationFeedSlot(_props: SlotComponentProps) {
  return createElement(NotificationFeedPage);
}

registerSlotComponent("notifications", NotificationFeedSlot);
