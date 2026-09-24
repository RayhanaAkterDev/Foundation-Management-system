import React from "react";

const Filter = ({ statusFilter, onStatusChange }) => {
  const statuses = [
    { value: "all", label: "All volunteers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
  ];

  return (
    <div className="space-y-6">
      {/* Volunteer Status */}
      <div>
        <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
          Volunteer status
        </p>

        <div className="overflow-hidden border border-white/10 bg-white/4.5">
          {statuses.map((status) => {
            const active = statusFilter === status.value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  onStatusChange({
                    target: {
                      value: status.value,
                    },
                  })
                }
                className={`
                                    relative flex w-full items-center
                                    justify-between
                                    border-b border-white/[0.07]
                                    px-3.5 py-3
                                    text-left
                                    transition-colors
                                    last:border-b-0
                                    ${
                                      active
                                        ? "bg-white text-primary"
                                        : "text-white/60 hover:bg-white/[0.07] hover:text-white"
                                    }
                                `}>
                <span
                  className={`
                                        text-[12px]
                                        ${
                                          active
                                            ? "font-semibold"
                                            : "font-medium"
                                        }
                                    `}>
                  {status.label}
                </span>

                {active && <span className="h-1.5 w-1.5 bg-accent" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filter;
