import type { SVGProps } from 'react';

type PlaygroundRailIconProps = SVGProps<SVGSVGElement>;

/** Outline photo frame — inactive rail state */
export function PlaygroundImageOutlineIcon({ className, ...props }: PlaygroundRailIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

/** Filled photo — active rail state (Material-style solid landscape) */
export function PlaygroundImageFilledIcon({ className, ...props }: PlaygroundRailIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 13.5 11 16.51 14.5 12l4.5 6H5l3.5-4.5ZM9 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}
