import React from 'react';
import { User, Building2, Check } from 'lucide-react';

const StepAccountType = ({ accountType, onSelect, error }) => {
  const options = [
    {
      value: 'individual',
      icon: User,
      title: 'Individual',
      description:
        'For people who want to donate, volunteer, request help, support causes, or represent a community need.',
      labels: ['Donate', 'Volunteer', 'Request Help'],
    },
    {
      value: 'organization',
      icon: Building2,
      title: 'Organization',
      description:
        'For NGOs, nonprofits, foundations, charities, and other humanitarian organizations.',
      labels: ['Campaigns', 'Volunteers', 'Community Support'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-[#0f172a] md:text-3xl">
          How will you use Stand For People?
        </h2>
        <p className="text-base text-[#6b7280]">
          Choose the account that best matches how you'll participate in our community.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {options.map(({ value, icon: Icon, title, description, labels }) => {
          const selected = accountType === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`relative flex flex-col items-start rounded-2xl border-2 p-6 text-left transition-all duration-200 md:p-8 ${
                selected
                  ? 'border-[#0f766e] bg-[#0f766e]/[0.04]'
                  : 'border-[#e5e7eb] bg-white hover:border-[#0f766e]/30 hover:bg-[#eef3f6]/50'
              }`}
            >
              {selected && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#0f766e] text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}

              <span
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  selected
                    ? 'bg-[#0f766e] text-white'
                    : 'bg-[#eef3f6] text-[#6b7280]'
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>

              <h3 className="font-['Fraunces'] text-xl font-semibold text-[#0f172a]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full bg-[#eef3f6] px-2.5 py-1 text-xs font-medium text-[#6b7280]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepAccountType;
