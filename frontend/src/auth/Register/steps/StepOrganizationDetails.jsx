import React from 'react';
import { Check } from 'lucide-react';

const focusAreaOptions = [
  'Medical Aid',
  'Education',
  'Food Relief',
  'Shelter & Housing',
  'Disaster Response',
  'Clean Water',
  'Women & Child Welfare',
  'Livelihood Support',
  'Environment',
  'Elderly Care',
  'Disability Support',
  'Youth Development',
];

const communityOptions = [
  'Rural Communities',
  'Urban Slums',
  'Refugees',
  'Children',
  'Women',
  'Elderly',
  'Persons with Disabilities',
  'Low-Income Families',
  'Indigenous Groups',
];

const teamSizeOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];

const activityOptions = [
  'Direct Aid Distribution',
  'Volunteer Coordination',
  'Fundraising Campaigns',
  'Community Training',
  'Medical Outreach',
  'Educational Programs',
  'Advocacy & Awareness',
  'Disaster Relief',
];

const Chip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
      selected
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-[#e5e7eb] bg-white text-text-primary hover:border-primary/40 hover:bg-[#eef3f6]'
    }`}
  >
    {selected && <Check className="h-3.5 w-3.5 shrink-0" />}
    {label}
  </button>
);

const FieldWrapper = ({ label, error, required, children }) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold text-text-primary">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
      {!required && <span className="ml-1 text-xs font-normal text-[#6b7280]">(optional)</span>}
    </p>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const StepOrganizationDetails = ({ formData, onChange, errors }) => {
  const toggleItem = (key, value) => {
    const current = formData[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange(key, next);
  };

  const inputBase =
    'w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-text-primary placeholder-[#6b7280] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20';
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-200';

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
          Tell us about your work
        </h2>
        <p className="text-base text-[#6b7280]">
          Help people understand your focus, reach, and mission.
        </p>
      </div>

      {/* Mission */}
      <div className="space-y-1.5">
        <label htmlFor="mission" className="block text-sm font-semibold text-text-primary">
          Mission <span className="text-red-500">*</span>
        </label>
        <textarea
          id="mission"
          rows={4}
          placeholder="Describe your organization's mission and core purpose…"
          value={formData.mission || ''}
          onChange={(e) => onChange('mission', e.target.value)}
          className={`${inputBase} resize-none ${errors.mission ? inputError : ''}`}
        />
        {errors.mission && <p className="text-xs text-red-600">{errors.mission}</p>}
      </div>

      {/* Focus Areas */}
      <FieldWrapper label="Areas of Focus" error={errors.focusAreas} required>
        <div className="flex flex-wrap gap-3">
          {focusAreaOptions.map((area) => (
            <Chip
              key={area}
              label={area}
              selected={(formData.focusAreas || []).includes(area)}
              onClick={() => toggleItem('focusAreas', area)}
            />
          ))}
        </div>
      </FieldWrapper>

      {/* Communities Served */}
      <FieldWrapper label="Communities Served" error={errors.communitiesServed} required>
        <div className="flex flex-wrap gap-3">
          {communityOptions.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={(formData.communitiesServed || []).includes(c)}
              onClick={() => toggleItem('communitiesServed', c)}
            />
          ))}
        </div>
      </FieldWrapper>

      {/* Team Size — optional */}
      <FieldWrapper label="Team Size" error={errors.teamSize} required={false}>
        <div className="flex flex-wrap gap-3">
          {teamSizeOptions.map((size) => (
            <Chip
              key={size}
              label={size}
              selected={formData.teamSize === size}
              onClick={() => onChange('teamSize', formData.teamSize === size ? '' : size)}
            />
          ))}
        </div>
      </FieldWrapper>

      {/* Primary Activities — optional */}
      <FieldWrapper label="Primary Activities" error={errors.primaryActivities} required={false}>
        <div className="flex flex-wrap gap-3">
          {activityOptions.map((activity) => (
            <Chip
              key={activity}
              label={activity}
              selected={(formData.primaryActivities || []).includes(activity)}
              onClick={() => toggleItem('primaryActivities', activity)}
            />
          ))}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default StepOrganizationDetails;
