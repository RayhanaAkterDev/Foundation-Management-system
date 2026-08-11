import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState — shown when a list or table has no data.
 *
 * Props:
 *   icon     {Component}  — lucide-react icon (defaults to Inbox)
 *   title    {string}     — short heading
 *   message  {string}     — supporting explanation
 *   action   {object}     — optional CTA: { label, onClick }
 */
const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3f6] text-[#6b7280]">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <p className="font-['Fraunces'] text-base font-semibold text-text-primary">{title}</p>
      {message && (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-[#6b7280]">{message}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
