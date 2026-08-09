import React from 'react';

/**
 * QuickActions — renders a row of action buttons.
 *
 * Props:
 *   actions {Array} — [{ label, icon: LucideComponent, onClick, variant? }]
 *   title   {string} — optional section title
 *
 *   variant: 'primary' | 'secondary' (default secondary)
 */
const QuickActions = ({ actions = [], title = 'Quick Actions' }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      {title && (
        <h2 className="mb-4 font-['Fraunces'] text-base font-semibold text-[#0f172a]">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          const isPrimary = action.variant === 'primary';
          return (
            <button
              key={idx}
              type="button"
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center text-sm font-medium transition-colors ${
                isPrimary
                  ? 'border-[#0f766e] bg-[#0f766e] text-white hover:bg-[#115e59]'
                  : 'border-[#e5e7eb] bg-white text-[#0f172a] hover:bg-[#eef3f6]'
              }`}
            >
              {Icon && (
                <Icon
                  className={`h-5 w-5 ${isPrimary ? 'text-white' : 'text-[#0f766e]'}`}
                />
              )}
              <span className="leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
