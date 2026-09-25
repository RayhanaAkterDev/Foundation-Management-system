import React from "react";
import { RotateCcw } from "lucide-react";

const HelpRequestFilters = ({
  filters = {},
  values = {},
  counts = {},
  onChange,
  onClear,
}) => {
  const handleChange = (key, value) => {
    onChange?.(key, value);
  };

  const renderSelect = (key, label, options = []) => {
    const value = values[key] ?? "all";

    return (
      <div className="space-y-2.5">
        <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
          {label}
        </label>

        <select
          value={value}
          onChange={(event) => handleChange(key, event.target.value)}
          className="
            w-full
            border
            border-white/15
            bg-white/10
            px-3
            py-2.5
            text-xs
            font-medium
            text-white
            outline-none
            transition-colors
            focus:border-white/35
            focus:bg-white/15
          ">
          {options.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option?.value;

            const optionLabel =
              typeof option === "string" ? option : option?.label;

            if (!optionValue) {
              return null;
            }

            return (
              <option
                key={optionValue}
                value={optionValue}
                className="bg-primary text-white">
                {optionLabel || optionValue}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  /* =========================================================
     STATUS OPTIONS
  ========================================================= */

  const statusOptions =
    Array.isArray(filters.status) && filters.status.length > 0
      ? filters.status
      : [
          {
            value: "all",
            label: "all",
          },
          {
            value: "pending",
            label: "pending",
          },
          {
            value: "assigned",
            label: "assigned",
          },
          {
            value: "active",
            label: "active",
          },
          {
            value: "completed",
            label: "completed",
          },
          {
            value: "rejected",
            label: "rejected",
          },
        ];

  /* =========================================================
     CATEGORY OPTIONS
  ========================================================= */

  const categoryOptions =
    Array.isArray(filters.category) && filters.category.length > 0
      ? filters.category
      : [
          {
            value: "all",
            label: "All categories",
          },
        ];

  /* =========================================================
     PRIORITY OPTIONS
  ========================================================= */

  const priorityOptions =
    Array.isArray(filters.priority) && filters.priority.length > 0
      ? filters.priority
      : [
          {
            value: "all",
            label: "All priorities",
          },
          {
            value: "critical",
            label: "Critical",
          },
          {
            value: "high",
            label: "High",
          },
          {
            value: "medium",
            label: "Medium",
          },
          {
            value: "normal",
            label: "Normal",
          },
        ];

  return (
    <aside className="self-start bg-primary text-white">
      {/* =====================================================
          FILTER HEADER
      ===================================================== */}

      <div className="border-b border-white/15 px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
          Refine
        </p>

        <h2 className="mt-1 text-base font-semibold tracking-tight text-white">
          Filter cases
        </h2>

        <p className="mt-1 max-w-[220px] text-xs leading-5 text-white/55">
          Narrow the cases assigned to your organization.
        </p>
      </div>

      {/* =====================================================
          FILTER CONTROLS
      ===================================================== */}

      <div className="space-y-5 px-5 py-5">
        {/* =================================================
            STATUS — FIRST
        ================================================= */}

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
              Status
            </label>

            {values.status && values.status !== "all" && (
              <button
                type="button"
                onClick={() => handleChange("status", "all")}
                className="
                  text-[10px]
                  font-medium
                  text-white/45
                  transition-colors
                  hover:text-white
                ">
                Clear
              </button>
            )}
          </div>

          <div className="overflow-hidden border border-white/10 bg-white/[0.04]">
            {statusOptions.map((option, index) => {
              const optionValue =
                typeof option === "string" ? option : option?.value;

              const optionLabel =
                typeof option === "string"
                  ? option
                  : option?.label || optionValue;

              if (!optionValue) {
                return null;
              }

              const isActive = (values.status ?? "all") === optionValue;

              /*
               * IMPORTANT:
               * Counts come from the parent component.
               * The parent already uses getRequestStatus()
               * so these numbers match the actual table status.
               */
              const count = Number(counts[optionValue] ?? 0);

              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() => handleChange("status", optionValue)}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    px-3
                    py-2.5
                    text-left
                    transition-colors
                    ${index !== 0 ? "border-t border-white/10" : ""}
                    ${
                      isActive
                        ? "bg-white text-primary"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}>
                  {/* STATUS NAME */}

                  <span className="text-xs font-medium">{optionLabel}</span>

                  {/* DYNAMIC COUNT */}

                  <span
                    className={`
                      min-w-[24px]
                      text-right
                      text-xs
                      font-semibold
                      tabular-nums
                      ${isActive ? "text-primary" : "text-white/50"}
                    `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================
            CATEGORY
        ================================================= */}

        {renderSelect("category", "Category", categoryOptions)}

        {/* =================================================
            PRIORITY
        ================================================= */}

        {renderSelect("priority", "Priority", priorityOptions)}
      </div>

      {/* =====================================================
          RESET
      ===================================================== */}

      <div className="border-t border-white/15 px-5 py-4">
        <button
          type="button"
          onClick={() => onClear?.()}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            border
            border-white/20
            px-3
            py-2.5
            text-xs
            font-semibold
            text-white
            transition-colors
            hover:border-white/35
            hover:bg-white/10
          ">
          <RotateCcw size={14} strokeWidth={1.8} />
          Reset filters
        </button>
      </div>
    </aside>
  );
};

export default HelpRequestFilters;
