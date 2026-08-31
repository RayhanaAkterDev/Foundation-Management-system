import React from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const RegisterNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  onSkip,
  isSubmitting,
  canContinue,
  showSkip,
}) => {
  const isFinalStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="mt-10 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-6 text-sm font-medium text-primary transition-colors hover:bg-[#eef3f6] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Right-side actions */}
      <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center">
        {/* Skip for now — only on individual step 4 */}
        {showSkip && !isFinalStep === false && showSkip && (
          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-6 text-sm font-medium text-[#6b7280] transition-colors hover:bg-[#eef3f6] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
          >
            Skip for now
          </button>
        )}

        {/* Continue / Create Account */}
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : isFinalStep ? (
            'Create Account'
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterNavigation;
