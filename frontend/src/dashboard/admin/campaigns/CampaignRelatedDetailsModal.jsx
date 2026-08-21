import React from 'react';

import {
    X,
    MapPin,
    User,
    Building2,
    FileText,
    Globe2,
    Mail,
    Phone,
} from 'lucide-react';

const getCampaignTypeLabel = (type) => {
    switch (type) {
        case 'local_case':
            return 'Local Case';

        case 'organization_proposed':
            return 'Organization Proposed';

        case 'global_situation':
            return 'Global Situation';

        default:
            return type || 'Campaign';
    }
};

const DetailItem = ({ label, value, icon: Icon }) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                {label}
            </p>

            <div className="mt-1 flex items-start gap-2">
                {Icon && (
                    <Icon
                        size={14}
                        strokeWidth={1.8}
                        className="mt-0.5 shrink-0 text-text-secondary"
                    />
                )}

                <p className="text-sm font-medium leading-6 text-text-primary">
                    {value}
                </p>
            </div>
        </div>
    );
};

const CampaignRelatedDetailsModal = ({ campaign, onClose }) => {
    if (!campaign) {
        return null;
    }

    const type = campaign.type;

    const helpRequest = campaign.help_request || null;

    const organization = campaign.organization || null;

    const requester = helpRequest?.requester || campaign.requester || null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                                {getCampaignTypeLabel(type)}
                            </span>
                        </div>

                        <h2 className="mt-2 text-lg font-bold text-text-primary">
                            {campaign.title || 'Untitled campaign'}
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            Related campaign information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                        aria-label="Close"
                    >
                        <X size={18} strokeWidth={1.8} />
                    </button>
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                    {/* =================================================
                        LOCAL CASE
                    ================================================= */}

                    {type === 'local_case' && (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText size={18} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                            Connected Help Request
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-text-primary">
                                            {helpRequest
                                                ? `Help Request #${helpRequest.id}`
                                                : 'Help request unavailable'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {helpRequest ? (
                                <>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <DetailItem
                                            label="Request ID"
                                            value={`#${helpRequest.id}`}
                                        />

                                        <DetailItem
                                            label="Status"
                                            value={
                                                helpRequest.status
                                                    ? helpRequest.status.replace(
                                                          /_/g,
                                                          ' ',
                                                      )
                                                    : '—'
                                            }
                                        />
                                    </div>

                                    <DetailItem
                                        label="Request Title"
                                        value={
                                            helpRequest.title ||
                                            'Untitled help request'
                                        }
                                        icon={FileText}
                                    />

                                    {helpRequest.description && (
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                                                Description
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                                {helpRequest.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <DetailItem
                                            label="Location"
                                            value={
                                                helpRequest.location ||
                                                helpRequest.district ||
                                                campaign.location ||
                                                campaign.district ||
                                                '—'
                                            }
                                            icon={MapPin}
                                        />

                                        <DetailItem
                                            label="Category"
                                            value={
                                                helpRequest.category ||
                                                campaign.category ||
                                                '—'
                                            }
                                        />
                                    </div>

                                    {/* =================================================
                                        REQUESTER
                                    ================================================= */}

                                    <div className="rounded-xl border border-border bg-background-alt/40 p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-text-secondary shadow-sm">
                                                <User
                                                    size={17}
                                                    strokeWidth={1.8}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                                    Requester
                                                </p>

                                                <p className="mt-0.5 text-sm font-bold text-text-primary">
                                                    {requester?.name ||
                                                        'Requester information unavailable'}
                                                </p>
                                            </div>
                                        </div>

                                        {requester && (
                                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <DetailItem
                                                    label="Email"
                                                    value={requester.email}
                                                    icon={Mail}
                                                />

                                                <DetailItem
                                                    label="Phone"
                                                    value={requester.phone}
                                                    icon={Phone}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* =================================================
                                        ASSIGNED ORGANIZATION
                                    ================================================= */}

                                    {(helpRequest.organization ||
                                        organization) && (
                                        <div className="rounded-xl border border-border bg-white p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                                                    <Building2
                                                        size={17}
                                                        strokeWidth={1.8}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                                                        Assigned Organization
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-bold text-text-primary">
                                                        {
                                                            (
                                                                helpRequest.organization ||
                                                                organization
                                                            ).name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="rounded-xl border border-border bg-background-alt/40 px-5 py-8 text-center">
                                    <FileText
                                        size={22}
                                        className="mx-auto text-text-secondary"
                                    />

                                    <p className="mt-3 text-sm font-semibold text-text-primary">
                                        Help request information unavailable
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                        The campaign is identified as a local
                                        case, but the connected help request was
                                        not included in the campaign response.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* =================================================
                        ORGANIZATION PROPOSED
                    ================================================= */}

                    {type === 'organization_proposed' && (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Building2
                                            size={18}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                            Connected Organization
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-text-primary">
                                            {organization?.name ||
                                                'Organization information unavailable'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {organization ? (
                                <>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <DetailItem
                                            label="Organization ID"
                                            value={`#${organization.id}`}
                                        />

                                        <DetailItem
                                            label="Status"
                                            value={
                                                organization.status
                                                    ? organization.status.replace(
                                                          /_/g,
                                                          ' ',
                                                      )
                                                    : '—'
                                            }
                                        />
                                    </div>

                                    <DetailItem
                                        label="Organization Name"
                                        value={organization.name}
                                        icon={Building2}
                                    />

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <DetailItem
                                            label="Email"
                                            value={organization.email}
                                            icon={Mail}
                                        />

                                        <DetailItem
                                            label="Phone"
                                            value={organization.phone}
                                            icon={Phone}
                                        />
                                    </div>

                                    <DetailItem
                                        label="Address"
                                        value={
                                            organization.address ||
                                            organization.location
                                        }
                                        icon={MapPin}
                                    />
                                </>
                            ) : (
                                <div className="rounded-xl border border-border bg-background-alt/40 px-5 py-8 text-center">
                                    <Building2
                                        size={22}
                                        className="mx-auto text-text-secondary"
                                    />

                                    <p className="mt-3 text-sm font-semibold text-text-primary">
                                        Organization information unavailable
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                        The campaign is identified as
                                        organization proposed, but the connected
                                        organization was not included in the
                                        campaign response.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* =================================================
                        GLOBAL SITUATION
                    ================================================= */}

                    {type === 'global_situation' && (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Globe2 size={18} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                            SP Managed Campaign
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-text-primary">
                                            Global Situation
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <DetailItem
                                    label="Campaign ID"
                                    value={`#${campaign.id}`}
                                />

                                <DetailItem
                                    label="Created By"
                                    value={
                                        campaign.creator?.name ||
                                        campaign.created_by_name ||
                                        'SP Admin'
                                    }
                                    icon={User}
                                />
                            </div>

                            <DetailItem
                                label="Situation"
                                value={
                                    campaign.title ||
                                    'Global situation campaign'
                                }
                                icon={Globe2}
                            />

                            <DetailItem
                                label="Location / Scope"
                                value={
                                    campaign.scope ||
                                    campaign.location ||
                                    campaign.district ||
                                    'Global'
                                }
                                icon={MapPin}
                            />

                            {campaign.description && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                                        Description
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        {campaign.description}
                                    </p>
                                </div>
                            )}

                            <div className="rounded-xl border border-border bg-background-alt/40 p-5">
                                <p className="text-xs font-semibold text-text-primary">
                                    Campaign ownership
                                </p>

                                <p className="mt-1 text-xs leading-5 text-text-secondary">
                                    This campaign is created and managed
                                    directly by Stand For People. Organizations
                                    may participate in the response, but they
                                    are not the campaign's originating entity.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        UNKNOWN TYPE
                    ================================================= */}

                    {![
                        'local_case',
                        'organization_proposed',
                        'global_situation',
                    ].includes(type) && (
                        <div className="rounded-xl border border-border bg-background-alt/40 px-5 py-8 text-center">
                            <p className="text-sm font-semibold text-text-primary">
                                Campaign type information
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                                No related information is available for this
                                campaign type.
                            </p>
                        </div>
                    )}
                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="flex justify-end border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 items-center rounded-lg border border-border bg-white px-4 text-sm font-semibold text-text-primary transition-colors hover:border-primary/30 hover:bg-background-alt"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignRelatedDetailsModal;
