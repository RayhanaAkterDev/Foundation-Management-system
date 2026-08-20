import React, { useState } from 'react';
import { X } from 'lucide-react';

const CampaignEditModal = ({
    campaign,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const [title, setTitle] = useState(campaign?.title || '');
    const [description, setDescription] = useState(campaign?.description || '');
    const [category, setCategory] = useState(campaign?.category || '');
    const [location, setLocation] = useState(campaign?.location || '');
    const [district, setDistrict] = useState(campaign?.district || '');
    const [targetAmount, setTargetAmount] = useState(
        campaign?.target_amount ?? '',
    );
    const [startDate, setStartDate] = useState(
        campaign?.start_date ? String(campaign.start_date).slice(0, 10) : '',
    );
    const [endDate, setEndDate] = useState(
        campaign?.end_date ? String(campaign.end_date).slice(0, 10) : '',
    );
    const [affectedAreas, setAffectedAreas] = useState(
        campaign?.affected_areas || '',
    );

    const handleSubmit = (event) => {
        event.preventDefault();

        onConfirm({
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            location: location.trim(),
            district: district.trim(),
            target_amount: targetAmount,
            start_date: startDate || null,
            end_date: endDate || null,
            affected_areas: affectedAreas.trim(),
        });
    };

    if (!campaign) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
            <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Campaign management
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-text-primary">
                            Edit Campaign
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Update campaign information without changing its
                            lifecycle status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
                        {/* Campaign name */}
                        <div>
                            <label
                                htmlFor="campaign-title"
                                className="mb-2 block text-xs font-semibold text-text-secondary"
                            >
                                Campaign Name
                            </label>

                            <input
                                id="campaign-title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                disabled={loading}
                                required
                                className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="campaign-description"
                                className="mb-2 block text-xs font-semibold text-text-secondary"
                            >
                                Description
                            </label>

                            <textarea
                                id="campaign-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                disabled={loading}
                                required
                                rows={4}
                                className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                            />
                        </div>

                        {/* Category + Location */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="campaign-category"
                                    className="mb-2 block text-xs font-semibold text-text-secondary"
                                >
                                    Category
                                </label>

                                <input
                                    id="campaign-category"
                                    type="text"
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                    disabled={loading}
                                    className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-location"
                                    className="mb-2 block text-xs font-semibold text-text-secondary"
                                >
                                    Location
                                </label>

                                <input
                                    id="campaign-location"
                                    type="text"
                                    value={location}
                                    onChange={(event) =>
                                        setLocation(event.target.value)
                                    }
                                    disabled={loading}
                                    className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                                />
                            </div>
                        </div>

                        {/* District + Affected Areas */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="campaign-district"
                                    className="mb-2 block text-xs font-semibold text-text-secondary"
                                >
                                    District
                                </label>

                                <input
                                    id="campaign-district"
                                    type="text"
                                    value={district}
                                    onChange={(event) =>
                                        setDistrict(event.target.value)
                                    }
                                    disabled={loading}
                                    className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-affected-areas"
                                    className="mb-2 block text-xs font-semibold text-text-secondary"
                                >
                                    Affected Areas
                                </label>

                                <input
                                    id="campaign-affected-areas"
                                    type="text"
                                    value={affectedAreas}
                                    onChange={(event) =>
                                        setAffectedAreas(event.target.value)
                                    }
                                    disabled={loading}
                                    className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                                />
                            </div>
                        </div>

                        {/* Target amount */}
                        <div>
                            <label
                                htmlFor="campaign-target"
                                className="mb-2 block text-xs font-semibold text-text-secondary"
                            >
                                Target Amount
                            </label>

                            <input
                                id="campaign-target"
                                type="number"
                                min="0"
                                step="0.01"
                                value={targetAmount}
                                onChange={(event) =>
                                    setTargetAmount(event.target.value)
                                }
                                disabled={loading}
                                className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="campaign-start-date"
                                    className="mb-2 block text-xs font-semibold text-text-secondary"
                                >
                                    Start Date
                                </label>

                                <input
                                    id="campaign-start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(event) =>
                                        setStartDate(event.target.value)
                                    }
                                    disabled={loading}
                                    className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-end-date"
                                    className="mb-2 block text-xs font-semibold text-text-secondary"
                                >
                                    End Date
                                </label>

                                <input
                                    id="campaign-end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
                                    disabled={loading}
                                    className="h-11 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-border bg-background-alt px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignEditModal;
