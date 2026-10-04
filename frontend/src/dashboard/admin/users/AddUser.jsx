import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    Check,
    Mail,
    Phone,
    ShieldCheck,
    UserCog,
    UserRound,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import UserForm from './components/UserForm';
import SuccessToast from './components/SuccessToast';
import { createUser } from './api/userApi';

/* ============================================================
   ROLE META
============================================================ */

const ROLE_META = {
    individual: {
        label: 'Individual',
        description: 'Personal platform account',
        icon: UserRound,
    },
    organization: {
        label: 'Organization',
        description: 'Organization or NGO account',
        icon: Building2,
    },
    admin: {
        label: 'Administrator',
        description: 'Platform management access',
        icon: UserCog,
    },
};

/* ============================================================
   PREVIEW DETAIL
============================================================ */

const DetailRow = ({ icon: Icon, label, value, muted = false }) => {
    return (
        <div
            className="
                group
                flex
                min-w-0
                items-start
                gap-4
            "
        >
            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center

                    border
                    border-[#29323E]

                    bg-[#151B24]

                    text-[#697586]

                    transition-[background-color,border-color,color]
                    duration-150

                    group-hover:border-[#394555]
                    group-hover:bg-[#1A222D]
                    group-hover:text-[#AEB7C3]
                "
            >
                <Icon size={14} strokeWidth={1.65} />
            </div>

            <div className="min-w-0 pt-0.5">
                <p
                    className="
                        font-sans!

                        text-[9px]
                        font-semibold!
                        uppercase
                        tracking-[0.14em]

                        text-[#697586]
                    "
                >
                    {label}
                </p>

                <p
                    className={`
                        mt-1.5
                        truncate

                        font-sans!
                        text-[11px]
                        font-medium!

                        ${muted ? 'text-[#5E6978]!' : 'text-[#B8C0CA]!'}
                    `}
                >
                    {value}
                </p>
            </div>
        </div>
    );
};

/* ============================================================
   ADD USER
============================================================ */

const AddUser = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [formResetKey, setFormResetKey] = useState(0);

    const [formPreview, setFormPreview] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        verification_method: 'demo',
        status: 'inactive',
    });

    /* ========================================================
       SUCCESS MESSAGE
    ======================================================== */

    useEffect(() => {
        if (!successMessage) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setSuccessMessage('');
        }, 4000);

        return () => window.clearTimeout(timer);
    }, [successMessage]);

    /* ========================================================
       BACK
    ======================================================== */

    const handleBack = () => {
        if (loading) {
            return;
        }

        navigate('/admin/dashboard/users');
    };

    /* ========================================================
       LIVE PREVIEW
    ======================================================== */

    const handleFormChange = useCallback((formData) => {
        setFormPreview(formData);
    }, []);

    /* ========================================================
       CREATE USER
    ======================================================== */

    const handleAddUser = async (formData) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        setFieldErrors({});

        try {
            await createUser(formData);

            setSuccessMessage(
                `${formData.name || 'User'} was created successfully. Their email is currently unverified.`,
            );

            setFormPreview({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: '',
                verification_method: 'demo',
                status: 'inactive',
            });

            setFormResetKey((previous) => previous + 1);
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setFieldErrors(err.errors);
            }

            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ========================================================
       PREVIEW DATA
    ======================================================== */

    const selectedRole = ROLE_META[formPreview.role];
    const RoleIcon = selectedRole?.icon || UserRound;

    const name = formPreview.name?.trim();
    const displayName = name || 'New user';
    const initial = name ? name.charAt(0).toUpperCase() : null;

    const completedFields = [
        formPreview.name,
        formPreview.email,
        formPreview.phone,
        formPreview.role,
    ].filter(Boolean).length;

    const completionPercentage = (completedFields / 4) * 100;

    /* ========================================================
       UI
    ======================================================== */

    return (
        <div
            className="
                space-y-10
                font-sans!

                lg:space-y-12
            "
        >
            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <PageHeader
                title="Add User"
                subtitle="Create and configure a new account for the Stand For People platform."
                action={
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="
                            group

                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2.5

                            border
                            border-[#29323E]

                            bg-[#0E1219]

                            px-3.5

                            font-sans!
                            text-[11px]
                            font-medium!
                            whitespace-nowrap

                            text-[#AEB7C3]!

                            transition-[background-color,border-color,color]
                            duration-150
                            ease-out

                            hover:border-[#394555]
                            hover:bg-[#1A222D]
                            hover:text-[#EEF1F5]!

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <ArrowLeft
                            size={14}
                            strokeWidth={1.8}
                            className="
                                shrink-0
                                text-[#697586]

                                transition-[transform,color]
                                duration-150

                                group-hover:-translate-x-0.5
                                group-hover:text-[#AEB7C3]
                            "
                        />

                        <span>Back to users</span>
                    </button>
                }
            />

            {/* =================================================
                SUCCESS
            ================================================== */}

            <SuccessToast
                show={Boolean(successMessage)}
                message={successMessage}
            />

            {/* =================================================
                WORKSPACE
            ================================================== */}

            <section
                className="
                    overflow-hidden

                    border
                    border-[#252D38]

                    bg-[#0E1219]
                "
            >
                {/* =================================================
                    WORKSPACE HEADER
                ================================================== */}

                <header
                    className="
                        relative

                        border-b
                        border-[#252D38]

                        bg-[#1A222D]

                        px-6
                        py-7

                        sm:px-7
                        sm:py-8

                        lg:px-8
                        lg:py-8

                        xl:px-10
                        xl:py-9
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            absolute
                            bottom-0
                            left-0
                            top-0

                            w-[2px]

                            bg-[#697586]
                        "
                    />

                    <div
                        className="
                            flex
                            flex-col
                            gap-7

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:gap-10

                            lg:gap-12
                        "
                    >
                        {/* LEFT */}

                        <div className="min-w-0 flex-1">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3.5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center

                                        border
                                        border-[#303A47]

                                        bg-[#151B24]

                                        text-[#8792A1]
                                    "
                                >
                                    <UserRound size={15} strokeWidth={1.8} />
                                </div>

                                <div
                                    className="
                                        flex
                                        min-w-0
                                        flex-wrap
                                        items-center
                                        gap-x-2.5
                                        gap-y-1
                                    "
                                >
                                    <span
                                        className="
                                            font-sans!

                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#8792A1]
                                        "
                                    >
                                        User directory
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="
                                            h-1
                                            w-1
                                            shrink-0
                                            rounded-full

                                            bg-[#4B5869]
                                        "
                                    />

                                    <span
                                        className="
                                            font-sans!

                                            text-[9px]
                                            font-medium!
                                            uppercase
                                            tracking-[0.12em]

                                            text-[#697586]
                                        "
                                    >
                                        New account
                                    </span>
                                </div>
                            </div>

                            <h2
                                className="
                                    mt-5

                                    font-sans!

                                    text-[18px]
                                    font-semibold!
                                    leading-[1.3]
                                    tracking-[-0.02em]

                                    text-[#EEF1F5]!

                                    sm:text-[19px]
                                "
                            >
                                Create a new user
                            </h2>

                            <p
                                className="
                                    mt-2.5
                                    max-w-[650px]

                                    font-sans!

                                    text-[11px]
                                    font-normal!
                                    leading-[1.75]

                                    text-[#8792A1]!

                                    sm:text-[11.5px]
                                "
                            >
                                Enter the user's basic information, assign their
                                account type, and review the initial access
                                settings before creating the account.
                            </p>
                        </div>

                        {/* RIGHT */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-3.5

                                border-t
                                border-[#303A47]

                                pt-5

                                sm:border-l
                                sm:border-t-0
                                sm:pl-7
                                sm:pt-0

                                lg:pl-8
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center

                                    border
                                    border-[#303A47]

                                    bg-[#151B24]

                                    text-[#8792A1]
                                "
                            >
                                <Check size={14} strokeWidth={2} />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        font-sans!

                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.13em]

                                        text-[#697586]
                                    "
                                >
                                    Form guide
                                </p>

                                <p
                                    className="
                                        mt-1.5

                                        font-sans!

                                        text-[10px]
                                        font-normal!

                                        text-[#8792A1]
                                    "
                                >
                                    Required fields are marked *
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =================================================
                    BODY
                ================================================== */}

                <div
                    className="
                        grid
                        min-w-0

                        lg:grid-cols-[310px_minmax(0,1fr)]
                        xl:grid-cols-[330px_minmax(0,1fr)]
                    "
                >
                    {/* =================================================
                        LIVE PREVIEW
                    ================================================== */}

                    <aside
                        className="
                            hidden

                            border-[#252D38]

                            bg-[#0E1219]

                            lg:block
                            lg:border-r
                        "
                    >
                        <div
                            className="
                                flex
                                h-full
                                min-h-[720px]
                                flex-col

                                px-7
                                py-9

                                xl:px-8
                                xl:py-10
                            "
                        >
                            {/* =========================================
                                PREVIEW LABEL
                            ========================================= */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        aria-hidden="true"
                                        className="
                                            h-[2px]
                                            w-4
                                            shrink-0

                                            bg-[#697586]
                                        "
                                    />

                                    <p
                                        className="
                                            truncate

                                            font-sans!

                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#8792A1]
                                        "
                                    >
                                        User preview
                                    </p>
                                </div>

                                <span
                                    className="
                                        shrink-0

                                        font-sans!

                                        text-[9px]
                                        font-medium!
                                        tabular-nums

                                        text-[#697586]
                                    "
                                >
                                    {completedFields}/4
                                </span>
                            </div>

                            {/* =========================================
                                IDENTITY
                            ========================================= */}

                            <div className="mt-10">
                                <div
                                    className={`
                                        relative

                                        flex
                                        h-[68px]
                                        w-[68px]
                                        items-center
                                        justify-center

                                        border

                                        font-sans!
                                        text-[20px]
                                        font-semibold!

                                        transition-[background-color,border-color,color]
                                        duration-200

                                        ${
                                            name
                                                ? `
                                                    border-[#394555]
                                                    bg-[#1A222D]
                                                    text-[#EEF1F5]
                                                `
                                                : `
                                                    border-[#29323E]
                                                    bg-[#151B24]
                                                    text-[#697586]
                                                `
                                        }
                                    `}
                                >
                                    {initial || (
                                        <UserRound
                                            size={22}
                                            strokeWidth={1.5}
                                        />
                                    )}

                                    {name && (
                                        <span
                                            className="
                                                absolute
                                                -bottom-1
                                                -right-1

                                                flex
                                                h-5
                                                w-5
                                                items-center
                                                justify-center

                                                border-2
                                                border-[#0E1219]

                                                bg-[#303A47]

                                                text-[#DCE1E7]
                                            "
                                        >
                                            <Check
                                                size={10}
                                                strokeWidth={2.4}
                                            />
                                        </span>
                                    )}
                                </div>

                                <h2
                                    className={`
                                        mt-6
                                        truncate

                                        font-sans!

                                        text-[18px]
                                        font-semibold!
                                        leading-[1.3]
                                        tracking-[-0.02em]

                                        ${
                                            name
                                                ? 'text-[#EEF1F5]!'
                                                : 'text-[#697586]!'
                                        }
                                    `}
                                >
                                    {displayName}
                                </h2>

                                <div
                                    className="
                                        mt-3.5

                                        flex
                                        min-w-0
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <RoleIcon
                                        size={14}
                                        strokeWidth={1.7}
                                        className={
                                            selectedRole
                                                ? 'shrink-0 text-[#A6AFBB]'
                                                : 'shrink-0 text-[#5E6978]'
                                        }
                                    />

                                    <span
                                        className={`
                                            truncate

                                            font-sans!

                                            text-[11px]
                                            font-medium!

                                            ${
                                                selectedRole
                                                    ? 'text-[#AEB7C3]'
                                                    : 'text-[#5E6978]'
                                            }
                                        `}
                                    >
                                        {selectedRole?.label ||
                                            'No account type selected'}
                                    </span>
                                </div>

                                {selectedRole && (
                                    <p
                                        className="
                                            mt-2
                                            pl-[24px]

                                            font-sans!

                                            text-[10px]
                                            font-normal!
                                            leading-[1.65]

                                            text-[#697586]
                                        "
                                    >
                                        {selectedRole.description}
                                    </p>
                                )}
                            </div>

                            {/* =========================================
                                CONTACT DETAILS
                            ========================================= */}

                            <div
                                className="
                                    mt-10

                                    space-y-6

                                    border-t
                                    border-[#252D38]

                                    pt-8
                                "
                            >
                                <DetailRow
                                    icon={Mail}
                                    label="Email"
                                    value={
                                        formPreview.email || 'Not entered yet'
                                    }
                                    muted={!formPreview.email}
                                />

                                <DetailRow
                                    icon={Phone}
                                    label="Phone"
                                    value={
                                        formPreview.phone || 'Not entered yet'
                                    }
                                    muted={!formPreview.phone}
                                />

                                <DetailRow
                                    icon={RoleIcon}
                                    label="Account type"
                                    value={
                                        selectedRole?.label ||
                                        'Not selected yet'
                                    }
                                    muted={!selectedRole}
                                />
                            </div>

                            {/* =========================================
                                INITIAL ACCESS
                            ========================================= */}

                            <div
                                className="
                                    mt-10

                                    border-t
                                    border-[#252D38]

                                    pt-8
                                "
                            >
                                <p
                                    className="
                                        font-sans!

                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]

                                        text-[#697586]
                                    "
                                >
                                    Initial access
                                </p>

                                <div
                                    className="
                                        mt-5

                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-3
                                        gap-y-2.5
                                    "
                                >
                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2

                                            font-sans!

                                            text-[10.5px]
                                            font-medium!

                                            text-[#8792A1]
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                rounded-full

                                                bg-[#697586]
                                            "
                                        />
                                        Inactive
                                    </span>

                                    <span className="text-[#394555]">/</span>

                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2

                                            font-sans!

                                            text-[10.5px]
                                            font-medium!

                                            text-[#D8B278]
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                rounded-full

                                                bg-[#D39A4A]
                                            "
                                        />
                                        Email unverified
                                    </span>
                                </div>
                            </div>

                            {/* =========================================
                                COMPLETION
                            ========================================= */}

                            <div className="mt-10">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <span
                                        className="
                                            font-sans!

                                            text-[10px]
                                            font-normal!

                                            text-[#697586]
                                        "
                                    >
                                        Details completed
                                    </span>

                                    <span
                                        className="
                                            font-sans!

                                            text-[10px]
                                            font-semibold!
                                            tabular-nums

                                            text-[#AEB7C3]
                                        "
                                    >
                                        {completedFields}/4
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-3.5
                                        h-[3px]

                                        overflow-hidden

                                        bg-[#202832]
                                    "
                                >
                                    <div
                                        className="
                                            h-full

                                            bg-[#697586]

                                            transition-[width]
                                            duration-300
                                            ease-out
                                        "
                                        style={{
                                            width: `${completionPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* =========================================
                                FOOTER NOTE
                            ========================================= */}

                            <div
                                className="
                                    mt-auto
                                    pt-12
                                "
                            >
                                <div
                                    className="
                                        border-t
                                        border-[#252D38]

                                        pt-7
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-3.5
                                        "
                                    >
                                        <ShieldCheck
                                            size={15}
                                            strokeWidth={1.6}
                                            className="
                                                mt-0.5
                                                shrink-0

                                                text-[#697586]
                                            "
                                        />

                                        <p
                                            className="
                                                max-w-[225px]

                                                font-sans!

                                                text-[10px]
                                                font-normal!
                                                leading-[1.75]

                                                text-[#697586]
                                            "
                                        >
                                            Review identity and access details
                                            before creating this account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        FORM
                    ================================================== */}

                    <main
                        className="
                            min-w-0
                            bg-[#0E1219]
                        "
                    >
                        <div
                            className="
                                min-w-0

                                px-6
                                py-9

                                sm:px-7
                                sm:py-10

                                lg:px-9
                                lg:py-11

                                xl:px-11
                                xl:py-12

                                2xl:px-12
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    w-full
                                "
                            >
                                <UserForm
                                    key={formResetKey}
                                    mode="add"
                                    loading={loading}
                                    error={error}
                                    fieldErrors={fieldErrors}
                                    onSubmit={handleAddUser}
                                    onCancel={handleBack}
                                    onFormChange={handleFormChange}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </div>
    );
};

export default AddUser;
