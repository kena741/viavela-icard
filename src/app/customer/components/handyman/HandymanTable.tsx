"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { HandyManModel } from "@/features/handyman/handymanSlice";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import ActionButtons from "../buttons/ActionButtons";

export type HandymanTableProps = {
  handymen: HandyManModel[];
  onEdit: (h: HandyManModel) => void;
  onToggle: (h: HandyManModel) => void;
  onDelete: (h: HandyManModel) => void;
  onAdd?: () => void;
};

type SortKey =
  | "name"
  | "phoneNumber"
  | "email"
  | "category"
  | "subCategory"
  | "isActive"
  | "createdAt";

type ColumnKey = SortKey;

export default function HandymanTable({ handymen, onEdit, onToggle, onDelete, onAdd }: HandymanTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({
    name: true,
    phoneNumber: true,
    email: true,
    category: true,
    subCategory: true,
    isActive: true,
    createdAt: true,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return handymen;
    return handymen.filter((h) => {
      const name = `${h.firstName ?? ""} ${h.lastName ?? ""}`.toLowerCase();
      const phone = h.phoneNumber ?? "";
      const email = (h.email ?? "").toLowerCase();
      const cat = (h.category ?? "").toLowerCase();
      const sub = (h.subCategory ?? "").toLowerCase();
      return (
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        cat.includes(q) ||
        sub.includes(q)
      );
    });
  }, [handymen, query]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "name": {
          const an = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          const bn = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
          return an.localeCompare(bn) * dir;
        }
        case "phoneNumber":
          return (String(a.phoneNumber ?? "").localeCompare(String(b.phoneNumber ?? ""))) * dir;
        case "email":
          return (String(a.email ?? "").localeCompare(String(b.email ?? ""))) * dir;
        case "category":
          return (String(a.category ?? "").localeCompare(String(b.category ?? ""))) * dir;
        case "subCategory":
          return (String(a.subCategory ?? "").localeCompare(String(b.subCategory ?? ""))) * dir;
        case "isActive":
          return ((a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1)) * dir;
        case "createdAt":
        default:
          return ((new Date(a.createdAt || 0).getTime()) - (new Date(b.createdAt || 0).getTime())) * dir;
      }
    });
    return list;
  }, [filtered, sortDir, sortKey]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const startIdx = (pageSafe - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pageRows = sorted.slice(startIdx, endIdx);

  const allSelectedOnPage = pageRows.length > 0 && pageRows.every((h) => h.id && selected.has(h.id));

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelectAllOnPage = () => {
    const next = new Set(selected);
    if (allSelectedOnPage) pageRows.forEach((h) => h.id && next.delete(h.id));
    else pageRows.forEach((h) => h.id && next.add(h.id));
    setSelected(next);
  };

  const toggleSelect = (id?: string) => {
    if (!id) return;
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const exportCSV = (onlySelected = false) => {
    const rows = onlySelected ? sorted.filter((h) => h.id && selected.has(h.id)) : sorted;
    const header = [
      "First Name",
      "Last Name",
      "Phone",
      "Email",
      "Category",
      "SubCategory",
      "Active",
      "Created At",
    ];
    const csvRows = [header.join(",")];
    rows.forEach((h) => {
      const vals = [
        h.firstName ?? "",
        h.lastName ?? "",
        h.phoneNumber ?? "",
        h.email ?? "",
        h.category ?? "",
        h.subCategory ?? "",
        h.isActive ? "Yes" : "No",
        h.createdAt ?? "",
      ];
      csvRows.push(vals.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `handymen_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const setColumnVisible = (key: ColumnKey, visible: boolean) => setVisibleCols((p) => ({ ...p, [key]: visible }));

  return (
    <div className="hidden sm:flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, phone, email, category"
            className="h-9 w-72 rounded-md border border-gray-300 bg-white pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="ml-auto inline-flex items-center gap-2 h-9 rounded-md bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 px-3 text-sm font-medium text-white hover:opacity-90"
          >
            + Add Handyman
          </button>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => exportCSV(false)}
            className="inline-flex items-center gap-2 h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-2 h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50"
              title="Columns"
            >
              <SlidersHorizontal className="h-4 w-4" /> Columns
            </button>
            <div className="absolute right-0 mt-1 hidden min-w-[240px] rounded-md border border-gray-200 bg-white p-2 shadow-lg group-hover:block z-10">
              {(["name", "phoneNumber", "email", "category", "subCategory", "isActive", "createdAt"] as ColumnKey[]).map((key) => (
                <label key={key} className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5"
                    checked={visibleCols[key]}
                    onChange={(e) => setColumnVisible(key, e.target.checked)}
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50 text-sm">
          <div>
            <span className="font-medium">{selected.size}</span> selected
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportCSV(true)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Download className="h-4 w-4" /> Export selected
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={allSelectedOnPage}
                  onChange={toggleSelectAllOnPage}
                  aria-label="Select all rows on this page"
                />
              </th>
              {visibleCols.name && (
                <Th label="Name" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
              )}
              {visibleCols.phoneNumber && (
                <Th label="Phone" active={sortKey === "phoneNumber"} dir={sortDir} onClick={() => toggleSort("phoneNumber")} />
              )}
              {visibleCols.email && (
                <Th label="Email" active={sortKey === "email"} dir={sortDir} onClick={() => toggleSort("email")} />
              )}
              {visibleCols.category && (
                <Th label="Category" active={sortKey === "category"} dir={sortDir} onClick={() => toggleSort("category")} />
              )}
              {visibleCols.subCategory && (
                <Th label="Subcategory" active={sortKey === "subCategory"} dir={sortDir} onClick={() => toggleSort("subCategory")} />
              )}
              {visibleCols.isActive && (
                <Th label="Status" active={sortKey === "isActive"} dir={sortDir} onClick={() => toggleSort("isActive")} />
              )}
              {visibleCols.createdAt && (
                <Th label="Created" active={sortKey === "createdAt"} dir={sortDir} onClick={() => toggleSort("createdAt")} />
              )}
              <th className="w-40 px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((h) => {
              const id = h.id ?? "";
              const name = `${h.firstName ?? ""} ${h.lastName ?? ""}`.trim() || "Unnamed";
              return (
                <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!h.id && selected.has(h.id)}
                      onChange={() => toggleSelect(h.id)}
                      aria-label={`Select ${name}`}
                    />
                  </td>
                  {visibleCols.name && (
                    <td className="px-3 py-2 text-gray-900">
                      <Link href={`/provider/dashboard/handyman/${id}`} className="hover:underline">{name}</Link>
                    </td>
                  )}
                  {visibleCols.phoneNumber && (
                    <td className="px-3 py-2 text-gray-700">{h.phoneNumber || "-"}</td>
                  )}
                  {visibleCols.email && (
                    <td className="px-3 py-2 text-gray-700">{h.email || "-"}</td>
                  )}
                  {visibleCols.category && (
                    <td className="px-3 py-2 text-gray-700">{h.category || "-"}</td>
                  )}
                  {visibleCols.subCategory && (
                    <td className="px-3 py-2 text-gray-700">{h.subCategory || "-"}</td>
                  )}
                  {visibleCols.isActive && (
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${h.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {h.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  )}
                  {visibleCols.createdAt && (
                    <td className="px-3 py-2 text-gray-700">{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "-"}</td>
                  )}

                  <td className="px-3 py-2 text-right">
                    <ActionButtons
                      item={h}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                      isActive={h.isActive}
                    />
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-gray-500">No handymen found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 p-3 text-sm">
        <div className="text-gray-600">
          Showing <span className="font-medium">{Math.min(endIdx, total)}</span> of <span className="font-medium">{total}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="handyman-rows-per-page">Rows per page</label>
          <select
            id="handyman-rows-per-page"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-8 rounded-md border border-gray-300 bg-white px-2"
            aria-label="Rows per page"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={pageSafe <= 1}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <div className="px-2">Page {pageSafe} / {totalPages}</div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={pageSafe >= totalPages}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
  return (
    <th className="px-3 py-2 text-left" aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 rounded px-1 py-0.5 ${active ? "text-sky-700" : "text-gray-700"}`}
        title={`Sort by ${label}`}
      >
        <span>{label}</span>
        <ArrowUpDown className={`h-3.5 w-3.5 ${active ? "opacity-100" : "opacity-60"}`} />
      </button>
    </th>
  );
}
