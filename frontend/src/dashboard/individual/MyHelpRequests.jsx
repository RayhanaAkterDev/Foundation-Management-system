import React, { useState } from 'react';
import { HeartHandshake, Plus } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { mockHelpRequests } from '@/data/mockIndividual';

const columns = [
  { key: 'title',         header: 'Title' },
  { key: 'category',      header: 'Category' },
  { key: 'submittedDate', header: 'Submitted' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'notes',
    header: 'Notes',
    render: (val) => <span className="text-[#6b7280] italic">{val || '—'}</span>,
  },
];

const MyHelpRequests = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Help Requests"
        subtitle="Track requests you've submitted to Stand For People."
        action={
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        }
      />

      {/* New request notice */}
      {showForm && (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-text-primary mb-1">Submit a Help Request</p>
          <p className="text-sm text-[#6b7280] mb-4">
            Describe the assistance you need. SP Admin will review and coordinate a response.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">Request Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. School supplies for my children"
                className="h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">Category <span className="text-red-500">*</span></label>
              <select className="h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-sm outline-none appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">Select category</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Food Assistance</option>
                <option>Shelter</option>
                <option>Livelihood</option>
                <option>Disaster Relief</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-medium text-text-primary">Description <span className="text-red-500">*</span></label>
              <textarea
                rows={4}
                placeholder="Please describe the situation and what kind of help you need…"
                className="w-full rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex h-10 items-center rounded-xl border border-[#e5e7eb] px-5 text-sm font-medium text-[#6b7280] hover:bg-[#eef3f6] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <DataTable
        title="All Help Requests"
        columns={columns}
        rows={mockHelpRequests}
        empty={{
          icon: HeartHandshake,
          title: 'No help requests yet',
          message: 'Submit your first help request and SP will coordinate a response.',
          action: { label: 'Submit a Request', onClick: () => setShowForm(true) },
        }}
      />
    </div>
  );
};

export default MyHelpRequests;
