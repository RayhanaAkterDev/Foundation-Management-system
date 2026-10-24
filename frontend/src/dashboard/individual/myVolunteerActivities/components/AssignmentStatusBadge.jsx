import React from 'react';
import { statusConfig } from '../utils/volunteerHelpers';

export default function AssignmentStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.assigned;
  const Icon = config.icon;
  return (
    <span className={`inline-flex w-fit shrink-0 items-center gap-2 border px-2.5 py-1 text-[11px] font-medium ${config.className}`}>
      <Icon size={14} strokeWidth={1.8} />
      <span>{config.label}</span>
    </span>
  );
}
