import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CalendarDays,
    ImagePlus,
    MapPin,
    Megaphone,
    Target,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import CampaignForm from './components/CampaignForm';
import { createCampaign } from './api/campaignsAPI';

const BASE = '/admin/dashboard/campaigns';
const HIDE_SCROLLBAR =
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

function formatMoney(value) {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0
        ? `৳${amount.toLocaleString('en-BD')}`
        : 'Not set';
}

function PreviewRow({ icon: Icon, label, value }) {
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
                    {value || 'Not set'}
                </p>
            </div>
        </div>
    );
}

function CampaignPreview({ values, imageUrl }) {
    const schedule =
        values.duration_type === 'open'
            ? 'Open-ended'
            : values.start_date || values.end_date
              ? `${values.start_date || 'Start not set'} → ${
                    values.end_date || 'End not set'
                }`
              : 'Dates not set';

    return (
        <aside
            className={`min-w-0 border-b border-[#303A47] bg-[#19222D] lg:h-full lg:overflow-y-auto lg:border-r lg:border-b-0 ${HIDE_SCROLLBAR}`}
        >
            <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#3B4857] bg-[#253242] text-[#C1CDD8]">
                        <Megaphone size={17} strokeWidth={1.8} />
                    </span>

                    <div className="min-w-0">
                        <h2 className="m-0! font-sans! text-[14px]! font-semibold! text-[#EEF1F5]!">
                            Campaign preview
                        </h2>
                        <p className="mt-1 mb-0! text-[11px] text-[#91A0B0]">
                            Live information preview
                        </p>
                    </div>
                </div>

                <div className="mt-5 border-t border-[#34404D] pt-5">
                    <div className="aspect-video overflow-hidden border border-[#465363] bg-[#111821]">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Campaign cover preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2.5 text-[#8291A2]">
                                <ImagePlus size={25} strokeWidth={1.5} />
                                <span className="text-[11px]">
                                    Cover preview
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5">
                    <p className="m-0! text-[10px] font-semibold uppercase tracking-[0.13em] text-[#91A0B0]">
                        Global campaign
                    </p>

                    <h3 className="mt-3 mb-0! wrap-break-word font-sans! text-[17px]! font-semibold! leading-[1.45] text-[#EEF1F5]!">
                        {values.title?.trim() || 'Your campaign title'}
                    </h3>

                    <p className="mt-2 mb-0! text-[12px] text-[#AAB8C7]">
                        {values.category || 'Category not selected'}
                    </p>
                </div>

                <div className="mt-5 border-t border-[#34404D]">
                    <PreviewRow
                        icon={MapPin}
                        label="Location"
                        value={values.location}
                    />
                    <PreviewRow
                        icon={Target}
                        label="Funding target"
                        value={formatMoney(values.target_amount)}
                    />
                    <PreviewRow
                        icon={CalendarDays}
                        label="Campaign schedule"
                        value={schedule}
                    />
                </div>
            </div>
        </aside>
    );
}

export default function AddCampaign() {
    const navigate = useNavigate();

    const [preview, setPreview] = useState({});
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const handleCoverChange = ({ previewUrl }) => {
        setImageUrl(previewUrl || '');
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        setError('');

        try {
            await createCampaign({
                type: 'global_situation',
                scope: 'global',
                help_request_id: null,
                ...values,
            });

            setSuccess(true);
            setPreview({});
            setImageUrl('');
            setFormKey((current) => current + 1);
        } catch (err) {
            setError(err?.message || 'Unable to create campaign.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans">
            <PageHeader
                title="Add campaign"
                subtitle="Create a global humanitarian fundraising campaign."
                action={
                    <button
                        type="button"
                        onClick={() => navigate(BASE)}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[12px] font-medium text-[#C4CDD8] hover:bg-[#202A35]"
                    >
                        <ArrowLeft size={15} />
                        All campaigns
                    </button>
                }
            />

            <div className="grid min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219] lg:h-[740px] lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)] 2xl:grid-cols-[370px_minmax(0,1fr)]">
                <CampaignPreview values={preview} imageUrl={imageUrl} />

                <main className="min-h-0 min-w-0 lg:h-full">
                    <CampaignForm
                        key={formKey}
                        mode="add"
                        loading={loading}
                        error={error}
                        onValuesChange={setPreview}
                        onCoverChange={handleCoverChange}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate(BASE)}
                    />
                </main>
            </div>

            <SuccessDialog
                open={success}
                title="Campaign created"
                message="Campaign created successfully."
                onClose={() => {
                    setSuccess(false);
                }}
            />
        </div>
    );
}
