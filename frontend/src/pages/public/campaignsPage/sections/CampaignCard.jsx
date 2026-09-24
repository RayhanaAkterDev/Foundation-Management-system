import { Link } from 'react-router-dom';
import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

export default function CampaignCard({ campaign }) {
    const imageUrl = campaign.image || campaign.cover_image || defaultCampaignImage;
    const raisedAmount = Number(campaign.raised ?? campaign.collected_amount ?? 0);
    const progressPercent = Number(campaign.progress ?? 0);
    const supporterCount = Number(campaign.supporters ?? 0);
    const descriptionText = campaign.shortDescription || campaign.description || '';

    return (
        <Link to={`/campaign/${campaign.id}`} className="group block">
            <article className="relative overflow-hidden rounded-3xl">
                {/* Image */}
                <img
                    src={imageUrl}
                    alt={campaign.title || 'Campaign'}
                    className="h-95 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultCampaignImage;
                    }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/55 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/25" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    {/* Category & Days Left badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {campaign.category && (
                            <span className="inline-flex items-center rounded-full px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white uppercase tracking-wider">
                                {campaign.category}
                            </span>
                        )}

                        {campaign.daysLeft != null && (
                            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10">
                                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-xs font-medium text-white/90">
                                    {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Ending today'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white leading-snug tracking-tight line-clamp-2">
                        {campaign.title}
                    </h3>

                    {/* Description */}
                    {descriptionText && (
                        <p className="text-sm leading-relaxed text-white/80 line-clamp-2">
                            {descriptionText}
                        </p>
                    )}

                    {/* Location if available */}
                    {(campaign.location || campaign.district) && (
                        <p className="text-xs text-white/60">
                            📍 {campaign.location || campaign.district}
                        </p>
                    )}

                    {/* Progress */}
                    <div className="rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md p-4 space-y-3">
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-xl font-semibold text-white">
                                    ৳{raisedAmount.toLocaleString()}
                                </div>
                                <div className="text-xs text-white/60">
                                    raised so far
                                </div>
                            </div>

                            <div className="text-base font-semibold text-white/90">
                                {progressPercent}%
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
                                style={{
                                    width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                                }}
                            />
                        </div>

                        <div className="text-xs text-white/65">
                            Backed by {supporterCount} donors
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
