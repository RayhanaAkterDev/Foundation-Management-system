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
        <div className="group flex min-w-0 items-start gap-3.5">
            <div
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center

                    border
                    border-[#31383F]

                    bg-[#20252A]

                    text-[#68737E]

                    transition-colors

                    group-hover:border-[#3A444B]
                    group-hover:text-[#84908F]
                "
            >
                <Icon size={14} strokeWidth={1.65} />
            </div>

            <div className="min-w-0 pt-[1px]">
                <p
                    className="
                        text-[9px]
                        font-semibold!
                        uppercase
                        tracking-[0.14em]

                        text-[#606A75]
                    "
                >
                    {label}
                </p>

                <p
                    className={`
                        mt-1
                        truncate

                        text-[12px]
                        font-medium!

                        ${muted ? 'text-[#5F6973]' : 'text-[#C9CED3]'}
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
        <div className="space-y-6">
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
                            gap-2

                            border
                            border-[#383F47]

                            bg-[#22262B]

                            px-4

                            text-[12px]
                            font-medium!
                            text-[#BFC5CB]

                            transition-all
                            duration-200

                            hover:border-[#4B555F]
                            hover:bg-[#292E34]
                            hover:text-[#F1F2F3]

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#0F766E]/40
                        "
                    >
                        <ArrowLeft
                            size={14}
                            strokeWidth={1.8}
                            className="
                                transition-transform
                                duration-200
                                group-hover:-translate-x-0.5
                            "
                        />
                        Back to users
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
                    border-[#3A4149]

                    bg-[#202429]

                    shadow-[0_18px_55px_rgba(0,0,0,0.14)]
                "
            >
                {/* =================================================
                    IMPROVED WORKSPACE HEADER
                ================================================== */}

                <header
                    className="
                        relative

                        overflow-hidden

                        border-b
                        border-[#363D44]

                        bg-[#1D2125]

                        px-6
                        py-6

                        sm:px-7
                        sm:py-7

                        lg:px-8

                        xl:px-10
                    "
                >
                    {/* subtle identity accent */}

                    <div
                        className="
                            absolute
                            top-0
                            left-0

                            h-full
                            w-[3px]

                            bg-[#0F766E]
                        "
                    />

                    <div
                        className="
                            flex
                            flex-col
                            gap-5

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        {/* Left */}

                        <div className="min-w-0">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center

                                        border
                                        border-[#36524C]

                                        bg-[#222D2A]

                                        text-[#79A99D]
                                    "
                                >
                                    <UserRound size={14} strokeWidth={1.8} />
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <span
                                        className="
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.17em]

                                            text-[#70817C]
                                        "
                                    >
                                        User directory
                                    </span>

                                    <span
                                        className="
                                            h-1
                                            w-1
                                            rounded-full

                                            bg-[#4B575F]
                                        "
                                    />

                                    <span
                                        className="
                                            text-[9px]
                                            font-medium!
                                            uppercase
                                            tracking-[0.12em]

                                            text-[#5E6872]
                                        "
                                    >
                                        New account
                                    </span>
                                </div>
                            </div>

                            <h2
                                className="
                                    mt-4

                                    text-[20px]
                                    font-semibold!
                                    leading-tight
                                    tracking-[-0.025em]

                                    text-[#F0F2F3]!

                                    sm:text-[21px]
                                "
                            >
                                Create a new user
                            </h2>

                            <p
                                className="
                                    mt-2
                                    max-w-[620px]

                                    text-[11px]
                                    leading-[1.7]

                                    text-[#7B858E]
                                "
                            >
                                Enter the user's basic information, assign their
                                account type, and review the initial access
                                settings before creating the account.
                            </p>
                        </div>

                        {/* Right */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-3

                                border-t
                                border-[#30363D]

                                pt-4

                                sm:border-t-0
                                sm:border-l
                                sm:pl-5
                                sm:pt-0
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center

                                    border
                                    border-[#34433F]

                                    bg-[#222A28]

                                    text-[#779A91]
                                "
                            >
                                <Check size={13} strokeWidth={2} />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.13em]

                                        text-[#69747E]
                                    "
                                >
                                    Form guide
                                </p>

                                <p
                                    className="
                                        mt-0.5

                                        text-[10px]

                                        text-[#89929B]
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

                        lg:grid-cols-[300px_minmax(0,1fr)]

                        xl:grid-cols-[320px_minmax(0,1fr)]

                    "
                >
                    {/* =================================================
                        LIVE PREVIEW
                    ================================================== */}

                    <aside
                        className="
                            border-b
                            border-[#363D44]

                            bg-[#1A1E22]

                            lg:border-r
                            lg:border-b-0
                            hidden lg:block
                        "
                    >
                        <div
                            className="
                                flex
                                h-full
                                flex-col

                                px-6
                                py-7

                                sm:px-7

                                lg:min-h-[660px]
                                lg:py-8
                            "
                        >
                            {/* Preview label */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <span
                                        className="
                                            h-[2px]
                                            w-4

                                            bg-[#0F766E]
                                        "
                                    />

                                    <p
                                        className="
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.17em]

                                            text-[#707B85]
                                        "
                                    >
                                        User preview
                                    </p>
                                </div>

                                <span
                                    className="
                                        text-[9px]
                                        font-medium!
                                        tabular-nums

                                        text-[#56616B]
                                    "
                                >
                                    {completedFields}
                                    /4
                                </span>
                            </div>

                            {/* =================================================
                                IDENTITY
                            ================================================== */}

                            <div className="mt-7">
                                <div
                                    className={`
                                        relative

                                        flex
                                        h-[66px]
                                        w-[66px]
                                        items-center
                                        justify-center

                                        border

                                        text-[20px]
                                        font-semibold!

                                        transition-all
                                        duration-200

                                        ${
                                            name
                                                ? `
                                                    border-[#3F5C55]
                                                    bg-[#24312E]
                                                    text-[#DFE8E5]
                                                    shadow-[0_0_0_4px_rgba(15,118,110,0.04)]
                                                `
                                                : `
                                                    border-[#353D45]
                                                    bg-[#22272C]
                                                    text-[#69747E]
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
                                                right-[-3px]
                                                bottom-[-3px]

                                                flex
                                                h-5
                                                w-5
                                                items-center
                                                justify-center

                                                border-2
                                                border-[#1A1E22]

                                                bg-[#0F766E]

                                                text-white
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
                                        mt-5
                                        truncate

                                        text-[19px]
                                        font-semibold!
                                        tracking-[-0.025em]

                                        ${
                                            name
                                                ? 'text-[#EEF0F2]!'
                                                : 'text-[#707A84]!'
                                        }
                                    `}
                                >
                                    {displayName}
                                </h2>

                                <div
                                    className="
                                        mt-2.5

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
                                                ? 'shrink-0 text-[#719B90]'
                                                : 'shrink-0 text-[#59636D]'
                                        }
                                    />

                                    <span
                                        className={`
                                            truncate

                                            text-[11px]
                                            font-medium!

                                            ${
                                                selectedRole
                                                    ? 'text-[#969FA8]'
                                                    : 'text-[#59636D]'
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
                                            mt-1.5
                                            pl-[23px]

                                            text-[10px]
                                            leading-4

                                            text-[#606A74]
                                        "
                                    >
                                        {selectedRole.description}
                                    </p>
                                )}
                            </div>

                            {/* =================================================
                                CONTACT DETAILS
                            ================================================== */}

                            <div
                                className="
                                    mt-8
                                    space-y-5

                                    border-t
                                    border-[#30363D]

                                    pt-6
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

                            {/* =================================================
                                INITIAL ACCESS
                            ================================================== */}

                            <div
                                className="
                                    mt-7

                                    border-t
                                    border-[#30363D]

                                    pt-6
                                "
                            >
                                <p
                                    className="
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]

                                        text-[#626D77]
                                    "
                                >
                                    Initial access
                                </p>

                                <div
                                    className="
                                        mt-3.5

                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-2.5
                                        gap-y-2
                                    "
                                >
                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2

                                            text-[11px]
                                            font-medium!

                                            text-[#89939C]
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full

                                                bg-[#737E88]
                                            "
                                        />
                                        Inactive
                                    </span>

                                    <span
                                        className="
                                            text-[#454E57]
                                        "
                                    >
                                        /
                                    </span>

                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2

                                            text-[11px]
                                            font-medium!

                                            text-[#B3956F]
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full

                                                bg-[#A77D4D]
                                            "
                                        />
                                        Email unverified
                                    </span>
                                </div>
                            </div>

                            {/* =================================================
                                COMPLETION
                            ================================================== */}

                            <div className="mt-7">
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
                                            text-[10px]

                                            text-[#69737D]
                                        "
                                    >
                                        Details completed
                                    </span>

                                    <span
                                        className="
                                            text-[10px]
                                            font-semibold!
                                            tabular-nums

                                            text-[#929CA5]
                                        "
                                    >
                                        {completedFields}
                                        /4
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-2.5
                                        h-[3px]

                                        overflow-hidden

                                        bg-[#2D343A]
                                    "
                                >
                                    <div
                                        className="
                                            h-full

                                            bg-[#0F766E]

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

                            {/* =================================================
                                FOOTER NOTE
                            ================================================== */}

                            <div className="mt-auto pt-10">
                                <div
                                    className="
                                        pt-12
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                        "
                                    >
                                        <ShieldCheck
                                            size={15}
                                            strokeWidth={1.6}
                                            className="
                                                mt-0.5
                                                shrink-0

                                                text-[#688A81]
                                            "
                                        />

                                        <p
                                            className="
                                                max-w-[220px]

                                                text-[10px]
                                                leading-[1.7]

                                                text-[#616C76]
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

                            bg-[#202429]
                        "
                    >
                        <div
                            className="
                                min-w-0

                                px-6
                                py-7

                                sm:px-7

                                lg:px-8
                                lg:py-8

                                xl:px-10
                                xl:py-9
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
