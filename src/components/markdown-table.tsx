
'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface MarkdownTableProps {
  markdown: string;
}

export function MarkdownTable({ markdown }: MarkdownTableProps) {
  if (!markdown) return null;

  const lines = markdown.trim().split('\n');
  
  // Find header and separator lines
  const headerIndex = lines.findIndex(line => line.includes('|') && !line.startsWith('--'));
  if (headerIndex === -1) return <pre>{markdown}</pre>; // Not a table

  const separatorIndex = lines.findIndex((line, i) => i > headerIndex && line.includes('---'));
  if (separatorIndex === -1) return <pre>{markdown}</pre>; // No separator found
  
  const headerLine = lines[headerIndex];
  const dataLines = lines.slice(separatorIndex + 1);

  // Extract headers
  const headers = headerLine
    .split('|')
    .map(h => h.trim())
    .filter(h => h);

  // Extract rows and cells
  const rows = dataLines
    .map(line =>
      line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell)
    )
    .filter(row => row.length > 0);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className={index > 0 ? 'text-right' : ''}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const isLastRow = rowIndex === rows.length - 1;
                return (
                  <TableCell
                    key={cellIndex}
                    className={`${isLastRow ? 'font-bold' : ''} ${cellIndex > 0 ? 'text-right' : ''}`}
                  >
                    {cell}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
