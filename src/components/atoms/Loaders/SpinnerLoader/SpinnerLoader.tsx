import { omni } from "@/helpers/omni";
import "./SpinnerLoader.css"

export default function SpinnerLoader({variant = "paper"}: {variant?: "primary" | "paper" | "secondary"}) {
  return <div className={omni("spinner-loader", `spinner-loader--${variant}`)}></div>;
}
