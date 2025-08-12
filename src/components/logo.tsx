import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" className="text-primary" />
      <path d="m2.5 10.5 5 5" className="stroke-primary-foreground" />
      <path d="M12 2a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4Z" className="stroke-primary-foreground" />
    </svg>
  );
}
