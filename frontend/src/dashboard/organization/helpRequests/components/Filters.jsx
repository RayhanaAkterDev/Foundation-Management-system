import React from "react";
import { RotateCcw } from "lucide-react";

const HelpRequestFilters = ({
  filters = {},
  values = {},
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

  const categoryOptions =
    Array.isArray(filters.category) && filters.category.length > 0
      ? filters.category
      : [
          {
            value: "all",
            label: "All categories",
          },
        ];

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

  // const assignmentOptions =
  //   Array.isArray(filters.assignment) && filters.assignment.length > 0
  //     ? filters.assignment
  //     : [
  //         {
  //           value: "all",
  //           label: "All assignments",
  //         },
  //         {
  //           value: "pending",
  //           label: "Needs response",
  //         },
  //         {
  //           value: "assigned",
  //           label: "Assigned",
  //         },
  //         {
  //           value: "rejected",
  //           label: "Declined",
  //         },
  //       ];

  const statusOptions =
    Array.isArray(filters.status) && filters.status.length > 0
      ? filters.status
      : [
          {
            value: "all",
            label: "All statuses",
          },
          {
            value: "pending",
            label: "Needs response",
          },
          {
            value: "assigned",
            label: "Assigned",
          },
          {
            value: "active",
            label: "In progress",
          },
          {
            value: "completed",
            label: "Completed",
          },
          {
            value: "rejected",
            label: "Declined",
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
        {/* Category */}

        {renderSelect("category", "Category", categoryOptions)}

        {/* Priority */}

        {renderSelect("priority", "Priority", priorityOptions)}

        {/* =================================================
            STATUS
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
                typeof option === "string" ? option : option?.label;

              if (!optionValue) {
                return null;
              }

              const isActive = (values.status ?? "all") === optionValue;

              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() => handleChange("status", optionValue)}
                  className={`
                    group
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
                  <span className="text-xs font-medium">
                    {optionLabel || optionValue}
                  </span>

                  <span
                    className={`
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      transition-colors
                      ${
                        isActive
                          ? "bg-primary"
                          : "bg-white/25 group-hover:bg-white/60"
                      }
                    `}
                  />
                </button>
              );
            })}
          </div>
        </div>
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
