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
      
      {/* Carrinho de Compras dentro da Lupa */}
      <g 
        transform="translate(5.5, 6.5) scale(0.4)" 
        className="text-primary-foreground"
        strokeWidth="2.5"
      >
        <circle cx="6" cy="21" r="1" />
        <circle cx="18" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </g>
    </svg>
  );
}
