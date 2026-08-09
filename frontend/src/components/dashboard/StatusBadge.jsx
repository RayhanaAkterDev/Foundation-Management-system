import React from 'react';

const STATUS_MAP = {
  // Green
  active:      { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500',  label: 'Active' },
  approved:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500',  label: 'Approved' },
  completed:   { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500',  label: 'Completed' },
  verified:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500',  label: 'Verified' },
  in_progress: { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500',     label: 'In Progress' },
  // Amber
  pending:     { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',    label: 'Pending' },
  under_review:{ bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',    label: 'Under Review' },
  upcoming:    { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',    label: 'Upcoming' },
  // Gray / Red
  inactive:    { bg: 'bg-[#f3f4f6]',  text: 'text-[#6b7280]',  dot: 'bg-[#d1d5db]',   label: 'Inactive' },
  suspended:   { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500',      label: 'Suspended' },
  cancelled:   { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500',      label: 'Cancelled' },
  unverified:  { bg: 'bg-[#f3f4f6]',  text: 'text-[#6b7280]',  dot: 'bg-[#d1d5db]',   label: 'Unverified' },
};

const StatusBadge = ({ status, showDot = true }) => {
  const key = (status || '').toLowerCase().replace(/ /g, '_');
  const config = STATUS_MAP[key] || {
    bg: 'bg-[#f3f4f6]',
    text: 'text-[#6b7280]',
    dot: 'bg-[#d1d5db]',
    label: status || '—',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
