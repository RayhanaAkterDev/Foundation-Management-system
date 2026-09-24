import React from "react";

const HelpRequestCategoryTabs = ({
  tabs = [],
  activeCategory = "all",
  onChange,
}) => {
  return (
    <div className="space-y-1">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange?.(tab.key)}
            className={`flex w-full items-center justify-between gap-3 border px-3 py-2.5 text-left transition-colors ${
              isActive
                ? "border-white/15 bg-white text-primary"
                : "border-transparent text-white/75 hover:bg-white/10 hover:text-white"
            }`}>
            <span
              className={`text-xs font-semibold ${
                isActive ? "text-primary" : "text-white/80"
              }`}>
              {tab.label}
            </span>

            <span
              className={`min-w-[28px] px-2 py-1 text-center text-[10px] font-bold ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-white/10 text-white/65"
              }`}>
              {tab.count ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default HelpRequestCategoryTabs;
