import React from 'react';

import {
    ArrowUpRight,
    Banknote,
    BarChart3,
    Building2,
    Megaphone,
    Settings,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';

import AdminLink from '../components/AdminLink';
import SectionHeading from '../components/SectionHeading';

const AdministrationSection = ({ onNavigate }) => {
    const adminItems = [
        {
            icon: Users,
            title: 'Users',
            description: 'Accounts, roles and platform access',
            path: '/admin/dashboard/users',
        },
        {
            icon: Building2,
            title: 'Organizations',
            description: 'Partners, organizations and access',
            path: '/admin/dashboard/organizations',
        },
        {
            icon: UserCheck,
            title: 'Volunteers',
            description: 'Participation and assignments',
            path: '/admin/dashboard/volunteers',
        },
        {
            icon: Megaphone,
            title: 'Campaigns',
            description: 'Campaign activity and coordination',
            path: '/admin/dashboard/campaigns',
        },
        {
            icon: ShieldCheck,
            title: 'Verification',
            description: 'Trust, verification and platform safety',
            path: '/admin/dashboard/verification',
        },
        {
            icon: Banknote,
            title: 'Donations',
            description: 'Contributions and financial activity',
            path: '/admin/dashboard/donations',
        },
        {
            icon: BarChart3,
            title: 'Reports',
            description: 'Platform activity and reporting',
            path: '/admin/dashboard/reports',
        },
        {
            icon: Settings,
            title: 'Settings',
            description: 'Configuration and preferences',
            path: '/admin/dashboard/settings',
        },
    ];

    const peopleItems = adminItems.slice(0, 3);
    const responseItems = adminItems.slice(3, 6);
    const oversightItems = adminItems.slice(6, 8);

    const renderItem = (item, index) => (
        <AdminLink
            key={item.title}
            {...item}
            index={index}
            onClick={() => onNavigate(item.path)}
        />
    );

    return (
        <section className="mt-14 sm:mt-16 lg:mt-20">
            <SectionHeading
                number="04"
                eyebrow="Administration"
                title="Platform Control Center"
                description="Manage the operational areas that support the humanitarian response."
            />

            <div className="mt-8 border border-border bg-surface sm:mt-9">
                {/* =================================================
                    DIRECTORY BODY
                ================================================== */}
                <div
                    className="
                        lg:grid
                        lg:grid-cols-[340px_minmax(0,1fr)]
                        xl:grid-cols-[360px_minmax(0,1fr)]
                    "
                >
                    {/* =================================================
                        LEFT — ADMINISTRATION CONTEXT
                    ================================================== */}
                    <aside
                        className="
                            flex
                            flex-col
                            border-b
                            border-border
                            bg-background-alt
                            lg:min-h-155
                            lg:border-b-0
                            lg:border-r
                        "
                    >
                        <div
                            className="
                                flex
                                flex-1
                                flex-col
                                p-5
                                sm:p-7
                                md:p-8
                                lg:p-8
                                xl:p-9
                            "
                        >
                            {/* EYEBROW */}
                            <div className="flex items-center gap-3">
                                <span
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        bg-primary
                                        text-white
                                        sm:h-9
                                        sm:w-9
                                    "
                                >
                                    <Settings size={15} strokeWidth={1.6} />
                                </span>

                                <div>
                                    <p
                                        className="
                                            font-poppins
                                            text-[8px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.16em]
                                            text-primary
                                            sm:text-[9px]
                                        "
                                    >
                                        Administration
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            font-jost
                                            text-[10px]
                                            text-text-secondary
                                        "
                                    >
                                        Platform controls
                                    </p>
                                </div>
                            </div>

                            {/* MAIN INTRO */}
                            <div className="mt-9 sm:mt-11 lg:mt-12">
                                <p
                                    className="
                                        font-poppins
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-text-secondary
                                        sm:text-[9px]
                                    "
                                >
                                    Control center
                                </p>

                                <h3
                                    className="
                                        mt-3
                                        max-w-75
                                        font-fraunces
                                        text-[30px]
                                        leading-[0.98]
                                        tracking-[-0.04em]
                                        text-text-primary
                                        sm:text-[34px]
                                        md:text-[36px]
                                        lg:text-[36px]
                                    "
                                >
                                    Everything
                                    <br />
                                    in one place.
                                </h3>

                                <p
                                    className="
                                        mt-4
                                        max-w-77.5
                                        font-jost
                                        text-[12px]
                                        leading-[1.65]
                                        text-text-secondary
                                        sm:mt-5
                                        sm:text-[13px]
                                    "
                                >
                                    Manage the people, partners, response
                                    activity and safeguards that keep Stand For
                                    People coordinated.
                                </p>
                            </div>

                            {/* CONTROL AREAS */}
                            <div
                                className="
                                    mt-9
                                    border-t
                                    border-border
                                    pt-5
                                    sm:mt-11
                                    sm:pt-6
                                "
                            >
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p
                                            className="
                                                font-poppins
                                                text-[8px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.15em]
                                                text-text-secondary
                                            "
                                        >
                                            Control areas
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-jost
                                                text-[10px]
                                                text-text-secondary
                                            "
                                        >
                                            Three operational groups
                                        </p>
                                    </div>

                                    <span
                                        className="
                                            shrink-0
                                            font-fraunces
                                            text-[26px]
                                            leading-none
                                            tracking-[-0.03em]
                                            text-text-primary
                                            sm:text-[28px]
                                        "
                                    >
                                        08
                                    </span>
                                </div>

                                <div className="mt-5 space-y-1">
                                    {/* PEOPLE */}
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            border-l-2
                                            border-primary
                                            bg-primary/6
                                            px-3
                                            py-3
                                            sm:px-4
                                            sm:py-3.5
                                        "
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="h-1.5 w-1.5 shrink-0 bg-primary" />

                                            <span
                                                className="
                                                    truncate
                                                    font-jost
                                                    text-[11px]
                                                    font-medium
                                                    text-text-primary
                                                "
                                            >
                                                People & partners
                                            </span>
                                        </div>

                                        <span
                                            className="
                                                ml-3
                                                shrink-0
                                                font-poppins
                                                text-[8px]
                                                font-medium
                                                text-text-secondary
                                            "
                                        >
                                            03
                                        </span>
                                    </div>

                                    {/* RESPONSE */}
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            border-l-2
                                            border-accent
                                            px-3
                                            py-3
                                            sm:px-4
                                            sm:py-3.5
                                        "
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="h-1.5 w-1.5 shrink-0 bg-accent" />

                                            <span
                                                className="
                                                    truncate
                                                    font-jost
                                                    text-[11px]
                                                    font-medium
                                                    text-text-secondary
                                                "
                                            >
                                                Response & resources
                                            </span>
                                        </div>

                                        <span
                                            className="
                                                ml-3
                                                shrink-0
                                                font-poppins
                                                text-[8px]
                                                font-medium
                                                text-text-secondary
                                            "
                                        >
                                            03
                                        </span>
                                    </div>

                                    {/* OVERSIGHT */}
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            border-l-2
                                            border-text-secondary/25
                                            px-3
                                            py-3
                                            sm:px-4
                                            sm:py-3.5
                                        "
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="h-1.5 w-1.5 shrink-0 bg-text-secondary/40" />

                                            <span
                                                className="
                                                    truncate
                                                    font-jost
                                                    text-[11px]
                                                    font-medium
                                                    text-text-secondary
                                                "
                                            >
                                                Trust & oversight
                                            </span>
                                        </div>

                                        <span
                                            className="
                                                ml-3
                                                shrink-0
                                                font-poppins
                                                text-[8px]
                                                font-medium
                                                text-text-secondary
                                            "
                                        >
                                            02
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM MESSAGE */}
                            <div className="mt-auto hidden pt-10 lg:block">
                                <div className="border-t border-border pt-5">
                                    <div className="flex items-start gap-3">
                                        <span
                                            className="
                                                mt-1
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                bg-primary
                                            "
                                        />

                                        <div>
                                            <p
                                                className="
                                                    font-jost
                                                    text-[11px]
                                                    font-medium
                                                    text-text-primary
                                                "
                                            >
                                                One administrative directory.
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    max-w-60
                                                    font-jost
                                                    text-[10px]
                                                    leading-[1.55]
                                                    text-text-secondary
                                                "
                                            >
                                                Each area connects directly to
                                                the tools needed to manage the
                                                platform.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        RIGHT — ADMINISTRATION DIRECTORY
                    ================================================== */}
                    <div className="min-w-0">
                        {/* =================================================
                            PEOPLE
                        ================================================== */}
                        <div
                            className="
                                px-5
                                py-6
                                sm:px-7
                                sm:py-7
                                lg:px-8
                                lg:py-8
                                xl:px-9
                            "
                        >
                            <div className="flex items-end justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-1.5 w-1.5 shrink-0 bg-primary" />

                                        <span
                                            className="
                                                font-poppins
                                                text-[8px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.15em]
                                                text-primary
                                                sm:text-[9px]
                                            "
                                        >
                                            People & partners
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            mt-1.5
                                            font-jost
                                            text-[10px]
                                            leading-5
                                            text-text-secondary
                                            sm:text-[11px]
                                        "
                                    >
                                        People and organizations behind the
                                        response.
                                    </p>
                                </div>

                                <span
                                    className="
                                        shrink-0
                                        font-poppins
                                        text-[8px]
                                        tracking-widest
                                        text-text-secondary
                                    "
                                >
                                    01 — 03
                                </span>
                            </div>

                            <div className="mt-4 sm:mt-5">
                                {peopleItems.map((item, index) =>
                                    renderItem(item, index),
                                )}
                            </div>
                        </div>

                        {/* =================================================
                            RESPONSE
                        ================================================== */}
                        <div
                            className="
                                border-y
                                border-border
                                bg-background-alt/25
                                px-5
                                py-6
                                sm:px-7
                                sm:py-7
                                lg:px-8
                                lg:py-8
                                xl:px-9
                            "
                        >
                            <div className="flex items-end justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-1.5 w-1.5 shrink-0 bg-accent" />

                                        <span
                                            className="
                                                font-poppins
                                                text-[8px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.15em]
                                                text-accent
                                                sm:text-[9px]
                                            "
                                        >
                                            Response & resources
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            mt-1.5
                                            font-jost
                                            text-[10px]
                                            leading-5
                                            text-text-secondary
                                            sm:text-[11px]
                                        "
                                    >
                                        Campaigns, verification and financial
                                        activity.
                                    </p>
                                </div>

                                <span
                                    className="
                                        shrink-0
                                        font-poppins
                                        text-[8px]
                                        tracking-widest
                                        text-text-secondary
                                    "
                                >
                                    04 — 06
                                </span>
                            </div>

                            <div className="mt-4 sm:mt-5">
                                {responseItems.map((item, index) =>
                                    renderItem(item, index + 3),
                                )}
                            </div>
                        </div>

                        {/* =================================================
                            OVERSIGHT
                        ================================================== */}
                        <div
                            className="
                                px-5
                                py-6
                                sm:px-7
                                sm:py-7
                                lg:px-8
                                lg:py-8
                                xl:px-9
                            "
                        >
                            <div className="flex items-end justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-1.5 w-1.5 shrink-0 bg-text-secondary/40" />

                                        <span
                                            className="
                                                font-poppins
                                                text-[8px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.15em]
                                                text-text-secondary
                                                sm:text-[9px]
                                            "
                                        >
                                            Trust & oversight
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            mt-1.5
                                            font-jost
                                            text-[10px]
                                            leading-5
                                            text-text-secondary
                                            sm:text-[11px]
                                        "
                                    >
                                        Monitor activity, reporting and
                                        configuration.
                                    </p>
                                </div>

                                <span
                                    className="
                                        shrink-0
                                        font-poppins
                                        text-[8px]
                                        tracking-widest
                                        text-text-secondary
                                    "
                                >
                                    07 — 08
                                </span>
                            </div>

                            <div className="mt-4 sm:mt-5">
                                {oversightItems.map((item, index) =>
                                    renderItem(item, index + 6),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdministrationSection;
