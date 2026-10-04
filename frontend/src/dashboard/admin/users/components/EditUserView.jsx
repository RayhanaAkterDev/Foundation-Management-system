// src/pages/Admin/Users/components/EditUserView.jsx

import React from 'react';
import { Building2, PencilLine, ShieldCheck, UserRound } from 'lucide-react';

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
        <div className="w-full font-sans!">
            <section
                className="
                    overflow-hidden
                    border
                    border-[#252D38]
                    bg-[#0E1219]
                "
            >
                <div
                    className="
                        grid
                        lg:grid-cols-[270px_minmax(0,1fr)]
                        xl:grid-cols-[290px_minmax(0,1fr)]
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
                            border-[#252D38]
                            bg-[#0E1219]
                            lg:border-r
                            lg:border-b-0
                        "
                    >
                        {/* ACCENT */}

                        <span
                            aria-hidden="true"
                            className="
                                absolute
                                top-0
                                left-0
                                h-[2px]
                                w-full
                                bg-[#465261]
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
                                py-5
                                sm:px-6
                                sm:py-6
                                lg:min-h-[640px]
                                lg:px-7
                                lg:py-8
                                xl:px-8
                                xl:py-9
                            "
                        >
                            {/* =========================================
                                EDIT CONTEXT
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
                                        min-w-0
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            shrink-0
                                            items-center
                                            justify-center
                                            border
                                            border-[#303A47]
                                            bg-[#151B24]
                                            text-[#8792A1]
                                        "
                                    >
                                        <PencilLine
                                            size={12}
                                            strokeWidth={1.75}
                                        />
                                    </div>

                                    <span
                                        className="
                                            font-sans!
                                            text-[8.5px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]
                                            text-[#8792A1]!
                                            sm:text-[9px]
                                        "
                                    >
                                        Editing
                                    </span>
                                </div>

                                <span
                                    className="
                                        shrink-0
                                        font-sans!
                                        text-[8.5px]
                                        font-medium!
                                        uppercase
                                        tracking-[0.1em]
                                        text-[#5E6978]!
                                        sm:text-[9px]
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
                                    mt-6
                                    flex
                                    min-w-0
                                    items-center
                                    gap-4
                                    sm:mt-7
                                    lg:mt-8
                                    lg:block
                                "
                            >
                                <div
                                    className="
                                        relative
                                        flex
                                        h-[58px]
                                        w-[58px]
                                        shrink-0
                                        items-center
                                        justify-center
                                        border
                                        border-[#303A47]
                                        bg-[#151B24]
                                        font-sans!
                                        text-[18px]
                                        font-semibold!
                                        text-[#DCE1E7]!
                                        sm:h-[62px]
                                        sm:w-[62px]
                                        sm:text-[19px]
                                        lg:h-[68px]
                                        lg:w-[68px]
                                        lg:text-[20px]
                                    "
                                >
                                    {userInitial ? (
                                        userInitial
                                    ) : isOrganization ? (
                                        <Building2
                                            size={23}
                                            strokeWidth={1.55}
                                        />
                                    ) : (
                                        <UserRound
                                            size={23}
                                            strokeWidth={1.55}
                                        />
                                    )}

                                    <span
                                        className="
                                            absolute
                                            -right-[5px]
                                            -bottom-[5px]
                                            flex
                                            h-5
                                            w-5
                                            items-center
                                            justify-center
                                            border-[3px]
                                            border-[#0E1219]
                                            bg-[#1D2632]
                                            text-[#AEB7C3]
                                        "
                                    >
                                        <PencilLine size={8} strokeWidth={2} />
                                    </span>
                                </div>

                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                        lg:mt-5
                                    "
                                >
                                    <h2
                                        className="
                                            truncate
                                            font-sans!
                                            text-[16px]
                                            font-semibold!
                                            leading-[1.35]
                                            tracking-[-0.02em]
                                            text-[#EEF1F5]!
                                            sm:text-[17px]
                                            lg:whitespace-normal
                                            lg:text-[19px]
                                        "
                                    >
                                        {user.name || 'Unnamed user'}
                                    </h2>

                                    <p
                                        className="
                                            mt-1.5
                                            truncate
                                            font-sans!
                                            text-[10.5px]
                                            font-normal!
                                            leading-5
                                            text-[#8792A1]!
                                            sm:text-[11px]
                                            lg:mt-2
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
                                    mt-6
                                    border-t
                                    border-[#252D38]
                                    pt-5
                                    sm:mt-7
                                    sm:pt-6
                                    lg:mt-8
                                    lg:pt-7
                                "
                            >
                                <p
                                    className="
                                        font-sans!
                                        text-[8.5px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#697586]!
                                        sm:text-[9px]
                                    "
                                >
                                    Platform access
                                </p>

                                <div
                                    className="
                                        mt-3.5
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        sm:mt-4
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
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                rounded-full
                                                ${
                                                    user.status === 'active'
                                                        ? 'bg-[#6FA58A]'
                                                        : user.status ===
                                                            'suspended'
                                                          ? 'bg-[#B88963]'
                                                          : 'bg-[#697586]'
                                                }
                                            `}
                                        />

                                        <span
                                            className="
                                                truncate
                                                font-sans!
                                                text-[11px]
                                                font-medium!
                                                text-[#B8C0CA]!
                                                sm:text-[11.5px]
                                            "
                                        >
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <span
                                        className="
                                            shrink-0
                                            font-sans!
                                            text-[8px]
                                            font-medium!
                                            uppercase
                                            tracking-[0.11em]
                                            text-[#5E6978]!
                                            sm:text-[8.5px]
                                        "
                                    >
                                        Current
                                    </span>
                                </div>
                            </div>

                            {/* =========================================
                                SIDEBAR FOOTER
                            ========================================== */}

                            <div
                                className="
                                    mt-6
                                    border-t
                                    border-[#252D38]
                                    pt-4
                                    sm:mt-7
                                    sm:pt-5
                                    lg:mt-auto
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-2.5
                                    "
                                >
                                    <ShieldCheck
                                        size={13}
                                        strokeWidth={1.7}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-[#697586]
                                        "
                                    />

                                    <span
                                        className="
                                            font-sans!
                                            text-[9px]
                                            font-normal!
                                            leading-[1.6]
                                            text-[#5E6978]!
                                            sm:text-[9.5px]
                                        "
                                    >
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
                            bg-[#151A21]
                            px-5
                            py-6
                            sm:px-6
                            sm:py-7
                            lg:px-9
                            lg:py-9
                            xl:px-10
                            xl:py-10
                            2xl:px-11
                        "
                    >
                        <div className="mx-auto w-full">
                            {/* =========================================
                                WORKSPACE HEADER
                            ========================================== */}

                            <div
                                className="
                                    mb-7
                                    flex
                                    flex-col
                                    gap-3
                                    border-b
                                    border-[#252D38]
                                    pb-5
                                    sm:mb-8
                                    sm:pb-6
                                    md:flex-row
                                    md:items-end
                                    md:justify-between
                                    md:gap-8
                                    lg:mb-9
                                    lg:pb-7
                                "
                            >
                                <div className="min-w-0">
                                    <p
                                        className="
                                            font-sans!
                                            text-[8.5px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]
                                            text-[#697586]!
                                            sm:text-[9px]
                                        "
                                    >
                                        Account settings
                                    </p>

                                    <h3
                                        className="
                                            mt-1.5
                                            font-sans!
                                            text-[16px]
                                            font-semibold!
                                            leading-[1.35]
                                            tracking-[-0.02em]
                                            text-[#EEF1F5]!
                                            sm:text-[17px]
                                            lg:mt-2
                                            lg:text-[18px]
                                        "
                                    >
                                        Edit account information
                                    </h3>
                                </div>

                                <p
                                    className="
                                        max-w-[380px]
                                        font-sans!
                                        text-[10px]
                                        font-normal!
                                        leading-[1.65]
                                        text-[#697586]!
                                        sm:text-[10.5px]
                                        md:text-right
                                        lg:text-[11px]
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
