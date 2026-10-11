import { InputProps } from "../types";
import "./Input.css"

export default function Input({ leftIcon: LeftIcon, ...rest }: InputProps) {
  return (
    <div className="custom-input">
      {LeftIcon && (
        <div className="custom-input__icon">
            <LeftIcon />
        </div>
      )}
      <input className="custom-input__field" {...rest} />
    </div>
  );
}
