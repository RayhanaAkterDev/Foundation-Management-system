import React from 'react';
import { Check } from 'lucide-react';

const participationOptions = [
  { value: 'donate', label: 'Donate' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'requestHelp', label: 'Request Help' },
];

const causeOptions = [
  { value: 'foodAssistance', label: 'Food assistance' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'disasterRelief', label: 'Disaster relief' },
  { value: 'povertySupport', label: 'Poverty support' },
  { value: 'childWelfare', label: 'Child welfare' },
  { value: 'elderlySupport', label: 'Elderly support' },
  { value: 'communityDevelopment', label: 'Community development' },
  { value: 'other', label: 'Other' },
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

const StepIndividualPreferences = ({ formData, onChange }) => {
  const toggleItem = (key, value) => {
    const current = formData[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange(key, next);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
          What matters to you?
        </h2>
        <p className="text-base text-[#6b7280]">
          All fields are optional. You can skip this step and update your preferences later.
        </p>
      </div>

      {/* Participation types */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-primary">How would you like to participate?</p>
        <div className="flex flex-wrap gap-3">
          {participationOptions.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              selected={(formData.participationTypes || []).includes(value)}
              onClick={() => toggleItem('participationTypes', value)}
            />
          ))}
        </div>
      </div>

      {/* Causes */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-primary">Causes you care about</p>
        <div className="flex flex-wrap gap-3">
          {causeOptions.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              selected={(formData.causes || []).includes(value)}
              onClick={() => toggleItem('causes', value)}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-[#6b7280]">
        You can change these preferences anytime from your account settings.
      </p>
    </div>
  );
};

export default StepIndividualPreferences;
