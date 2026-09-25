import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * Reusable data table with optional sorting.
 *
 * columns: [
 *   {
 *     key, label,
 *     render?(row),
 *     align?: 'left' | 'right' | 'center',
 *     sortable?: boolean,        // enable sorting on this column
 *     sortValue?: (row) => any,  // optional: value to sort by (defaults to row[key])
 *   }
 * ]
 */
function Table({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No data',
  emptyDescription = 'Nothing to display yet.',
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  rowKey = (row, i) => row.id ?? i,
  onRowClick,
  initialSort = null, // { key, direction: 'asc' | 'desc' }
}) {
  const [sort, setSort] = useState(initialSort);

  const toggleSort = (col) => {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) {
        return { key: col.key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key: col.key, direction: 'desc' };
      }
      return null; // third click resets
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;

    const getVal = (row) =>
      col.sortValue ? col.sortValue(row) : row[col.key];

    return [...data].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      // Numeric compare
      if (typeof av === 'number' && typeof bv === 'number') {
        return sort.direction === 'asc' ? av - bv : bv - av;
      }

      // String compare
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      if (as < bs) return sort.direction === 'asc' ? -1 : 1;
      if (as > bs) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sort, columns]);

  if (!loading && data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              const dir = isSorted ? sort.direction : null;
              return (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col)}
                  className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.sortable ? 'cursor-pointer hover:text-gray-800' : ''}`}
                >
                  <span
                    className={`inline-flex items-center gap-1 ${
                      col.align === 'right' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        <ChevronUp
                          size={12}
                          style={{
                            color: isSorted && dir === 'asc' ? '#E9A23B' : '#C4C9D2',
                            marginBottom: -3,
                          }}
                        />
                        <ChevronDown
                          size={12}
                          style={{
                            color: isSorted && dir === 'desc' ? '#E9A23B' : '#C4C9D2',
                          }}
                        />
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            : sortedData.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 text-sm text-gray-700 ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;