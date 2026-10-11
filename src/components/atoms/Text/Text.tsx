import { omni } from "@/helpers/omni";
import type { TextProps } from "../types";
import "./Text.css";

export default function Text({
  as: Tag = "p",
  variant = "primary",
  size = "md",
  weight = "regular",
  className,
  children,
  ...rest
}: TextProps) {
  const classes = [
    omni(
      "text",
      `text--${variant}`,
      `text--size-${size}`,
      `text--weight-${weight}`
    ),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag {...rest} className={classes}>
      {children}
    </Tag>
  );
}