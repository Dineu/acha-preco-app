import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Lupa (baseada no desenho) */}
      <g className="text-primary" strokeWidth="2.5">
        <circle cx="10.5" cy="10.5" r="8.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </g>
      
      {/* Carrinho de Compras (baseado no desenho) */}
      <g className="stroke-primary-foreground" strokeWidth="2" transform="translate(5.5, 6.5) scale(0.65)">
        <path d="M6 14.5h11l-1.5-6h-9z" />
        <path d="M6 8.5v-2a1 1 0 0 1 1-1h1" />
        <circle cx="7" cy="18.5" r="1" />
        <circle cx="15" cy="18.5" r="1" />
      </g>
    </svg>
  );
}
