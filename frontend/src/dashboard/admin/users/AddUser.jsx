import React, { useCallback, useState } from 'react';
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
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import { createUser } from './api/userApi';

/* ============================================================
   ROLE META
============================================================ */

const ROLE_META = {
    individual: {
        label: 'Individual',
        icon: UserRound,
    },
    organization: {
        label: 'Organization',
        icon: Building2,
    },
    admin: {
        label: 'Administrator',
        icon: UserCog,
    },
};

/* ============================================================
   PREVIEW DETAIL
============================================================ */

const DetailRow = ({ label, value, muted = false }) => {
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
            <div className="min-w-0 pt-0.5">
                <p
                    className="
                        font-sans!

                        text-[10px]
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
                        text-[12px]
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
    const [success, setSuccess] = useState({ open: false, name: '' });
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
        setSuccess({ open: false, name: '' });
        setFieldErrors({});

        try {
            await createUser(formData);

            setSuccess({ open: true, name: formData.name?.trim() || 'User' });

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

    /* ========================================================
       UI
    ======================================================== */

    return (
        <div
            className="
                space-y-5
                font-sans!

                lg:space-y-6
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
            inline-flex h-10
            items-center justify-center gap-2
            border border-[#343e4b]
            bg-transparent
            px-3.5

            font-sans text-[12px] font-medium
            whitespace-nowrap text-[#b8c2cf]

            transition-colors duration-150

            hover:border-[#4b596a]
            hover:bg-[#1c232d]
            hover:text-[#f1f5f9]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#8792A1]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#171c24]

            disabled:cursor-not-allowed
            disabled:opacity-40
        "
                    >
                        <ArrowLeft
                            size={15}
                            strokeWidth={1.8}
                            className="
                shrink-0 text-[#8492a3]
                transition-colors duration-150
                group-hover:text-[#e2e8f0]
            "
                        />

                        <span>Back to users</span>
                    </button>
                }
            />

            {/* =================================================
                SUCCESS
            ================================================== */}

            <SuccessDialog
                open={success.open}
                action="created"
                entity="user"
                name={success.name}
                onClose={() => setSuccess({ open: false, name: '' })}
            />

            {/* =================================================
                WORKSPACE
            ================================================== */}

            <section
                className="
                    @container
                    min-w-0 overflow-hidden
                    border border-[#303A47]
                    bg-[#0E1219]
                "
            >
                {/* =================================================
                    BODY
                ================================================== */}

                <div
                    className="
                        grid
                        min-w-0

                        @6xl:grid-cols-[290px_minmax(0,1fr)]
                        @7xl:grid-cols-[310px_minmax(0,1fr)]
                    "
                >
                    {/* COMPACT USER HEADER — shown until the wide-container breakpoint */}
                    <div className="min-w-0 border-b border-[#252D38] bg-[#141B24] px-4 py-4 sm:px-6 @6xl:hidden">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-[#303A47] bg-[#1A222D] text-[15px] font-semibold text-[#DCE2EA]">
                                {initial || (
                                    <UserRound size={19} strokeWidth={1.6} />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className="truncate text-[14px] font-semibold text-[#DCE2EA]"
                                    title={displayName}
                                >
                                    {displayName}
                                </p>

                                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-[#8792A1]">
                                    <RoleIcon
                                        size={12}
                                        className="shrink-0"
                                        strokeWidth={1.7}
                                    />

                                    <span className="truncate">
                                        {selectedRole?.label ||
                                            'Account type not selected'}
                                    </span>
                                </div>
                            </div>

                            <span
                                className="hidden max-w-[35%] truncate text-right text-[11px] text-[#8792A1] sm:block"
                                title={formPreview.email || ''}
                            >
                                {formPreview.email || 'No email'}
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        LIVE PREVIEW
                    ================================================== */}

                    <aside
                        className="
                            hidden

                            border-[#252D38]

                            bg-[#141B24]

                            @6xl:block
                            @6xl:border-r
                        "
                    >
                        <div
                            className="
                                flex
                                h-full
                                min-h-[520px]
                                flex-col

                                px-6
                                py-7

                                xl:px-7
                                xl:py-8
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

                                            text-[10px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#8792A1]
                                        "
                                    >
                                        User preview
                                    </p>
                                </div>
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

                                            text-[12px]
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

                                            text-[11px]
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
                                    mt-6

                                    space-y-6


                                    py-8
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
                            </div>

                            {/* =========================================
                                FOOTER NOTE
                            ========================================= */}

                            <div
                                className="
                                    mt-auto
                                    border-t
                                    border-[#252D38]
                                "
                            >
                                <div
                                    className="
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

                                                text-[11px]
                                                leading-[1.75]
                                                font-medium!

                                                text-[#697586]
                                            "
                                        >
                                            Confirm the details before creating.
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

                                px-4 py-7
                                sm:px-8 sm:py-9
                                lg:px-9 lg:py-10
                                xl:px-10
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
