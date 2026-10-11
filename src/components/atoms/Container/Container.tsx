import { omni } from "@/helpers/omni";
import { type ReactNode } from "react";
import "./Container.css"

export default function Container({ children }: { children: ReactNode }) {
  return <div className={omni("container")}>{children}</div>;
}
