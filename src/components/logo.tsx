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
      {/* Lupa */}
      <circle cx="10.5" cy="10.5" r="7.5" className="text-primary" />
      <line x1="21" y1="21" x2="15.8" y2="15.8" className="text-primary" />
      
      {/* Carrinho de Compras dentro da Lupa */}
      <g className="stroke-primary-foreground">
        <circle cx="8" cy="14" r="1" />
        <circle cx="13" cy="14" r="1" />
        <path d="M5.5 12h10l-1.5-6H7L5.5 12z" />
        <path d="M5.5 12H4.5a1 1 0 0 0-1 1v1h12v-2" />
      </g>
    </svg>
  );
}
