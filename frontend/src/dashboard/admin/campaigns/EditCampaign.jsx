import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    CircleDot,
    FileText,
    ImagePlus,
    MapPin,
    Target,
    Wallet,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import CampaignForm from './components/CampaignForm';
import { fetchCampaigns, updateCampaign } from './api/campaignsAPI';

const BASE = '/admin/dashboard/campaigns';

const HIDE_SCROLLBAR =
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

function formatMoney(value) {
    return `৳${Number(value || 0).toLocaleString('en-BD')}`;
}

function formatLabel(value) {
    return String(value || 'Unknown')
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

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 border-b border-[#34404D] py-4 last:border-b-0">
            <Icon
                size={15}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0 text-[#91A0B0]"
            />

            <div className="min-w-0">
                <p className="m-0! text-[11px] text-[#91A0B0]">{label}</p>
                <p className="mt-1 mb-0! wrap-break-word text-[12px] font-medium leading-5 text-[#E0E7EE]">
                    {value || 'Not provided'}
                </p>
            </div>
        </div>
    );
}

function CampaignSummary({ campaign, preview, imageUrl }) {
    const collected = Number(
        campaign.collected_amount ?? campaign.raised_amount ?? 0,
    );

    const target = Number(preview.target_amount ?? campaign.target_amount ?? 0);

    const progress =
        target > 0 ? Math.min(100, Math.max(0, (collected / target) * 100)) : 0;

    const status = String(campaign.status || 'unknown').toLowerCase();
    const isActive = status === 'active';

    return (
        <aside
            className={`min-w-0 border-b border-[#303A47] bg-[#19222D] lg:h-full lg:overflow-y-auto lg:border-r lg:border-b-0 ${HIDE_SCROLLBAR}`}
        >
            <div className="px-5 py-6 sm:px-6 sm:py-7">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#3B4857] bg-[#253242] text-[#C1CDD8]">
                        <FileText size={17} strokeWidth={1.8} />
                    </span>

                    <div className="min-w-0">
                        <p className="m-0! text-[10px] font-semibold uppercase tracking-[0.13em] text-[#91A0B0]">
                            Campaign record
                        </p>
                        <p className="mt-1 mb-0! text-[12px] font-semibold text-[#EEF1F5]">
                            #{campaign.id}
                        </p>
                    </div>
                </div>

                <div className="mt-6 border-t border-[#34404D] pt-6">
                    <div className="aspect-video overflow-hidden border border-[#465363] bg-[#111821]">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={campaign.title || 'Campaign cover'}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#8291A2]">
                                <ImagePlus size={24} strokeWidth={1.5} />
                                <span className="text-[11px]">
                                    No campaign cover
                                </span>
                            </div>
                        )}
                    </div>

                    <h2 className="mt-5 mb-0! wrap-break-word font-sans! text-[17px]! font-semibold! leading-[1.45] text-[#EEF1F5]!">
                        {preview.title ?? campaign.title ?? 'Untitled campaign'}
                    </h2>

                    <p className="mt-2 mb-0! text-[12px] text-[#AAB8C7]">
                        {preview.category ??
                            campaign.category ??
                            'Uncategorized'}
                    </p>

                    <div
                        className={`mt-4 inline-flex items-center gap-2 border px-2.5 py-1.5 ${
                            isActive
                                ? 'border-[#3B4D47] bg-[#203029]'
                                : 'border-[#48505D] bg-[#28303A]'
                        }`}
                    >
                        <CircleDot
                            size={13}
                            className={
                                isActive ? 'text-[#9FC6B2]' : 'text-[#C1C8D1]'
                            }
                        />

                        <span
                            className={`text-[11px] font-medium ${
                                isActive ? 'text-[#B6D2C3]' : 'text-[#D1D7DF]'
                            }`}
                        >
                            {formatLabel(campaign.status)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 border-t border-[#34404D]">
                    <DetailRow
                        icon={MapPin}
                        label="Location"
                        value={preview.location ?? campaign.location}
                    />

                    <DetailRow
                        icon={Wallet}
                        label="Funds collected"
                        value={formatMoney(collected)}
                    />

                    <DetailRow
                        icon={Target}
                        label="Funding target"
                        value={formatMoney(target)}
                    />
                </div>

                <div className="mt-5 border-t border-[#34404D] pt-6">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-[#91A0B0]">
                            Funding progress
                        </span>
                        <span className="text-[12px] font-semibold tabular-nums text-[#DCE5ED]">
                            {progress.toFixed(1)}%
                        </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden bg-[#34404D]">
                        <div
                            className="h-full bg-[#91B5A6] transition-[width] duration-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="mt-4 mb-0! text-[11px] leading-5 text-[#91A0B0]">
                        Campaign status and collected donations cannot be edited
                        here.
                    </p>
                </div>
            </div>
        </aside>
    );
}

export default function EditCampaign() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [preview, setPreview] = useState({});
    const [coverPreview, setCoverPreview] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const detailsPath = `${BASE}/${id}`;

    useEffect(() => {
        let active = true;

        async function loadCampaign() {
            try {
                const response = await fetchCampaigns();

                if (!active) return;

                const campaigns =
                    response?.campaigns ??
                    response?.data?.campaigns ??
                    response?.data ??
                    response;

                const found = Array.isArray(campaigns)
                    ? campaigns.find((item) => String(item.id) === String(id))
                    : null;

                if (!found) {
                    throw new Error('Campaign record not found.');
                }

                setCampaign(found);
            } catch (error) {
                if (active) {
                    setLoadError(error?.message || 'Unable to load campaign.');
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadCampaign();

        return () => {
            active = false;
        };
    }, [id]);

    const handleCoverChange = ({ previewUrl }) => {
        setCoverPreview(previewUrl || '');
    };

    const handleSubmit = async (values) => {
        setSaving(true);
        setSaveError('');

        try {
            await updateCampaign(id, values);
            setSuccess(true);
        } catch (error) {
            setSaveError(error?.message || 'Unable to update campaign.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans">
            <PageHeader
                title="Edit campaign"
                subtitle="Update campaign information without changing its status or donations."
                action={
                    <button
                        type="button"
                        onClick={() => navigate(detailsPath)}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[12px] font-medium text-[#C4CDD8] hover:bg-[#202A35]"
                    >
                        <ArrowLeft size={15} />
                        Back to details
                    </button>
                }
            />

            {loading ? (
                <LoadingUI
                    variant="page"
                    title="Loading campaign..."
                    description="Retrieving campaign information."
                />
            ) : loadError || !campaign ? (
                <LoadingError
                    title="Unable to load campaign"
                    message={loadError || 'Campaign not found.'}
                />
            ) : (
                <div className="grid min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219] lg:h-185 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
                    <CampaignSummary
                        campaign={campaign}
                        preview={preview}
                        imageUrl={
                            coverPreview === null
                                ? getCover(campaign)
                                : coverPreview
                        }
                    />

                    <main className="min-h-0 min-w-0 lg:h-full">
                        <CampaignForm
                            key={campaign.id}
                            mode="edit"
                            campaign={campaign}
                            loading={saving}
                            error={saveError}
                            onValuesChange={setPreview}
                            onCoverChange={handleCoverChange}
                            onSubmit={handleSubmit}
                            onCancel={() => navigate(detailsPath)}
                        />
                    </main>
                </div>
            )}

            <SuccessDialog
                open={success}
                title="Campaign updated"
                message="Campaign information updated successfully."
                onClose={() => {
                    setSuccess(false);
                    navigate(detailsPath, { replace: true });
                }}
            />
        </div>
    );
}
