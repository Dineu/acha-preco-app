import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Lupa (parte externa) - Ajustada para não cortar */}
      <circle cx="11" cy="11" r="8" className="text-primary" />
      <line x1="17" y1="17" x2="21" y2="21" className="text-primary" />
      
      {/* Carrinho de Compras (dentro da lupa) - Menor */}
      <g className="stroke-primary-foreground" transform="translate(5, 5.5) scale(0.5)" strokeWidth="2.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </g>
    </svg>
  );
}
