import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { number: '01', label: 'Account Type' },
  { number: '02', label: 'Account Information' },
  { number: '03', label: 'Profile Details' },
  { number: '04', label: 'Preferences' },
];

const RegisterProgress = ({ currentStep, accountType }) => {
  const displaySteps = steps.map((step, index) => {
    if (index === 3 && accountType === 'organization') {
      return { ...step, label: 'Organization Details' };
    }
    return step;
  });

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2 md:justify-center md:gap-4">
        {displaySteps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          const isLast = index === displaySteps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex min-w-0 flex-1 flex-col items-center md:flex-none md:flex-row md:items-center md:gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors md:h-10 md:w-10 ${
                    isActive
                      ? 'bg-[#0f766e] text-white'
                      : isCompleted
                        ? 'bg-[#0f766e]/10 text-[#0f766e]'
                        : 'bg-[#eef3f6] text-[#6b7280]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    step.number
                  )}
                </span>
                <span
                  className={`mt-1 hidden truncate text-sm font-medium md:mt-0 md:block ${
                    isActive
                      ? 'text-[#0f766e]'
                      : isCompleted
                        ? 'text-[#0f766e]'
                        : 'text-[#6b7280]'
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`mt-1 block text-xs font-medium md:hidden ${
                    isActive
                      ? 'text-[#0f766e]'
                      : isCompleted
                        ? 'text-[#0f766e]'
                        : 'text-[#6b7280]'
                  }`}
                >
                  {step.label.split(' ')[0]}
                </span>
              </div>
              {!isLast && (
                <div className="mx-1 h-px flex-1 max-w-[40px] bg-[#e5e7eb] md:mx-2 md:w-12 md:max-w-none md:flex-none" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RegisterProgress;
