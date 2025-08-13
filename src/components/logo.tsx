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
      
      {/* Cifrão dentro da Lupa */}
      <g className="stroke-primary-foreground" strokeWidth="1.5">
         <text 
            x="10.5" 
            y="11.5" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="font-bold text-lg" 
            fill="currentColor" 
            stroke="none"
        >
            R$
        </text>
      </g>
    </svg>
  );
}
