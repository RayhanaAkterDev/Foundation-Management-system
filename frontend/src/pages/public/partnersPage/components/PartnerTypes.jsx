import {
    TbBuildingCommunity,
    TbBriefcase,
    TbSchool,
    TbUsersGroup,
    TbHeartHandshake,
    TbBuildingHospital,
} from 'react-icons/tb';

const partners = [
    {
        label: 'NGO Network',
        desc: 'Connect with grassroots organizations working in your area.',
        icon: TbBuildingCommunity,
        action: 'Explore NGO partners',
        route: '/partners/ngos',
    },
    {
        label: 'Corporate Partners',
        desc: 'See companies funding CSR and large-scale impact programs.',
        icon: TbBriefcase,
        action: 'View corporate network',
        route: '/partners/corporates',
    },
    {
        label: 'University Alliances',
        desc: 'Discover research collaborations and student-led initiatives.',
        icon: TbSchool,
        action: 'Explore academic partners',
        route: '/partners/universities',
    },
    {
        label: 'Community Groups',
        desc: 'Local volunteer and community-driven support networks.',
        icon: TbUsersGroup,
        action: 'Join community network',
        route: '/partners/community',
    },
    {
        label: 'Healthcare Partners',
        desc: 'Hospitals and clinics supporting medical outreach programs.',
        icon: TbHeartHandshake,
        route: '/partners/healthcare',
    },
    {
        label: 'Government Bodies',
        desc: 'Public sector coordination, policy, and large-scale support.',
        icon: TbBuildingHospital,
        action: 'See government links',
        route: '/partners/government',
    },
];

const PartnerTypes = () => {
    return (
        <section className='container-width'>
            <div className="relative">
                {/* IMAGE */}
                <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl">
                    <img
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
                        alt="Partnership Network"
                        className="w-full h-80 sm:h-105 md:h-125 lg:h-130 object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                    {/* TEXT OVERLAY */}
                    <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 text-white pr-5 sm:pr-10">
                        <p className="text-[10px] sm:text-sm uppercase tracking-[0.2em] opacity-80">
                            Partnership Network
                        </p>

                        <h3 className="mt-3 sm:mt-4 text-xl sm:text-3xl md:text-5xl font-bold max-w-2xl leading-snug sm:leading-tight">
                            A network of partners building real-world support
                            and coordination
                        </h3>
                    </div>
                </div>

                {/* CARDS */}
                <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {partners.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="
                                    group relative
                                    rounded-xl border border-gray-200
                                    bg-white
                                    hover:border-primary/30
                                    transition-all duration-300
                                    cursor-pointer
                                "
                            >
                                {/* HEADER */}
                                <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border-b border-gray-100">
                                    <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Icon className="text-lg sm:text-xl" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary truncate">
                                            {item.label}
                                        </h3>

                                        {item.action && (
                                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                                                {item.action}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* BODY */}
                                <div className="p-4 sm:p-5">
                                    <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* FOOTER */}
                                <div className="px-4 sm:px-5 py-3 bg-gray-50 flex items-center justify-between group-hover:bg-primary/5 transition">
                                    <span className="text-[11px] sm:text-xs text-gray-500">
                                        Partner module
                                    </span>

                                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                                        Open →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PartnerTypes;
