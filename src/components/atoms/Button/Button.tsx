import { forwardRef } from "react";
import type { ForwardedRef, MouseEvent, ReactNode, ComponentType } from "react";
import type { ButtonProps } from "../types";
import { omni } from "@/helpers/omni";
import "./Button.css"
import { renderButtonContent } from "@/helpers/renderButtonContent";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    if (props.as === "a") {
      const {
        as: _as,
        variant = "primary",
        leftIcon,
        rightIcon,
        className,
        children,
        disabled,
        onClick,
        ...rest
      } = props;

      const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      };

      return (
        <a
          {...rest}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          className={omni("button",`button--${variant}`, className)}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : rest.tabIndex}
          onClick={handleClick}
        >
          {renderButtonContent(children, leftIcon, rightIcon)}
        </a>
      );
    }

    const {
      as: _as,
      variant = "primary",
      leftIcon,
      rightIcon,
      className,
      children,
      type = "button",
      ...rest
    } = props;

    return (
      <button
        {...rest}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type}
        className={omni("button",`button--${variant}`, className)}
      >
        {renderButtonContent(children, leftIcon, rightIcon)}
      </button>
    );
  },
);

export default Button;
