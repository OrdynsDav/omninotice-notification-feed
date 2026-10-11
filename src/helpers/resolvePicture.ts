import { isValidElement } from "react";
import type { ComponentType, ReactElement } from "react";
import { isEmoji } from "./isEmoji"; // твой существующий хелпер
import { NotificationPicture } from "@/components/molecules/types";

export type ResolvedPicture =
  | { kind: "image"; src: string }
  | { kind: "element"; element: ReactElement }
  | { kind: "component"; Component: ComponentType }
  | { kind: "emoji"; value: string }
  | { kind: "default" };

export function resolvePicture(
  picture: NotificationPicture,
  isFailed: (src: string) => boolean,
): ResolvedPicture {
  const { image, icon, emoji } = picture;

  // 1. image: путь к картинке
  if (image && !isFailed(image)) {
    return { kind: "image", src: image };
  }

  // 2. icon: путь к svg / готовый <svg> / компонент
  if (icon) {
    if (typeof icon === "string") {
      if (!isFailed(icon)) return { kind: "image", src: icon };
    } else if (isValidElement(icon)) {
      return { kind: "element", element: icon };
    } else {
      return { kind: "component", Component: icon as ComponentType };
    }
  }

  // 3. emoji
  if (emoji && isEmoji(emoji)) {
    return { kind: "emoji", value: emoji.trim() };
  }

  // 4. иконка по умолчанию
  return { kind: "default" };
}
