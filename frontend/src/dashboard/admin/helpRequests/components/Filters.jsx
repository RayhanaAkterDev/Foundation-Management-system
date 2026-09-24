import React, { useMemo } from "react";

import { ChevronDown } from "lucide-react";

const Filters = ({
  categoryFilter,
  priorityFilter,
  assignmentFilter,
  helpRequests,
  onCategoryChange,
  onPriorityChange,
  onAssignmentChange,
}) => {
  const categories = useMemo(() => {
    return [
      ...new Set(
        helpRequests.map((request) => request.category).filter(Boolean),
      ),
    ];
  }, [helpRequests]);

  const priorities = useMemo(() => {
    return [
      ...new Set(
        helpRequests.map((request) => request.urgency).filter(Boolean),
      ),
    ];
  }, [helpRequests]);

  const selectClassName = `
        h-10 w-full appearance-none
        border border-white/10
        bg-white
        px-3.5 pr-9
        text-[12px] font-medium text-slate-800
        outline-none transition-colors
        hover:border-white/20
        focus:border-white/30
        focus:bg-white
    `;

  const optionClassName = "bg-white text-slate-800";

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <div className="mb-2.5 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
            Category
          </p>
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={onCategoryChange}
            className={selectClassName}>
            <option value="all" className={optionClassName}>
              All categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className={optionClassName}>
                {category}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            strokeWidth={2}
            className="
                            pointer-events-none absolute right-3
                            top-1/2 -translate-y-1/2
                            text-slate-500
                        "
          />
        </div>
      </div>

      {/* Urgency Filter */}
      <div>
        <div className="mb-2.5 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
            Urgency
          </p>
        </div>

        <div className="relative">
          <select
            value={priorityFilter}
            onChange={onPriorityChange}
            className={selectClassName}>
            <option value="all" className={optionClassName}>
              All urgency
            </option>

            {priorities.map((priority) => (
              <option
                key={priority}
                value={priority}
                className={optionClassName}>
                {priority}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            strokeWidth={2}
            className="
                            pointer-events-none absolute right-3
                            top-1/2 -translate-y-1/2
                            text-slate-500
                        "
          />
        </div>
      </div>

      {/* Assignment Filter */}
      <div>
        <div className="mb-2.5 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
            Assignment
          </p>
        </div>

        <div className="relative">
          <select
            value={assignmentFilter}
            onChange={onAssignmentChange}
            className={selectClassName}>
            <option value="all" className={optionClassName}>
              All assignments
            </option>

            <option value="assigned" className={optionClassName}>
              Assigned
            </option>

            <option value="unassigned" className={optionClassName}>
              Not assigned
            </option>
          </select>

          <ChevronDown
            size={14}
            strokeWidth={2}
            className="
                            pointer-events-none absolute right-3
                            top-1/2 -translate-y-1/2
                            text-slate-500
                        "
          />
        </div>
      </div>

      {/* Status Filter */}
      {/* Keep your existing status filter commented out if you don't want it. */}
    </div>
  );
};

export default Filters;
