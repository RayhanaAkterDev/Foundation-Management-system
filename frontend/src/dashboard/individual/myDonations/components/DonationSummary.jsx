import { CircleDollarSign, HandCoins, CalendarDays } from 'lucide-react';

const money = (value) => `৳${Number(value || 0).toLocaleString('en-BD')}`;

export default function DonationSummary({ summary }) {
    const stats = [
        {
            label: 'Total donation amount',
            value: money(summary.totalDonated),
            icon: CircleDollarSign,
            note: 'Funds contributed through donations',
            featured: true,
        },
        {
            label: 'Total donations',
            value: Number(summary.donationCount || 0).toLocaleString('en-BD'),
            icon: HandCoins,
            note: 'Donation records made',
        },
        {
            label: 'Last donation',
            value: summary.lastDonation || '—',
            icon: CalendarDays,
            note: 'Most recent contribution',
            date: true,
        },
    ];

    return (
        <section className="grid grid-cols-1 overflow-hidden border border-[#29333F] bg-[#10161F] md:grid-cols-3">
            {stats.map(
                ({ label, value, icon: Icon, note, featured, date }, index) => (
                    <div
                        key={label}
                        className={`min-w-0 px-5 py-6 sm:px-7 sm:py-7 ${
                            index !== 2
                                ? 'border-b border-[#29333F] md:border-r md:border-b-0'
                                : ''
                        } ${featured ? 'bg-[#151F29]' : ''}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-[12px] font-medium text-[#98A5B5]">
                                {label}
                            </p>

                            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#34404C] bg-[#1C2833] text-[#A9B8C7]">
                                <Icon size={17} strokeWidth={1.7} />
                            </span>
                        </div>

                        <p
                            className={`mt-5 break-words font-semibold! tracking-[-0.035em] text-[#EEF1F5]! ${
                                featured
                                    ? 'text-[29px] sm:text-[34px]'
                                    : date
                                      ? 'text-[23px] sm:text-[27px]'
                                      : 'text-[27px] sm:text-[30px]'
                            }`}
                        >
                            {value}
                        </p>

                        <p className="mt-2 text-[12px] leading-5 text-[#8792A1]">
                            {note}
                        </p>
                    </div>
                ),
            )}
        </section>
    );
}
