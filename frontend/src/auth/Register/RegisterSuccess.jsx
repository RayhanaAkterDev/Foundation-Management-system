import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterSuccess = ({ accountType }) => {
  const navigate = useNavigate();
  const isOrganization = accountType === 'organization';

  const handleSignIn = () => {
    navigate('/account');
  };

  return (
    <div className="flex flex-col items-center py-8 text-center">
      {/* Icon */}
      <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-10 w-10 text-primary" strokeWidth={1.5} />
      </span>

      {/* Heading */}
      <h2 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
        {isOrganization
          ? 'Organization account created successfully'
          : 'Account created successfully'}
      </h2>

      {/* Message */}
      <p className="mt-4 max-w-md text-base leading-relaxed text-[#6b7280]">
        {isOrganization
          ? 'Your organization profile has been submitted successfully. You can sign in to continue setting up your organization.'
          : 'Your Stand For People account is ready. You can now sign in and start supporting causes, volunteering, or requesting help.'}
      </p>

      {/* Organization verification notice */}
      {isOrganization && (
        <div className="mt-5 flex max-w-md items-start gap-3 rounded-xl border border-accent/30 bg-accent/8 p-4 text-left">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm leading-relaxed text-text-primary">
            Some organization features may require verification by Stand For People before they
            become available.
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleSignIn}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Continue to Sign In
      </button>
    </div>
  );
};

export default RegisterSuccess;
