import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StepCredentials from './steps/StepCredentials';
import StepProfile from './steps/StepProfile';
import StepDetails from './steps/StepDetails';
import StepReview from './steps/StepReview';

const Register = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        accountType: 'individual',

        credentials: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            verification_method: 'email',
        },

        profile: {
            phone: '',
            district: '',
            address: '',
            dob: '',
            organizationType: '',
            registrationNumber: '',
            website: '',
        },

        details: {
            description: '',
            teamSize: '',
        },
    });

    const handleChange = (section, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleAccountTypeChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            accountType: value,
        }));
    };

    const validateStep = () => {
        setError('');

        if (currentStep === 1) {
            const { name, email, password, confirmPassword } =
                formData.credentials;

            if (!name.trim()) {
                setError('Please enter your name.');
                return false;
            }

            if (!email.trim()) {
                setError('Please enter your email address.');
                return false;
            }

            if (!password) {
                setError('Please enter a password.');
                return false;
            }

            if (password.length < 8) {
                setError('Password must be at least 8 characters.');
                return false;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return false;
            }
        }

        if (currentStep === 2) {
            if (!formData.profile.phone.trim()) {
                setError('Please enter your phone number.');
                return false;
            }

            if (!/^01[0-9]{9}$/.test(formData.profile.phone)) {
                setError('Please enter a valid Bangladeshi phone number.');
                return false;
            }

            if (!formData.profile.address.trim()) {
                setError('Please enter your address.');
                return false;
            }

            if (
                formData.accountType === 'individual' &&
                !formData.profile.district.trim()
            ) {
                setError('Please select your district.');
                return false;
            }

            if (
                formData.accountType === 'organization' &&
                !formData.profile.organizationType.trim()
            ) {
                setError('Please select your organization type.');
                return false;
            }

            if (
                formData.accountType === 'organization' &&
                !formData.profile.registrationNumber.trim()
            ) {
                setError('Please enter your registration number.');
                return false;
            }
        }

        if (currentStep === 3) {
            if (
                formData.accountType === 'organization' &&
                !formData.details.description.trim()
            ) {
                setError('Please enter your organization description.');
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (!validateStep()) {
            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const previousStep = () => {
        setError('');
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const submitRegistration = async (payload) => {
        const requestData = {
            accountType: payload.accountType,

            verification_method: payload.credentials.verification_method,

            credentials: {
                name: payload.credentials.name,
                email: payload.credentials.email,
                password: payload.credentials.password,
                password_confirmation: payload.credentials.confirmPassword,
            },

            ...(payload.accountType === 'individual'
                ? {
                      profile: {
                          phone: payload.profile.phone,
                          district: payload.profile.district,
                          address: payload.profile.address,
                          dob: payload.profile.dob || null,
                      },
                  }
                : {
                      profile: {
                          phone: payload.profile.phone,
                          address: payload.profile.address,
                          organizationType: payload.profile.organizationType,
                          registrationNumber:
                              payload.profile.registrationNumber,
                          website: payload.profile.website || null,
                      },

                      details: {
                          description: payload.details.description,
                          teamSize: payload.details.teamSize || null,
                      },
                  }),
        };

        const response = await fetch(
            'https://stand-for-people-api.onrender.com/api/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(requestData),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                const firstError = Object.values(data.errors)
                    .flat()
                    .find(Boolean);

                throw new Error(
                    firstError || data.message || 'Registration failed.',
                );
            }

            throw new Error(data.message || 'Registration failed.');
        }

        return data;
    };

    const handleSubmit = async () => {
        if (!validateStep()) {
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                accountType: formData.accountType,

                credentials: {
                    name: formData.credentials.name,
                    email: formData.credentials.email,
                    password: formData.credentials.password,
                    confirmPassword: formData.credentials.confirmPassword,
                    verification_method:
                        formData.credentials.verification_method,
                },

                profile: {
                    phone: formData.profile.phone,
                    district: formData.profile.district,
                    address: formData.profile.address,
                    dob: formData.profile.dob,
                    organizationType: formData.profile.organizationType,
                    registrationNumber: formData.profile.registrationNumber,
                    website: formData.profile.website,
                },

                details: {
                    description: formData.details.description,
                    teamSize: formData.details.teamSize,
                },
            };

            await submitRegistration(payload);

            navigate(`/account/login?role=${formData.accountType}`, {
                state: {
                    registrationSuccess: true,
                    email: formData.credentials.email,
                },
            });
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f8fb]">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className="flex flex-1 items-center"
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                                        currentStep >= step
                                            ? 'bg-[#0f766e] text-white'
                                            : 'bg-[#e2e8f0] text-[#64748b]'
                                    }`}
                                >
                                    {step}
                                </div>

                                {step < 4 && (
                                    <div
                                        className={`mx-2 h-1 flex-1 rounded ${
                                            currentStep > step
                                                ? 'bg-[#0f766e]'
                                                : 'bg-[#e2e8f0]'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                    {currentStep === 1 && (
                        <StepCredentials
                            formData={formData.credentials}
                            accountType={formData.accountType}
                            onChange={(field, value) =>
                                handleChange('credentials', field, value)
                            }
                            onAccountTypeChange={handleAccountTypeChange}
                        />
                    )}

                    {currentStep === 2 && (
                        <StepProfile
                            formData={formData.profile}
                            accountType={formData.accountType}
                            onChange={(field, value) =>
                                handleChange('profile', field, value)
                            }
                        />
                    )}

                    {currentStep === 3 && (
                        <StepDetails
                            formData={formData.details}
                            accountType={formData.accountType}
                            onChange={(field, value) =>
                                handleChange('details', field, value)
                            }
                        />
                    )}

                    {currentStep === 4 && (
                        <StepReview
                            formData={formData}
                            onEditStep={setCurrentStep}
                        />
                    )}

                    <div className="mt-8 flex items-center justify-between border-t border-[#e2e8f0] pt-6">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={previousStep}
                                disabled={isSubmitting}
                                className="rounded-lg border border-[#e2e8f0] px-5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate('/account/login')}
                                disabled={isSubmitting}
                                className="rounded-lg border border-[#e2e8f0] px-5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Back to Login
                            </button>
                        )}

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={isSubmitting}
                                className="rounded-lg bg-[#0f766e] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="rounded-lg bg-[#0f766e] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Create Account'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
