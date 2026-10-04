// src/pages/Admin/Users/components/EditUserView.jsx

import React from 'react';
import {
    Building2,
    Mail,
    PencilLine,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import UserForm from './UserForm';

/* ============================================================
   HELPERS
============================================================ */

const formatRole = (role) => {
    if (!role) return 'User';

    if (role === 'admin') {
        return 'Administrator';
    }

    return String(role)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatStatus = (status) => {
    if (!status) return 'Unknown';

    return String(status)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* ============================================================
   EDIT USER VIEW
============================================================ */

const EditUserView = ({
    user,
    saving,
    saveError,
    fieldErrors,
    onSubmit,
    onCancel,
}) => {
    if (!user) {
        return null;
    }

    const isOrganization = user.role === 'organization';

    const roleLabel = formatRole(user.role);
    const statusLabel = formatStatus(user.status);

    const userInitial = user.name?.trim()?.charAt(0)?.toUpperCase() || null;

    return (
        <div className="w-full">
            <section
                className="
                    overflow-hidden

                    border
                    border-[#343A42]

                    bg-[#1E2227]
                "
            >
                <div
                    className="
                        grid

                        lg:grid-cols-[260px_minmax(0,1fr)]
                        xl:grid-cols-[280px_minmax(0,1fr)]
                    "
                >
                    {/* =================================================
                        EDIT USER SIDEBAR
                    ================================================== */}

                    <aside
                        className="
                            relative
                            overflow-hidden

                            border-b
                            border-[#343A42]

                            bg-[#191D21]

                            lg:border-r
                            lg:border-b-0
                        "
                    >
                        {/* accent */}

                        <span
                            className="
                                absolute
                                top-0
                                left-0

                                h-[3px]
                                w-full

                                bg-[#0F766E]

                                lg:h-full
                                lg:w-[2px]
                            "
                        />

                        <div
                            className="
                                flex
                                h-full
                                flex-col

                                px-5
                                py-6

                                sm:px-7

                                lg:min-h-[620px]
                                lg:px-6
                                lg:py-7

                                xl:px-7
                            "
                        >
                            {/* =========================================
                                EDIT CONTEXT LABEL
                            ========================================== */}

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
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center

                                            border
                                            border-[#344A44]

                                            bg-[#202A27]

                                            text-[#76A096]
                                        "
                                    >
                                        <PencilLine
                                            size={12}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <span
                                        className="
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.17em]

                                            text-[#73988F]
                                        "
                                    >
                                        Editing
                                    </span>
                                </div>

                                <span
                                    className="
                                        text-[9px]
                                        font-medium!
                                        uppercase
                                        tracking-[0.11em]

                                        text-[#59636C]
                                    "
                                >
                                    {roleLabel}
                                </span>
                            </div>

                            {/* =========================================
                                USER IDENTITY
                            ========================================== */}

                            <div
                                className="
                                    mt-7

                                    flex
                                    items-center
                                    gap-4

                                    lg:block
                                "
                            >
                                <div
                                    className="
                                        relative

                                        flex
                                        h-[62px]
                                        w-[62px]
                                        shrink-0
                                        items-center
                                        justify-center

                                        border
                                        border-[#3A504A]

                                        bg-[#222D2A]

                                        text-[19px]
                                        font-semibold!
                                        text-[#E4EBE9]

                                        lg:h-[68px]
                                        lg:w-[68px]
                                    "
                                >
                                    {userInitial ? (
                                        userInitial
                                    ) : isOrganization ? (
                                        <Building2
                                            size={23}
                                            strokeWidth={1.5}
                                        />
                                    ) : (
                                        <UserRound
                                            size={23}
                                            strokeWidth={1.5}
                                        />
                                    )}

                                    <span
                                        className="
                                            absolute
                                            right-[-5px]
                                            bottom-[-5px]

                                            flex
                                            h-[20px]
                                            w-[20px]
                                            items-center
                                            justify-center

                                            border-[3px]
                                            border-[#191D21]

                                            bg-[#30423D]

                                            text-[#A9C0BA]
                                        "
                                    >
                                        <PencilLine size={8} strokeWidth={2} />
                                    </span>
                                </div>

                                <div
                                    className="
                                        min-w-0

                                        lg:mt-5
                                    "
                                >
                                    <h2
                                        className="
                                            truncate

                                            text-[18px]
                                            font-semibold!
                                            leading-[1.35]
                                            tracking-[-0.025em]

                                            text-[#F1F3F3]!

                                            lg:whitespace-normal
                                            lg:text-[19px]
                                        "
                                    >
                                        {user.name || 'Unnamed user'}
                                    </h2>

                                    <p
                                        className="
                                            mt-1.5

                                            text-[12px]
                                            text-[#7B858E]
                                        "
                                    >
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {/* =========================================
                                ACCOUNT INFORMATION
                            ========================================== */}

                            <div
                                className="
                                    mt-6 pt-3

                                    border-t
                                    border-[#30363D]
                                "
                            >

                                {/* status */}

                                <div className="py-4">
                                    <p
                                        className="
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.14em]

                                            text-[#5E6972]
                                        "
                                    >
                                        Platform access
                                    </p>

                                    <div
                                        className="
                                            mt-3

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
                                                gap-2.5
                                            "
                                        >
                                            <span
                                                className={`
                                                    h-2
                                                    w-2
                                                    shrink-0
                                                    rounded-full

                                                    ${
                                                        user.status === 'active'
                                                            ? 'bg-[#76A398]'
                                                            : user.status ===
                                                                'suspended'
                                                              ? 'bg-[#B98572]'
                                                              : 'bg-[#77818A]'
                                                    }
                                                `}
                                            />

                                            <span
                                                className="
                                                    truncate

                                                    text-[12px]
                                                    font-medium!
                                                    text-[#C4C9CD]
                                                "
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>

                                        <span
                                            className="
                                                shrink-0

                                                text-[9px]
                                                uppercase
                                                tracking-[0.1em]

                                                text-[#555F68]
                                            "
                                        >
                                            Current
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* =========================================
                                SIDEBAR FOOTER
                            ========================================== */}

                            <div
                                className="
                                    mt-6

                                    border-t
                                    border-[#30363D]

                                    pt-4

                                    lg:mt-auto
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-2.5

                                        text-[9px]
                                        leading-[1.6]

                                        text-[#5F696F]
                                    "
                                >
                                    <ShieldCheck
                                        size={12}
                                        strokeWidth={1.7}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-[#657C76]
                                        "
                                    />

                                    <span>
                                        Administrative account management
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        EDIT WORKSPACE
                    ================================================== */}

                    <main
                        className="
                            min-w-0

                            bg-[#202429]

                            px-5
                            py-7

                            sm:px-7
                            sm:py-8

                            lg:px-8
                            lg:py-8

                            xl:px-10

                            2xl:px-11
                        "
                    >
                        <div className="mx-auto w-full">
                            {/* =========================================
                                WORKSPACE HEADER
                            ========================================== */}

                            <div
                                className="
                                    mb-8

                                    flex
                                    flex-col
                                    gap-3

                                    border-b
                                    border-[#343A41]

                                    pb-5

                                    sm:flex-row
                                    sm:items-end
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#6C777F]
                                        "
                                    >
                                        Account settings
                                    </p>

                                    <h3
                                        className="
                                            mt-1.5

                                            text-[17px]
                                            font-semibold!
                                            tracking-[-0.02em]

                                            text-[#E9EBED]!
                                        "
                                    >
                                        Edit account information
                                    </h3>
                                </div>

                                <p
                                    className="
                                        max-w-[360px]

                                        text-[10px]
                                        leading-[1.65]

                                        text-[#69737D]

                                        sm:text-right
                                    "
                                >
                                    Update identity, contact details and
                                    platform access.
                                </p>
                            </div>

                            {/* =========================================
                                FORM
                            ========================================== */}

                            <UserForm
                                mode="edit"
                                user={user}
                                loading={saving}
                                error={saveError}
                                fieldErrors={fieldErrors}
                                onSubmit={onSubmit}
                                onCancel={onCancel}
                            />
                        </div>
                    </main>
                </div>
            </section>
        </div>
    );
};

export default EditUserView;
