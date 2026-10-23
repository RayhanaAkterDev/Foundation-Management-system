import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    CalendarDays,
    ImagePlus,
    MapPin,
    Target,
    Wallet,
    FileText,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import CampaignForm from './components/CampaignForm';

const BASE = '/organization/dashboard/campaigns';

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const HIDE_SCROLLBAR =
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

function getToken() {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
}

function formatMoney(value) {
    const amount = Number(value);

    return `৳${(Number.isFinite(amount) ? amount : 0).toLocaleString('en-BD')}`;
}

function formatDate(value) {
    if (!value) return 'Not set';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatType(value) {
    return String(value || 'global_situation')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getCover(campaign) {
    const image =
        campaign?.cover_image_url ||
        campaign?.cover_image ||
        campaign?.image_url ||
        campaign?.image ||
        '';

    return typeof image === 'string' ? image : '';
}

async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    const text = await response.text();

    return text ? { message: text } : {};
}

async function fetchOrganizationCampaigns(signal) {
    const token = getToken();

    if (!token) {
        throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/organization/campaigns`, {
        method: 'GET',
        signal,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
        throw new Error(
            data?.message || 'Unable to load organization campaigns.',
        );
    }

    const campaigns =
        data?.campaigns ?? data?.data?.campaigns ?? data?.data ?? [];

    return Array.isArray(campaigns) ? campaigns : [];
}

function createFormData(values) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
        if (key === 'cover_image') {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value === null) {
                formData.append('remove_cover_image', '1');
            }

            return;
        }

        if (value === undefined) return;

        formData.append(
            key,
            value === null
                ? ''
                : typeof value === 'boolean'
                  ? value
                      ? '1'
                      : '0'
                  : String(value),
        );
    });

    formData.append('_method', 'PUT');

    return formData;
}

async function updateOrganizationCampaign(id, values) {
    const token = getToken();

    if (!token) {
        throw new Error('Authentication token not found.');
    }

    const response = await fetch(
        `${API_BASE_URL}/organization/campaigns/${encodeURIComponent(id)}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: createFormData(values),
        },
    );

    const data = await parseResponse(response);

    if (!response.ok) {
        if (response.status === 403) {
            throw new Error(
                'You do not have permission to edit this campaign.',
            );
        }

        if (response.status === 422 && data?.errors) {
            const firstError = Object.values(data.errors).flat().find(Boolean);

            if (firstError) {
                throw new Error(String(firstError));
            }
        }

        throw new Error(data?.message || 'Unable to update the campaign.');
    }

    return data;
}

function PreviewRow({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start gap-3 border-t border-[#354252] py-4">
            <Icon
                size={15}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0 text-[#91A3B6]"
            />

            <div className="min-w-0 flex-1">
                <p className="m-0! text-[11px] text-[#91A0B1]">{label}</p>

                <div className="mt-1.5 wrap-break-word text-[12px] font-medium leading-5 text-[#DDE5ED]">
                    {children}
                </div>
            </div>
        </div>
    );
}

function CampaignPreview({ campaign, values, cover }) {
    const title = values?.title ?? campaign.title;
    const category = values?.category ?? campaign.category;
    const location = values?.location ?? campaign.location;

    const target = values?.target_amount ?? campaign.target_amount;

    const startDate = values?.start_date ?? campaign.start_date;

    const endDate = values?.end_date ?? campaign.end_date;

    const durationType =
        values?.duration_type ?? (campaign.end_date ? 'fixed' : 'open');

    const image = cover?.file
        ? cover.previewUrl
        : cover?.removed
          ? ''
          : getCover(campaign);

    const status = String(campaign.status || 'unverified').toLowerCase();

    const raised =
        campaign.collected_amount ??
        campaign.raised_amount ??
        campaign.amount_raised ??
        0;

    const statusClass =
        status === 'active'
            ? 'border-[#385648] bg-[#20362C] text-[#AACBBB]'
            : status === 'rejected'
              ? 'border-[#71464C] bg-[#35262A] text-[#E1B6BB]'
              : 'border-[#5D5645] bg-[#332F26] text-[#D7C9A7]';

    return (
        <aside className="flex min-h-0 min-w-0 flex-col border-b border-[#303A47] bg-[#19232E] lg:border-r lg:border-b-0">
            <div
                className={`min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6 ${HIDE_SCROLLBAR}`}
            >
                <div className="flex items-center gap-3 border-b border-[#354252] pb-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#3A495B] bg-[#263444] text-[#BDCAD7]">
                        <FileText size={17} strokeWidth={1.7} />
                    </span>

                    <div className="min-w-0">
                        <h2 className="m-0! font-sans! text-[14px]! font-semibold! text-[#EEF1F5]!">
                            Campaign preview
                        </h2>

                        <p className="mt-1 mb-0! text-[11px] text-[#93A4B7]">
                            Campaign #{campaign.id} · Live information preview
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex aspect-[16/9] items-center justify-center overflow-hidden border border-[#405063] bg-[#111923]">
                    {image ? (
                        <img
                            src={image}
                            alt="Campaign cover preview"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-[#8294A7]">
                            <ImagePlus size={24} strokeWidth={1.5} />

                            <span className="text-[11px]">Cover preview</span>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <p className="m-0! text-[10px] font-semibold tracking-[0.13em] text-[#93A4B7]">
                        {formatType(campaign.type).toUpperCase()} CAMPAIGN
                    </p>

                    <h3 className="mt-3 mb-0! wrap-break-word font-sans! text-[17px]! font-semibold! leading-[1.45] text-[#EEF1F5]!">
                        {title || 'Untitled campaign'}
                    </h3>

                    <p className="mt-1 mb-0! text-[12px] text-[#BCC8D5]">
                        {category || 'Uncategorized'}
                    </p>

                    <div className="mt-5">
                        <span
                            className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-medium ${statusClass}`}
                        >
                            <span className="size-1.5 rounded-full bg-current" />

                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="mt-5">
                    <PreviewRow icon={MapPin} label="Location">
                        {location || 'Not specified'}
                    </PreviewRow>

                    <PreviewRow icon={Target} label="Funding target">
                        {formatMoney(target)}
                    </PreviewRow>

                    <PreviewRow icon={CalendarDays} label="Campaign schedule">
                        {formatDate(startDate)}
                        {' → '}
                        {durationType === 'open'
                            ? 'Open-ended'
                            : formatDate(endDate)}
                    </PreviewRow>

                    <PreviewRow icon={Wallet} label="Funds collected">
                        {formatMoney(raised)}
                    </PreviewRow>
                </div>
            </div>
        </aside>
    );
}

export default function CampaignEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loadState, setLoadState] = useState({
        loading: true,
        error: '',
        campaign: null,
    });

    const [retryKey, setRetryKey] = useState(0);

    const [formValues, setFormValues] = useState(null);
    const [coverState, setCoverState] = useState(null);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        fetchOrganizationCampaigns(controller.signal)
            .then((campaigns) => {
                if (!active) return;

                const campaign = campaigns.find(
                    (item) => String(item.id) === String(id),
                );

                setLoadState({
                    loading: false,
                    error: campaign
                        ? ''
                        : 'This campaign was not found in your organization campaign list.',
                    campaign: campaign || null,
                });
            })
            .catch((error) => {
                if (!active || controller.signal.aborted) return;

                setLoadState({
                    loading: false,
                    error:
                        error?.message ||
                        'Unable to load campaign information.',
                    campaign: null,
                });
            });

        return () => {
            active = false;
            controller.abort();
        };
    }, [id, retryKey]);

    const handleBack = () => {
        navigate(`${BASE}/${id}`);
    };

    const handleRetry = () => {
        setLoadState({
            loading: true,
            error: '',
            campaign: null,
        });

        setRetryKey((current) => current + 1);
    };

    const handleSubmit = async (values) => {
        if (saving) return;

        setSaving(true);
        setSaveError('');

        try {
            await updateOrganizationCampaign(id, values);
            setSuccessOpen(true);
        } catch (error) {
            setSaveError(error?.message || 'Unable to save campaign changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccessOpen(false);

        navigate(`${BASE}/${id}`, {
            replace: true,
        });
    };

    const header = (
        <PageHeader
            title="Edit campaign"
            subtitle="Update campaign information without changing its status or donations."
            action={
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex min-h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[12px] font-medium text-[#C4CDD8] transition-colors hover:bg-[#202A35]"
                >
                    <ArrowLeft size={15} />
                    Back to details
                </button>
            }
        />
    );

    if (loadState.loading) {
        return (
            <div className="min-w-0 space-y-7 pb-10">
                {header}

                <LoadingUI
                    variant="page"
                    title="Loading campaign..."
                    description="Preparing campaign information for editing."
                />
            </div>
        );
    }

    if (loadState.error || !loadState.campaign) {
        return (
            <div className="min-w-0 space-y-7 pb-10">
                {header}

                <LoadingError
                    title="Unable to load campaign"
                    message={
                        loadState.error ||
                        'Campaign information is unavailable.'
                    }
                    onRetry={handleRetry}
                />
            </div>
        );
    }

    const campaign = loadState.campaign;

    return (
        <div className="min-w-0 space-y-7 pb-10 font-sans">
            {header}

            <div className="min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219] lg:grid lg:h-[680px] lg:grid-cols-[300px_minmax(0,1fr)] xl:h-[700px] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
                <CampaignPreview
                    campaign={campaign}
                    values={formValues}
                    cover={coverState}
                />

                <div className="min-h-0 min-w-0 bg-[#0E1219]">
                    <CampaignForm
                        key={campaign.id}
                        mode="edit"
                        campaign={campaign}
                        loading={saving}
                        error={saveError}
                        onSubmit={handleSubmit}
                        onCancel={handleBack}
                        onValuesChange={setFormValues}
                        onCoverChange={setCoverState}
                    />
                </div>
            </div>

            <SuccessDialog
                open={successOpen}
                isOpen={successOpen}
                title="Campaign updated"
                message="Your campaign changes have been saved successfully."
                onClose={handleSuccessClose}
                onConfirm={handleSuccessClose}
            />
        </div>
    );
}
