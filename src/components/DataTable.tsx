import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({ columns, rows, emptyMessage = "No data available" }: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{emptyMessage}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2.5 font-semibold text-slate-500">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className={`px-3 py-2.5 text-slate-700 ${c.className ?? ""}`}>
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}