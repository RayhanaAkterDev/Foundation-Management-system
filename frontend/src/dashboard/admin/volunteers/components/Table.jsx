import React from "react";

import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

import { Users, Eye, Pencil, CheckCircle2, CircleAlert } from "lucide-react";

const Table = ({
  columns,
  rows,
  onSort,
  getSortIcon,
  resultCount,
  onView,
  onEdit,
}) => {
  const enhancedColumns = columns
    .filter(
      (column) =>
        !["serialNumber", "district", "organization", "joinedDate"].includes(
          column.key,
        ),
    )
    .map((column) => {
      // ==========================================================
      // VOLUNTEER
      // ==========================================================

      if (column.key === "volunteerName") {
        return {
          ...column,

          render: (value) => (
            <div className="min-w-0 max-w-65">
              <p className="truncate text-[13px] font-semibold leading-5 text-text-primary">
                {value || "Unnamed volunteer"}
              </p>

              <p className="mt-0.5 truncate text-[11px] leading-4 text-text-secondary">
                Volunteer
              </p>
            </div>
          ),
        };
      }

      // ==========================================================
      // EMAIL
      // ==========================================================

      if (column.key === "email") {
        return {
          ...column,

          render: (value) => (
            <div className="min-w-0 max-w-65">
              <p className="truncate text-[12px] font-medium leading-5 text-text-primary">
                {value || "—"}
              </p>
            </div>
          ),
        };
      }

      // ==========================================================
      // STATUS
      // ==========================================================

      if (column.key === "status") {
        return {
          ...column,

          render: (value) => (
            <div className="whitespace-nowrap">
              <StatusBadge status={value || "inactive"} />
            </div>
          ),
        };
      }

      // ==========================================================
      // AVAILABILITY
      // ==========================================================

      if (column.key === "availability") {
        return {
          ...column,

          render: (value) => {
            const isAvailable =
              String(value || "").toLowerCase() === "available";

            return (
              <div className="flex min-w-35 items-center gap-2">
                {isAvailable ? (
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-emerald-600"
                  />
                ) : (
                  <CircleAlert
                    size={16}
                    strokeWidth={1.8}
                    className="shrink-0 text-slate-400"
                  />
                )}

                <div className="min-w-0">
                  <p
                    className={`truncate text-[12px] font-semibold leading-4 ${
                      isAvailable ? "text-emerald-700" : "text-slate-600"
                    }`}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] leading-4 text-text-secondary">
                    {isAvailable
                      ? "Ready for assignment"
                      : "Currently unavailable"}
                  </p>
                </div>
              </div>
            );
          },
        };
      }

      // ==========================================================
      // ACTIONS
      // ==========================================================

      if (column.key === "actions") {
        return {
          ...column,

          render: (_, row) => (
            <div className="flex items-center justify-end gap-1">
              {/* VIEW */}
              <button
                type="button"
                onClick={() => onView?.(row.id)}
                title="View volunteer"
                aria-label="View volunteer"
                className="
                  group
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  text-emerald-500
                  transition-all
                  duration-150
                  hover:bg-emerald-100
                  hover:text-emerald-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-200
                ">
                <Eye
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-150 group-hover:scale-105"
                />
              </button>

              {/* EDIT */}
              <button
                type="button"
                onClick={() => onEdit?.(row.id)}
                title="Edit volunteer status"
                aria-label="Edit volunteer status"
                className="
                  group
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  text-cyan-600
                  transition-all
                  duration-150
                  hover:bg-cyan-50
                  hover:text-cyan-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-200
                ">
                <Pencil
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-150 group-hover:scale-105"
                />
              </button>
            </div>
          ),
        };
      }

      return column;
    });

  return (
    <DataTable
      columns={enhancedColumns}
      rows={rows}
      onSort={onSort}
      getSortIcon={getSortIcon}
      resultCount={resultCount}
      empty={{
        icon: Users,
        title: "No volunteers found",
        message: "Try changing your search or filter options.",
      }}
    />
  );
};

export default Table;
