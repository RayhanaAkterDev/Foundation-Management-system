import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

import {
    TbArrowRight,
    TbBolt,
    TbCertificate,
    TbClockHour4,
    TbHeartHandshake,
    TbMapPin,
    TbShieldCheck,
    TbUsersGroup,
} from 'react-icons/tb';

const stats = [
    {
        value: '1,250+',
        label: 'Active Volunteers',
    },
    {
        value: '18K+',
        label: 'Lives Supported',
    },
    {
        value: '32',
        label: 'Districts',
    },
    {
        value: '240+',
        label: 'Campaigns',
    },
];

const highlights = [
    {
        icon: TbShieldCheck,
        text: 'Verified NGO Network',
    },
    {
        icon: TbClockHour4,
        text: 'Flexible Schedule',
    },
    {
        icon: TbCertificate,
        text: 'Certificate & Recognition',
    },
];

const HeroCard = () => (
    <div className="relative">
        {/* glow */}
        <div className="absolute inset-10 rounded-full bg-primary/10 blur-[80px]" />

        <div className="relative overflow-hidden rounded-[34px] border border-border bg-white shadow-[0_30px_90px_rgba(0,0,0,0.06)]">
            {/* header */}

            <div className="border-b border-border px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">
                            Volunteer Dashboard
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            Your impact starts here
                        </h3>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                        <TbHeartHandshake size={28} />
                    </div>
                </div>
            </div>

            {/* stats */}

            <div className="grid grid-cols-2">
                {stats.map((item, index) => (
                    <div
                        key={item.label}
                        className={`p-7 ${
                            index % 2 === 0 ? 'border-r border-border' : ''
                        } ${index < 2 ? 'border-b border-border' : ''}`}
                    >
                        <h3 className="text-4xl font-black text-primary">
                            {item.value}
                        </h3>

                        <p className="mt-2 text-sm text-text-secondary">
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* opportunities */}

            <div className="space-y-5 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold">Current Opportunities</h4>

                        <p className="mt-1 text-sm text-text-secondary">
                            Join ongoing missions across Bangladesh
                        </p>
                    </div>

                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        16 Open
                    </span>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            title: 'Food Distribution',
                            location: 'Dhaka',
                            volunteers: 18,
                        },
                        {
                            title: 'Medical Support',
                            location: 'Khulna',
                            volunteers: 12,
                        },
                        {
                            title: 'Flood Response',
                            location: 'Sylhet',
                            volunteers: 26,
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="group flex items-center justify-between rounded-2xl border border-border px-5 py-4 transition-all duration-300 hover:border-primary hover:bg-primary/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <TbBolt size={22} />
                                </div>

                                <div>
                                    <h5 className="font-semibold">
                                        {item.title}
                                    </h5>

                                    <div className="mt-1 flex items-center gap-4 text-xs text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <TbMapPin />

                                            {item.location}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <TbUsersGroup />
                                            {item.volunteers} Needed
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <TbArrowRight
                                className="text-primary transition-transform duration-300 group-hover:translate-x-1"
                                size={20}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* floating card */}

        <div className="absolute -left-10 top-10 hidden xl:block">
            <div className="rounded-2xl border border-border bg-white px-5 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                        <TbHeartHandshake />
                    </div>

                    <div>
                        <h4 className="font-semibold">Join Today</h4>

                        <p className="text-xs text-text-secondary">
                            Make a real difference.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute -right-6 bottom-12 hidden xl:block">
            <div className="rounded-2xl border border-border bg-white px-5 py-4 shadow-xl">
                <h3 className="text-3xl font-black text-primary">98%</h3>

                <p className="text-xs text-text-secondary">
                    Volunteer Satisfaction
                </p>
            </div>
        </div>
    </div>
);

const VolunteerHero = () => {
    return (
        <section className="grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
                <SectionHeading
                    align="left"
                    badge={{
                        label: 'Volunteer Community',
                        variant: 'primary',
                        tone: 'solid',
                    }}
                    headingSize="sectionHero"
                    title={
                        <>
                            Become the reason
                            <br />
                            <span className="text-primary">
                                someone smiles today.
                            </span>
                        </>
                    }
                    description="Your time, skills, and compassion can create lasting change for families across Bangladesh. Whether in the field or remotely, every contribution matters."
                />

                <div className="mt-10 flex flex-wrap gap-3">
                    {highlights.map(({ icon: Icon, text }) => (
                        <div
                            key={text}
                            className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium"
                        >
                            <Icon className="text-primary" size={18} />

                            {text}
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                    <Button>
                        <TbHeartHandshake />
                        Become a Volunteer
                    </Button>

                    <button className="group inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 font-medium transition-all duration-300 hover:border-primary hover:text-primary">
                        Explore Opportunities
                        <TbArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>

                <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
                    {stats.map((item) => (
                        <div key={item.label}>
                            <h3 className="text-3xl font-black text-primary">
                                {item.value}
                            </h3>

                            <p className="mt-2 text-sm text-text-secondary">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <HeroCard />
        </section>
    );
};

export default VolunteerHero;
