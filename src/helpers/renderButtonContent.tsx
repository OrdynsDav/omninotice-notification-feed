import { ComponentType, ReactNode } from "react";
import { omni } from "./omni";

export const renderButtonContent = (
  children: ReactNode,
  LeftIcon?: ComponentType,
  RightIcon?: ComponentType,
) => (
  <>
    {LeftIcon ? (
      <span className={omni("button__icon", "button__icon--left")}>
        <LeftIcon />
      </span>
    ) : null}
    {children}
    {RightIcon ? (
      <span className={omni("button__icon", "button__icon--right")}>
        <RightIcon />
      </span>
    ) : null}
  </>
);