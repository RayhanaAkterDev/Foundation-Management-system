import {
    X,
    Mail,
    Calendar,
    Building2,
    Globe,
    Phone,
    MapPin,
    Users,
    Target,
    Tags,
    HeartHandshake,
    ShieldCheck,
    ArrowUpRight,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const OrganizationViewModal = ({ organization, loading, error, onClose }) => {
    if (!loading && !organization && !error) {
        return null;
    }

    const email =
        organization?.user?.email || organization?.email || 'Not provided';

    const formatType = (value) => {
        if (!value) {
            return 'Not provided';
        }

        return value
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatList = (value) => {
        if (!value) {
            return 'Not provided';
        }

        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'Not provided';
        }

        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);

                if (Array.isArray(parsed)) {
                    return parsed.length > 0
                        ? parsed.join(', ')
                        : 'Not provided';
                }
            } catch {
                // Keep normal string values unchanged.
            }
        }

        return value;
    };

    const getListItems = (value) => {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            } catch {
                // Continue with string handling.
            }

            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-6">
            <div className="relative flex max-h-[94vh] w-full max-w-280 overflow-hidden rounded-[30px] bg-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)]">
                {/* =========================================================
                    LOADING / ERROR
                ========================================================== */}

                {!organization && (
                    <div className="flex min-h-140 w-full flex-col">
                        <div className="flex justify-end p-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary transition hover:bg-background-alt hover:text-text-primary"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {loading && (
                            <div className="flex flex-1 flex-col items-center justify-center">
                                <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />

                                <p className="mt-4 text-sm font-medium text-text-primary">
                                    Loading organization
                                </p>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Please wait a moment.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="flex flex-1 items-center justify-center px-6">
                                <div className="max-w-md border-l-2 border-red-500 bg-red-50 px-5 py-4">
                                    <p className="text-sm font-medium text-red-700">
                                        Unable to load organization
                                    </p>

                                    <p className="mt-1 text-sm text-red-600">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* =========================================================
                    ORGANIZATION
                ========================================================== */}

                {organization && !loading && (
                    <div className="flex min-h-0 w-full flex-col">
                        {/* =================================================
                            HERO
                        ================================================== */}

                        <div className="relative shrink-0 overflow-hidden bg-primary text-white">
                            {/* Decorative composition */}
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute -right-24 -top-48 h-h-130 w-h-130 rounded-full border-90 border-white/[0.035]" />

                                <div className="absolute -bottom-95 left-[48%] h-h-130 w-h-130 rounded-full border-70 border-spacing-0.5-white/[0.025]" />

                                <div className="absolute right-[18%] top-[28%] h-2 w-2 rounded-full bg-white/15" />

                                <div className="absolute right-[20%] top-[40%] h-1 w-1 rounded-full bg-white/20" />
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition hover:bg-white/10 hover:text-white"
                                aria-label="Close"
                            >
                                <X size={19} />
                            </button>

                            <div className="relative px-7 pb-0 pt-7 sm:px-10 sm:pt-9">
                                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
                                    {/* Identity */}

                                    <div className="flex min-w-0 items-center gap-5">
                                        <div className="relative flex h-h-20.5 w-h-20.5 shrink-0 items-center justify-center rounded-3xl bg-white text-primary shadow-[0_15px_35px_-12px_rgba(0,0,0,0.4)]">
                                            <Building2
                                                size={37}
                                                strokeWidth={1.35}
                                            />

                                            <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-4 border-primary bg-white text-primary">
                                                <ShieldCheck
                                                    size={12}
                                                    strokeWidth={2.2}
                                                />
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                                                    Organization profile
                                                </span>

                                                <span className="h-1 w-1 rounded-full bg-white/25" />

                                                <span className="text-[10px] text-white/40">
                                                    {formatType(
                                                        organization.organization_type,
                                                    )}
                                                </span>
                                            </div>

                                            <h2 className="mt-2 wrap-break-word text-[30px] font-semibold leading-none tracking-[-0.04em] sm:text-[34px]">
                                                {organization.name}
                                            </h2>

                                            <div className="mt-3 flex min-w-0 items-center gap-2 text-[13px] text-white/55">
                                                <Mail
                                                    size={14}
                                                    strokeWidth={1.6}
                                                    className="shrink-0"
                                                />

                                                <span className="break-all">
                                                    {email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}

                                    <div className="flex shrink-0 flex-wrap gap-2 lg:pt-2">
                                        <StatusBlock
                                            label="Verification"
                                            status={
                                                organization.verification_status
                                            }
                                        />

                                        <StatusBlock
                                            label="Account"
                                            status={
                                                organization.user?.status ||
                                                organization.status ||
                                                'active'
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Header bottom */}

                                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-4">
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                        <HeaderMeta
                                            icon={Calendar}
                                            label="Member since"
                                            value={
                                                organization.created_at
                                                    ? new Date(
                                                          organization.created_at,
                                                      ).toLocaleDateString()
                                                    : 'Not provided'
                                            }
                                        />

                                        <span className="hidden h-3 w-px bg-white/10 sm:block" />

                                        <HeaderMeta
                                            icon={Building2}
                                            label="Registration"
                                            value={
                                                organization.registration_number ||
                                                'Not provided'
                                            }
                                        />
                                    </div>

                                    <span className="hidden text-[9px] font-medium uppercase tracking-[0.16em] text-white/25 lg:block">
                                        Organization
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            BODY
                        ================================================== */}

                        <main className="min-h-0 flex-1 overflow-y-auto">
                            <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
                                {/* =================================================
                                    MAIN COLUMN
                                ================================================== */}

                                <div className="min-w-0 px-7 py-8 sm:px-10 sm:py-9">
                                    {/* OVERVIEW */}

                                    <section>
                                        <SectionLabel
                                            number="01"
                                            title="At a glance"
                                        />

                                        <div className="mt-5 grid grid-cols-2 gap-y-7 sm:grid-cols-4">
                                            <Fact
                                                label="Organization type"
                                                value={formatType(
                                                    organization.organization_type,
                                                )}
                                            />

                                            <Fact
                                                label="Registration"
                                                value={
                                                    organization.registration_number ||
                                                    'Not provided'
                                                }
                                            />

                                            <Fact
                                                label="Team size"
                                                value={
                                                    organization.team_size !==
                                                        null &&
                                                    organization.team_size !==
                                                        undefined
                                                        ? organization.team_size
                                                        : '—'
                                                }
                                            />

                                            <Fact
                                                label="Account role"
                                                value="Organization"
                                            />
                                        </div>
                                    </section>

                                    {/* MISSION */}

                                    <section className="mt-12">
                                        <SectionLabel
                                            number="02"
                                            title="Mission"
                                        />

                                        <div className="relative mt-6 overflow-hidden bg-background-alt px-6 py-7 sm:px-8 sm:py-8">
                                            <div className="absolute left-0 top-0 h-full w-1 bg-primary" />

                                            <div className="absolute -bottom-20 -right-16 h-48 w-48 rounded-full border-30 border-primary/[0.035]" />

                                            <div className="relative">
                                                <span className="text-[54px] font-serif leading-none text-primary/20">
                                                    “
                                                </span>

                                                <p className="-mt-5 max-w-3xl text-[21px] font-medium leading-[1.65] tracking-[-0.02em] text-text-primary sm:text-[23px]">
                                                    {organization.mission ||
                                                        'No mission statement provided.'}
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* WORK */}

                                    <section className="mt-12">
                                        <SectionLabel
                                            number="03"
                                            title="Work & impact"
                                        />

                                        <div className="mt-5">
                                            <ImpactItem
                                                icon={Tags}
                                                label="Focus areas"
                                                items={getListItems(
                                                    organization.focus_areas,
                                                )}
                                                fallback={formatList(
                                                    organization.focus_areas,
                                                )}
                                            />

                                            <ImpactItem
                                                icon={Users}
                                                label="Communities served"
                                                items={getListItems(
                                                    organization.communities_served,
                                                )}
                                                fallback={formatList(
                                                    organization.communities_served,
                                                )}
                                            />

                                            <ImpactItem
                                                icon={HeartHandshake}
                                                label="Primary activities"
                                                items={getListItems(
                                                    organization.primary_activities,
                                                )}
                                                fallback={formatList(
                                                    organization.primary_activities,
                                                )}
                                            />
                                        </div>
                                    </section>
                                </div>

                                {/* =================================================
                                    CONTACT SIDEBAR
                                ================================================== */}

                                <aside className="border-t border-border bg-[#fafafa] px-7 py-8 lg:border-l lg:border-t-0 sm:px-10 lg:px-7">
                                    <SectionLabel number="04" title="Contact" />

                                    <div className="mt-7 space-y-7">
                                        <ContactItem
                                            icon={Mail}
                                            label="Email"
                                            value={email}
                                        />

                                        <ContactItem
                                            icon={Phone}
                                            label="Phone"
                                            value={
                                                organization.phone ||
                                                'Not provided'
                                            }
                                        />

                                        <ContactItem
                                            icon={Globe}
                                            label="Website"
                                            value={
                                                organization.website ||
                                                'Not provided'
                                            }
                                            website
                                        />

                                        <ContactItem
                                            icon={MapPin}
                                            label="Address"
                                            value={
                                                organization.address ||
                                                'Not provided'
                                            }
                                        />
                                    </div>

                                    {/* Sidebar divider */}

                                    <div className="my-8 border-t border-border" />

                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                            Account timeline
                                        </p>

                                        <div className="mt-4 flex items-start gap-3">
                                            <div className="relative flex flex-col items-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Calendar
                                                        size={14}
                                                        strokeWidth={1.7}
                                                    />
                                                </div>

                                                <div className="absolute top-8 h-7 w-px bg-border" />
                                            </div>

                                            <div className="pt-0.5">
                                                <p className="text-xs font-semibold text-text-primary">
                                                    Organization registered
                                                </p>

                                                <p className="mt-1 text-[11px] leading-5 text-text-secondary">
                                                    {organization.created_at
                                                        ? new Date(
                                                              organization.created_at,
                                                          ).toLocaleDateString()
                                                        : 'Unknown date'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trust */}

                                    <div className="mt-8 flex items-start gap-2.5 border-t border-border pt-5">
                                        <ShieldCheck
                                            size={15}
                                            strokeWidth={1.7}
                                            className="mt-0.5 shrink-0 text-text-secondary"
                                        />

                                        <p className="text-[10px] leading-5 text-text-secondary">
                                            Organization information is provided
                                            by the registered account.
                                        </p>
                                    </div>
                                </aside>
                            </div>
                        </main>

                        {/* =================================================
                            FOOTER
                        ================================================== */}

                        <footer className="flex shrink-0 items-center justify-between border-t border-border bg-white px-7 py-4 sm:px-10">
                            <span className="hidden text-[10px] font-medium uppercase tracking-[0.12em] text-text-secondary sm:block">
                                Organization details
                            </span>

                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md"
                            >
                                Done
                            </button>
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
};

/* =============================================================
   STATUS BLOCK
============================================================= */

const StatusBlock = ({ label, status }) => {
    return (
        <div className="min-w-30 rounded-xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5">
            <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white/35">
                {label}
            </p>

            <StatusBadge status={status} />
        </div>
    );
};

/* =============================================================
   HEADER META
============================================================= */

const HeaderMeta = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-center gap-2">
            <Icon size={13} strokeWidth={1.7} className="text-white/30" />

            <span className="text-[10px] text-white/35">{label}</span>

            <span className="text-[11px] font-medium text-white/60">
                {value}
            </span>
        </div>
    );
};

/* =============================================================
   SECTION LABEL
============================================================= */

const SectionLabel = ({ number, title }) => {
    return (
        <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-primary/60">
                {number}
            </span>

            <span className="h-px w-5 bg-primary/30" />

            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                {title}
            </h3>
        </div>
    );
};

/* =============================================================
   FACT
============================================================= */

const Fact = ({ label, value }) => {
    return (
        <div className="min-w-0 pr-5">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-text-secondary">
                {label}
            </p>

            <p
                className="mt-2 truncate text-[14px] font-semibold tracking-[-0.015em] text-text-primary"
                title={value}
            >
                {value}
            </p>
        </div>
    );
};

/* =============================================================
   CONTACT ITEM
============================================================= */

const ContactItem = ({ icon: Icon, label, value, website }) => {
    const isProvided = value !== 'Not provided';

    return (
        <div className="group">
            <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-border transition-colors group-hover:text-primary">
                    <Icon size={15} strokeWidth={1.6} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">
                        {label}
                    </p>

                    <div className="mt-1 flex items-start gap-1.5">
                        <p className="wrap-break-word text-[12px] leading-5 text-text-primary">
                            {value}
                        </p>

                        {website && isProvided && (
                            <ArrowUpRight
                                size={12}
                                className="mt-0.5 shrink-0 text-primary"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* =============================================================
   IMPACT ITEM
============================================================= */

const ImpactItem = ({ icon: Icon, label, items, fallback }) => {
    return (
        <div className="group grid gap-4 border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[200px_1fr] sm:gap-8">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background-alt text-text-secondary transition-colors group-hover:text-primary">
                    <Icon size={16} strokeWidth={1.7} />
                </div>

                <span className="text-xs font-semibold text-text-secondary">
                    {label}
                </span>
            </div>

            {items.length > 0 ? (
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    {items.map((item, index) => (
                        <span
                            key={`${item}-${index}`}
                            className="text-[13px] leading-6 text-text-primary"
                        >
                            {index > 0 && (
                                <span className="mr-2.5 text-primary/30">
                                    /
                                </span>
                            )}

                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-[13px] leading-6 text-text-secondary">
                    {fallback}
                </p>
            )}
        </div>
    );
};

export default OrganizationViewModal;
