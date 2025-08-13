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
      {/* Lupa (parte externa) - Aumentada */}
      <circle cx="10" cy="10" r="9" className="text-primary" />
      <line x1="18" y1="18" x2="22" y2="22" className="text-primary" />
      
      {/* Carrinho de Compras (dentro da lupa) */}
      <g className="stroke-primary-foreground" transform="translate(2, 2) scale(0.7)">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </g>
    </svg>
  );
}
