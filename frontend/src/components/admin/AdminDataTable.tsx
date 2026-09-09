import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  CheckSquare,
  Square,
  Sparkles
} from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: (item: T) => any;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  filterOptions?: FilterOption[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  actionsBar?: React.ReactNode;
  exportFileName?: string;
}

export function AdminDataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = "Filter records...",
  searchFilter,
  filterOptions = [],
  isLoading = false,
  emptyMessage = "No records found matching current criteria.",
  onRowClick,
  actionsBar,
  exportFileName = "coopnex-export"
}: AdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Handle Search & Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Text search
      if (searchQuery.trim()) {
        if (searchFilter) {
          if (!searchFilter(item, searchQuery)) return false;
        } else {
          const rowText = Object.values(item as any)
            .join(" ")
            .toLowerCase();
          if (!rowText.includes(searchQuery.toLowerCase())) return false;
        }
      }

      // Dropdown filters
      for (const [key, value] of Object.entries(selectedFilters)) {
        if (value && value !== "ALL") {
          const itemVal = (item as any)[key];
          if (String(itemVal) !== value) return false;
        }
      }

      return true;
    });
  }, [data, searchQuery, searchFilter, selectedFilters]);

  // Handle Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const col = columns.find((c) => c.key === sortKey);
      let aVal = col?.accessor ? col.accessor(a) : (a as any)[sortKey];
      let bVal = col?.accessor ? col.accessor(b) : (b as any)[sortKey];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection, columns]);

  // Handle Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (colKey: string) => {
    if (sortKey === colKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(colKey);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(keyExtractor)));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const handleExportCsv = () => {
    if (data.length === 0) return;
    const headerRow = columns.map((c) => `"${c.header}"`).join(",");
    const rows = sortedData.map((item) =>
      columns
        .map((col) => {
          const val = col.accessor ? col.accessor(item) : (item as any)[col.key];
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headerRow, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllSelected = paginatedData.length > 0 && selectedIds.size === paginatedData.length;

  return (
    <div className="w-full bg-white dark:bg-[#101828] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
      {/* 1. FILTER & CONTROLS TOOLBAR */}
      <div className="p-3 sm:p-4 border-b border-[#E4E9F0] dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Search input & Dynamic Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#075E54] dark:focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Dynamic Dropdown Filters */}
          {filterOptions.map((filter) => (
            <select
              key={filter.key}
              value={selectedFilters[filter.key] || "ALL"}
              onChange={(e) => {
                setSelectedFilters((prev) => ({
                  ...prev,
                  [filter.key]: e.target.value
                }));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-hidden focus:border-[#075E54] cursor-pointer"
            >
              <option value="ALL">All {filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Reset Filters */}
          {(searchQuery || Object.values(selectedFilters).some((v) => v !== "ALL")) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFilters({});
                setCurrentPage(1);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium px-1"
            >
              Reset
            </button>
          )}
        </div>

        {/* Right: Actions, Density Toggle, Export */}
        <div className="flex items-center gap-2 shrink-0">
          {actionsBar}

          {/* Density Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setDensity("compact")}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                density === "compact"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setDensity("comfortable")}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                density === "comfortable"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Comfortable
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition"
            title="Export filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 2. TABLE BODY */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E4E9F0] dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              {/* Select All Checkbox */}
              <th className="w-10 px-3 py-2.5 text-center">
                <button
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#075E54] dark:text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left";

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`px-3 py-2.5 font-bold ${alignClass} ${
                      col.sortable ? "cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" : ""
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div
                      className={`inline-flex items-center gap-1 ${
                        col.align === "right" ? "justify-end" : ""
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#075E54] dark:text-emerald-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#075E54] dark:text-emerald-400" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E4E9F0] dark:divide-slate-800 text-xs">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-3 py-3 text-center">
                    <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-3">
                      <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.has(id);
                const rowPaddingClass = density === "compact" ? "py-2" : "py-3.5";

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${
                      isSelected
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Row Select Checkbox */}
                    <td className={`w-10 px-3 ${rowPaddingClass} text-center`}>
                      <button
                        onClick={(e) => handleSelectRow(id, e)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#075E54] dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Column Cells */}
                    {columns.map((col) => {
                      const alignClass =
                        col.align === "right"
                          ? "text-right font-mono"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left";

                      return (
                        <td
                          key={col.key}
                          className={`px-3 ${rowPaddingClass} text-slate-700 dark:text-slate-300 font-medium ${alignClass}`}
                        >
                          {col.render
                            ? col.render(item)
                            : String(
                                col.accessor ? col.accessor(item) : (item as any)[col.key] ?? "—"
                              )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. PAGINATION FOOTER */}
      <div className="p-3 border-t border-[#E4E9F0] dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong>{(currentPage - 1) * pageSize + (paginatedData.length > 0 ? 1 : 0)}</strong> to{" "}
            <strong>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of{" "}
            <strong>{sortedData.length}</strong> records
          </span>
          {selectedIds.size > 0 && (
            <span className="text-[#075E54] dark:text-emerald-400 font-bold">
              • {selectedIds.size} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Rows per page selector */}
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {[10, 15, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[11px]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

