import React, { useState } from 'react';
import {
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

/* =========================================================
   FIELD LABEL
========================================================= */
const FieldLabel = ({ children, hint }) => (
    <div className="mb-2.5 flex items-center justify-between gap-3">
        <label className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#263b38]">
            {children}
            <span className="ml-1 text-[#d94b4b]">*</span>
        </label>

        {hint && (
            <span className="font-['Noto_Sans_Bengali'] text-[13px] font-medium text-[#7f8f8c]">
                {hint}
            </span>
        )}
    </div>
);

/* =========================================================
   FIELD ERROR
========================================================= */
const FieldError = ({ children }) => {
    if (!children) return null;

    return (
        <p className="mt-2 font-['Noto_Sans_Bengali'] text-[13px] leading-5 text-red-600">
            {children}
        </p>
    );
};

/* =========================================================
   INPUT STYLE
========================================================= */
const getInputClass = (error) => `
    h-[55px]
    w-full
    rounded-[10px]
    border
    bg-white
    pl-[46px]
    pr-4

    font-['Noto_Sans_Bengali']
    text-[15px]
    font-medium
    text-[#172a27]

    outline-none
    transition-all
    duration-200

    placeholder:font-normal
    placeholder:text-[#96a4a1]

    ${
        error
            ? `
                border-red-400
                bg-red-50/20
                focus:border-red-500
                focus:ring-4
                focus:ring-red-100/70
            `
            : `
                border-[#d5dfdd]
                hover:border-[#afc6c2]
                focus:border-[#0f766e]
                focus:ring-4
                focus:ring-[#0f766e]/[0.08]
            `
    }
`;

/* =========================================================
   INPUT ICON
========================================================= */
const InputIcon = ({ children }) => (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-[46px] items-center justify-center">
        {children}
    </span>
);

/* =========================================================
   STEP
========================================================= */
const StepCredentials = ({ accountType, formData, onChange, errors = {} }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isOrganization = accountType === 'organization';

    const handleDemoVerification = () => {
        onChange('verification_method', 'demo');
    };

    return (
        <div className="w-full">
            {/* =====================================================
                HEADER
            ====================================================== */}
            <header className="max-w-[680px]">
                <div className="flex items-center gap-2.5">
                    <span className="h-[2px] w-7 rounded-full bg-[#0f766e]" />

                    <span className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#0f766e]">
                        অ্যাকাউন্ট তথ্য
                    </span>
                </div>

                <h1 className="mt-3.5 font-['Noto_Sans_Bengali'] text-[27px] font-semibold leading-[1.45] tracking-[-0.012em] text-[#0f172a] sm:text-[30px]">
                    {isOrganization
                        ? 'সংস্থার পরিচয় ও লগইন তথ্য'
                        : 'আপনার পরিচয় ও লগইন তথ্য'}
                </h1>

                <p className="mt-2.5 font-['Noto_Sans_Bengali'] text-[15px] leading-7 text-[#6c7c78]">
                    আপনার অ্যাকাউন্টের জন্য প্রয়োজনীয় তথ্য দিন।
                </p>
            </header>

            {/* =====================================================
                FORM
            ====================================================== */}
            <div className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                {/* NAME */}
                <div>
                    <FieldLabel>
                        {isOrganization ? 'সংস্থার নাম' : 'পূর্ণ নাম'}
                    </FieldLabel>

                    <div className="relative">
                        <InputIcon>
                            {isOrganization ? (
                                <Building2
                                    className="h-[18px] w-[18px] text-[#7d908c]"
                                    strokeWidth={1.7}
                                />
                            ) : (
                                <UserRound
                                    className="h-[18px] w-[18px] text-[#7d908c]"
                                    strokeWidth={1.7}
                                />
                            )}
                        </InputIcon>

                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => onChange('name', e.target.value)}
                            placeholder={
                                isOrganization
                                    ? 'সংস্থার নাম লিখুন'
                                    : 'আপনার পূর্ণ নাম'
                            }
                            autoComplete={
                                isOrganization ? 'organization' : 'name'
                            }
                            className={getInputClass(errors.name)}
                        />
                    </div>

                    <FieldError>{errors.name}</FieldError>
                </div>

                {/* EMAIL */}
                <div>
                    <FieldLabel>ইমেইল ঠিকানা</FieldLabel>

                    <div className="relative">
                        <InputIcon>
                            <Mail
                                className="h-[18px] w-[18px] text-[#7d908c]"
                                strokeWidth={1.7}
                            />
                        </InputIcon>

                        <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => onChange('email', e.target.value)}
                            placeholder="name@example.com"
                            autoComplete="email"
                            className={getInputClass(errors.email)}
                        />
                    </div>

                    <FieldError>{errors.email}</FieldError>
                </div>

                {/* PASSWORD */}
                <div>
                    <FieldLabel hint="কমপক্ষে ৮ অক্ষর">পাসওয়ার্ড</FieldLabel>

                    <div className="relative">
                        <InputIcon>
                            <LockKeyhole
                                className="h-[18px] w-[18px] text-[#7d908c]"
                                strokeWidth={1.7}
                            />
                        </InputIcon>

                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password || ''}
                            onChange={(e) =>
                                onChange('password', e.target.value)
                            }
                            placeholder="পাসওয়ার্ড লিখুন"
                            autoComplete="new-password"
                            className={`${getInputClass(
                                errors.password,
                            )} pr-[52px]`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={
                                showPassword
                                    ? 'পাসওয়ার্ড লুকান'
                                    : 'পাসওয়ার্ড দেখুন'
                            }
                            className="
                                absolute
                                right-2
                                top-1/2
                                flex
                                h-9
                                w-9
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-[8px]
                                text-[#7d8e8a]
                                transition

                                hover:bg-[#edf4f2]
                                hover:text-[#0f766e]

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#0f766e]/20
                            "
                        >
                            {showPassword ? (
                                <EyeOff
                                    className="h-[18px] w-[18px]"
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <Eye
                                    className="h-[18px] w-[18px]"
                                    strokeWidth={1.8}
                                />
                            )}
                        </button>
                    </div>

                    <FieldError>{errors.password}</FieldError>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                    <FieldLabel>পাসওয়ার্ড নিশ্চিত করুন</FieldLabel>

                    <div className="relative">
                        <InputIcon>
                            <LockKeyhole
                                className="h-[18px] w-[18px] text-[#7d908c]"
                                strokeWidth={1.7}
                            />
                        </InputIcon>

                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={formData.confirmPassword || ''}
                            onChange={(e) =>
                                onChange('confirmPassword', e.target.value)
                            }
                            placeholder="পাসওয়ার্ড আবার লিখুন"
                            autoComplete="new-password"
                            className={`${getInputClass(
                                errors.confirmPassword,
                            )} pr-[52px]`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirm((value) => !value)}
                            aria-label={
                                showConfirm
                                    ? 'পাসওয়ার্ড লুকান'
                                    : 'পাসওয়ার্ড দেখুন'
                            }
                            className="
                                absolute
                                right-2
                                top-1/2
                                flex
                                h-9
                                w-9
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-[8px]
                                text-[#7d8e8a]
                                transition

                                hover:bg-[#edf4f2]
                                hover:text-[#0f766e]

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#0f766e]/20
                            "
                        >
                            {showConfirm ? (
                                <EyeOff
                                    className="h-[18px] w-[18px]"
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <Eye
                                    className="h-[18px] w-[18px]"
                                    strokeWidth={1.8}
                                />
                            )}
                        </button>
                    </div>

                    <FieldError>{errors.confirmPassword}</FieldError>
                </div>
            </div>

            {/* =====================================================
                VERIFICATION
            ====================================================== */}
            <div className="mt-8 border-t border-[#e1e8e6] pt-5">
                <button
                    type="button"
                    onClick={handleDemoVerification}
                    className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3.5
                        rounded-[10px]
                        px-1
                        py-1
                        text-left
                        outline-none
                    "
                >
                    <span
                        className="
                            flex
                            h-[42px]
                            w-[42px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-[10px]
                            bg-[#eaf4f2]
                            text-[#0f766e]
                            transition

                            group-hover:bg-[#dfeeea]
                        "
                    >
                        <ShieldCheck
                            className="h-[19px] w-[19px]"
                            strokeWidth={1.8}
                        />
                    </span>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#29413d]">
                                ডেমো যাচাইকরণ সক্রিয়
                            </span>

                            <span className="hidden h-1 w-1 rounded-full bg-[#a5b5b1] sm:block" />

                            <span className="hidden font-['Noto_Sans_Bengali'] text-[13px] font-medium text-[#70817d] sm:block">
                                অতিরিক্ত ধাপ প্রয়োজন নেই
                            </span>
                        </div>

                        <p className="mt-1 font-['Noto_Sans_Bengali'] text-[13px] leading-6 text-[#758480]">
                            এই ডেমো সংস্করণে ইমেইল যাচাইকরণ ছাড়াই পরবর্তী ধাপে
                            যেতে পারবেন।
                        </p>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3f1ee]">
                        <CheckCircle2
                            className="h-[18px] w-[18px] text-[#0f766e]"
                            strokeWidth={2}
                        />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default StepCredentials;
