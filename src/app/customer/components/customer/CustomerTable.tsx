"use client";
import React, { useMemo, useState } from "react";
import type { Customer } from "@/features/provider/customerSlice";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import ActionButtons from "../buttons/ActionButtons";

type Props = {
  customers: Customer[];
  onSelect: (c: Customer) => void;
  onAddCustomer: () => void;
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
};

type SortKey = "name" | "phone" | "email" | "last_request_at" | "created_at";

type ColumnKey = "name" | "phone" | "email" | "last_request_at" | "created_at";

export default function CustomerTable({ customers, onSelect, onAddCustomer, onEdit, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({
    name: true,
    phone: true,
    email: true,
    last_request_at: true,
    created_at: true,
  });
  // actions are shown inline now; no dropdown refs required


  // Derived data
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    if (!q) return customers;
    return customers.filter((c) => {
  const normalized = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  const digits = (s: string) => s.replace(/\D/g, '');
  const fullNameNorm = normalized(`${c.first_name} ${c.last_name}`);
  const emailNorm = normalized(c.email ?? '');
  const phoneDigits = digits(c.phone ?? '');
  const qNorm = normalized(q);
  const qDigits = digits(qNorm);
  return fullNameNorm.includes(qNorm) || emailNorm.includes(qNorm) || (qDigits && phoneDigits.includes(qDigits));
    });
  }, [customers, query]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "name": {
          const an = `${a.first_name} ${a.last_name}`.toLowerCase();
          const bn = `${b.first_name} ${b.last_name}`.toLowerCase();
          return an.localeCompare(bn) * dir;
        }
        case "phone":
          return String(a.phone).localeCompare(String(b.phone)) * dir;
        case "email":
          return (a.email ?? "").localeCompare(b.email ?? "") * dir;
        case "last_request_at":
          return ((new Date(a.last_request_at || 0).getTime()) - (new Date(b.last_request_at || 0).getTime())) * dir;
        case "created_at":
        default:
          return ((new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime())) * dir;
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

  const allSelectedOnPage = pageRows.length > 0 && pageRows.every((c) => c.id && selected.has(c.id));

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelectAllOnPage = () => {
    const next = new Set(selected);
    if (allSelectedOnPage) {
      pageRows.forEach((c) => c.id && next.delete(c.id));
    } else {
      pageRows.forEach((c) => c.id && next.add(c.id));
    }
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
    const rows = onlySelected ? sorted.filter((c) => c.id && selected.has(c.id)) : sorted;
    const header = ["First Name", "Last Name", "Phone", "Email", "Country Code", "Created At", "Last Request At"];
    const csvRows = [header.join(",")];
    rows.forEach((c) => {
      const vals = [
        c.first_name ?? "",
        c.last_name ?? "",
        c.phone ?? "",
        c.email ?? "",
        c.country_code ?? "",
        c.created_at ?? "",
        c.last_request_at ?? "",
      ];
      csvRows.push(vals.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const setColumnVisible = (key: ColumnKey, visible: boolean) => {
    setVisibleCols((prev) => ({ ...prev, [key]: visible }));
  };

  // no dropdown click-outside handling needed for inline buttons


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
            placeholder="Search name, phone, or email"
            className="h-9 w-64 rounded-md border border-gray-300 bg-white pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
        <button
          type="button"
          onClick={onAddCustomer}
          className="ml-auto inline-flex items-center gap-2 h-9 rounded-md bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 px-3 text-sm font-medium text-white hover:opacity-90"
        >
          + Add Customer
        </button>
        <div className="flex items-center gap-2">
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
            <div className="absolute right-0 mt-1 hidden min-w-[220px] rounded-md border border-gray-200 bg-white p-2 shadow-lg group-hover:block z-10">
              {(["name", "phone", "email", "last_request_at", "created_at"] as ColumnKey[]).map((key) => (
                <label key={key} className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5"
                    checked={visibleCols[key]}
                    onChange={(e) => setColumnVisible(key, e.target.checked)}
                  />
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
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
              {visibleCols.phone && (
                <Th label="Phone" active={sortKey === "phone"} dir={sortDir} onClick={() => toggleSort("phone")} />
              )}
              {visibleCols.email && (
                <Th label="Email" active={sortKey === "email"} dir={sortDir} onClick={() => toggleSort("email")} />
              )}
              {visibleCols.last_request_at && (
                <Th label="Last request" active={sortKey === "last_request_at"} dir={sortDir} onClick={() => toggleSort("last_request_at")} />
              )}
              {visibleCols.created_at && (
                <Th label="Created" active={sortKey === "created_at"} dir={sortDir} onClick={() => toggleSort("created_at")} />
              )}
              <th className="w-10 px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c) => {
              const id = c.id ?? "";
              const name = `${c.first_name} ${c.last_name}`.trim();
              // Render canonical E.164 phone
              const phoneE164 = c.phone ?? '';
              return (
                <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!c.id && selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      aria-label={`Select ${name || "customer"}`}
                    />
                  </td>
                  {visibleCols.name && (
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="text-left text-gray-900 hover:underline"
                        onClick={() => onSelect(c)}
                      >
                        {name || "Unnamed"}
                      </button>
                    </td>
                  )}
                  {visibleCols.phone && (
                    <td className="px-3 py-2 text-gray-700">{phoneE164 || "-"}</td>
                  )}
                  {visibleCols.email && (
                    <td className="px-3 py-2 text-gray-700">{c.email || "-"}</td>
                  )}
                  {visibleCols.last_request_at && (
                    <td className="px-3 py-2 text-gray-700">
                      {c.last_request_at ? new Date(c.last_request_at).toLocaleDateString() : "Not yet"}
                    </td>
                  )}
                  {visibleCols.created_at && (
                    <td className="px-3 py-2 text-gray-700">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}
                    </td>
                  )}

                  <td className="px-3 py-2 text-right">
                    <ActionButtons
                      item={c}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>

                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-gray-500">
                  No customers found.
                </td>
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
          <label className="sr-only" htmlFor="rows-per-page">Rows per page</label>
          <select
            id="rows-per-page"
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
    </div >
  );
}

function Th({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
  console.log(dir);
  return (
    <th className="px-3 py-2 text-left">
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
