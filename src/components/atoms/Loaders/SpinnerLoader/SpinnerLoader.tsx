import { omni } from "@/helpers/omni";
import "./SpinnerLoader.css";

export default function SpinnerLoader({
  variant = "paper",
  size = "sm",
}: {
  variant?: "primary" | "paper" | "secondary";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={omni(
        "spinner-loader",
        `spinner-loader--${variant}`,
        `spinner-loader--${size}`,
      )}
    ></div>
  );
}
