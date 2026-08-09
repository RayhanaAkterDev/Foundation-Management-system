import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake } from 'lucide-react';

import RegisterProgress from './RegisterProgress';
import RegisterNavigation from './RegisterNavigation';
import RegisterSuccess from './RegisterSuccess';

import StepAccountType from './steps/StepAccountType';
import StepCredentials from './steps/StepCredentials';
import StepIndividualProfile from './steps/StepIndividualProfile';
import StepIndividualPreferences from './steps/StepIndividualPreferences';
import StepOrganizationProfile from './steps/StepOrganizationProfile';
import StepOrganizationDetails from './steps/StepOrganizationDetails';

// ---------------------------------------------------------------------------
// Isolated API layer — replace with real Laravel calls later
// ---------------------------------------------------------------------------
async function submitRegistration(payload) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  // TODO: replace with real API endpoint
  // const response = await fetch('/api/auth/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Registration failed');
  // return response.json();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStep(step, accountType, formData) {
  const errs = {};

  if (step === 1) {
    if (!accountType) errs.accountType = 'Please select an account type to continue.';
  }

  if (step === 2) {
    if (!formData.credentials.name?.trim()) errs.name = 'This field is required.';
    if (!formData.credentials.email?.trim()) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_RE.test(formData.credentials.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.credentials.password) {
      errs.password = 'Password is required.';
    } else if (formData.credentials.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    if (!formData.credentials.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.credentials.password !== formData.credentials.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
  }

  if (step === 3) {
    if (accountType === 'individual') {
      const p = formData.individualProfile;
      if (!p.phone?.trim()) errs.phone = 'Phone number is required.';
      if (!p.district?.trim()) errs.district = 'District is required.';
      if (!p.address?.trim()) errs.address = 'Address is required.';
    } else {
      const p = formData.organizationProfile;
      if (!p.phone?.trim()) errs.phone = 'Phone number is required.';
      if (!p.organizationType) errs.organizationType = 'Please select an organization type.';
      if (!p.registrationNumber?.trim()) errs.registrationNumber = 'Registration number is required.';
      if (!p.address?.trim()) errs.address = 'Address is required.';
    }
  }

  if (step === 4 && accountType === 'organization') {
    const d = formData.organizationDetails;
    if (!d.mission?.trim()) errs.mission = 'Please describe your mission.';
    if (!d.focusAreas?.length) errs.focusAreas = 'Please select at least one area of focus.';
    if (!d.communitiesServed?.length) errs.communitiesServed = 'Please select at least one community.';
  }
  // Individual step 4 is all-optional — no validation required

  return errs;
}

// ---------------------------------------------------------------------------
// Main Register component
// ---------------------------------------------------------------------------
const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [stepErrors, setStepErrors] = useState({});

  // Consolidated form data — each slice belongs to one step
  const [formData, setFormData] = useState({
    credentials: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    individualProfile: {
      phone: '',
      district: '',
      address: '',
      dob: '',
      profilePhoto: null,
      profilePhotoPreview: null,
    },
    individualPreferences: {
      participationTypes: [],
      causes: [],
    },
    organizationProfile: {
      phone: '',
      organizationType: '',
      registrationNumber: '',
      address: '',
      website: '',
      organizationLogo: null,
      organizationLogoPreview: null,
    },
    organizationDetails: {
      mission: '',
      focusAreas: [],
      communitiesServed: [],
      teamSize: '',
      primaryActivities: [],
    },
  });

  const TOTAL_STEPS = 4;

  // Patch a nested slice of formData
  const handleChange = useCallback((slice, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [slice]: { ...prev[slice], [key]: value },
    }));
    // Clear that field's error on change
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleContinue = async () => {
    const errs = validateStep(step, accountType, formData);
    if (Object.keys(errs).length > 0) {
      setStepErrors(errs);
      return;
    }
    setStepErrors({});

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    // Final step — submit
    await handleSubmit(false);
  };

  const handleSkip = async () => {
    // Only valid on individual step 4 — skip preferences and submit
    setStepErrors({});
    await handleSubmit(true);
  };

  const handleSubmit = async (skipped) => {
    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      accountType,
      credentials: {
        name: formData.credentials.name,
        email: formData.credentials.email,
        password: formData.credentials.password,
      },
      ...(accountType === 'individual'
        ? {
            profile: formData.individualProfile,
            preferences: skipped ? null : formData.individualPreferences,
          }
        : {
            profile: formData.organizationProfile,
            details: formData.organizationDetails,
          }),
    };

    try {
      await submitRegistration(payload);
      setIsSuccess(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStepErrors({});
      setStep((s) => s - 1);
    }
  };

  // Determine if the Continue button should be enabled
  const canContinue =
    !isSubmitting &&
    (step !== 1 || accountType !== null);

  const showSkip = step === 4 && accountType === 'individual';

  return (
    <div className="min-h-screen w-full bg-[#eef3f6] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-[960px]">
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f766e] text-white">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <span className="font-['Fraunces'] text-xl font-semibold text-[#0f172a]">
              Stand For People
            </span>
          </div>
          <p className="mt-2 text-sm text-[#6b7280]">
            Helping people. Building stronger communities.
          </p>
        </div>

        {/* Registration surface */}
        <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] md:p-10">

          {isSuccess ? (
            <RegisterSuccess accountType={accountType} />
          ) : (
            <>
              {/* Page header */}
              <div className="mb-8 space-y-2 text-center">
                <h1 className="font-['Fraunces'] text-3xl font-semibold text-[#0f172a] md:text-4xl">
                  Create your account
                </h1>
                <p className="text-[#6b7280]">
                  Join a community working together to support people in need.
                </p>
              </div>

              {/* Progress */}
              <RegisterProgress currentStep={step} accountType={accountType} />

              {/* Step content */}
              <div className="min-h-[260px]">
                {step === 1 && (
                  <StepAccountType
                    accountType={accountType}
                    onSelect={(type) => {
                      setAccountType(type);
                      setStepErrors({});
                    }}
                    error={stepErrors.accountType}
                  />
                )}

                {step === 2 && (
                  <StepCredentials
                    accountType={accountType}
                    formData={formData.credentials}
                    onChange={(key, value) => handleChange('credentials', key, value)}
                    errors={stepErrors}
                  />
                )}

                {step === 3 && accountType === 'individual' && (
                  <StepIndividualProfile
                    formData={formData.individualProfile}
                    onChange={(key, value) => handleChange('individualProfile', key, value)}
                    errors={stepErrors}
                  />
                )}

                {step === 3 && accountType === 'organization' && (
                  <StepOrganizationProfile
                    formData={formData.organizationProfile}
                    onChange={(key, value) => handleChange('organizationProfile', key, value)}
                    errors={stepErrors}
                  />
                )}

                {step === 4 && accountType === 'individual' && (
                  <StepIndividualPreferences
                    formData={formData.individualPreferences}
                    onChange={(key, value) => handleChange('individualPreferences', key, value)}
                  />
                )}

                {step === 4 && accountType === 'organization' && (
                  <StepOrganizationDetails
                    formData={formData.organizationDetails}
                    onChange={(key, value) => handleChange('organizationDetails', key, value)}
                    errors={stepErrors}
                  />
                )}
              </div>

              {/* Global submit error */}
              {submitError && (
                <p className="mt-4 text-center text-sm text-red-600">{submitError}</p>
              )}

              {/* Navigation */}
              <RegisterNavigation
                currentStep={step}
                totalSteps={TOTAL_STEPS}
                onBack={handleBack}
                onContinue={handleContinue}
                onSkip={handleSkip}
                isSubmitting={isSubmitting}
                canContinue={canContinue}
                showSkip={showSkip}
              />
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-[#0f172a]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold text-[#0f766e] hover:underline"
              >
                Sign in
              </button>
            </p>
            <p className="text-xs text-[#6b7280]">
              By creating an account, you agree to our{' '}
              <button
                type="button"
                onClick={() => navigate('/terms')}
                className="text-[#0f766e] hover:underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => navigate('/privacy')}
                className="text-[#0f766e] hover:underline"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
