import { IconProps } from "../types";

export default function SearchIcon({width = 15, height = 15}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.875 13.875L10.5654 10.5714M10.5654 10.5714C11.6477 9.49063 12.3173 7.99659 12.3173 6.34615C12.3173 3.04838 9.64393 0.375 6.34615 0.375C3.04838 0.375 0.375 3.04838 0.375 6.34615C0.375 9.64393 3.04838 12.3173 6.34615 12.3173C7.99349 12.3173 9.48503 11.6502 10.5654 10.5714Z"
        strokeWidth="0.75"
        strokeLinecap="round"
        stroke="currentColor"
      />
    </svg>
  );
}
