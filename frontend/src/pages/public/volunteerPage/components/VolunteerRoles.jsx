import SectionHeading from '@/components/SectionHeading';
import {
    TbArrowRight,
    TbClockHour4,
    TbMapPin,
    TbHeartHandshake,
} from 'react-icons/tb';

const roles = [
    {
        title: 'Remote Support',
        desc: 'Coordinate requests, verify information, and assist teams remotely from anywhere.',
        tag: 'Remote Friendly',
    },
    {
        title: 'Emergency Response',
        desc: 'Join rapid response teams during floods, fires, and urgent crises where every minute matters.',
        tag: 'Priority Role',
    },
];

const VolunteerRoles = () => {
    // ✅ reusable scroll handler
    const goToForm = () => {
        document
            .getElementById('volunteer-form')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section className="section-gap bg-white">
            <div className="container-width">
                <SectionHeading
                    title="Ways you can contribute"
                    headingSize="sectionHero"
                    description="You don’t need special skills — just the willingness to help and the commitment to show up when it matters."
                    descriptionSize="hero"
                />

                <div className="mt-12 md:mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                        {/* LEFT CARD */}
                        <article
                            className="
                            md:col-span-7
                            h-full flex flex-col
                            rounded-2xl sm:rounded-[26px]
                            bg-white border border-gray-200
                            shadow-sm overflow-hidden
                            transition-all duration-300
                            hover:shadow-md hover:-translate-y-1
                        "
                        >
                            <div className="relative w-full aspect-video sm:aspect-16/8 lg:aspect-16/7">
                                <img
                                    src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=1600&auto=format&fit=crop"
                                    alt="Volunteer helping community"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />

                                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                    <TbHeartHandshake className="text-emerald-600" />
                                    Community Impact Role
                                </div>
                            </div>

                            <div className="p-6 sm:p-7 lg:p-8 flex flex-col flex-1">
                                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-gray-900 leading-tight">
                                    Field Volunteer
                                </h3>

                                <p className="mt-3 text-sm sm:text-base text-gray-700 leading-6 max-w-xl">
                                    Deliver food, medicine, and essential
                                    supplies directly to communities. Be present
                                    where help is needed most and create real
                                    impact.
                                </p>

                                <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-5 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <TbMapPin />
                                        On-site field work
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <TbClockHour4 />
                                        Flexible timing
                                    </div>
                                </div>

                                {/* FIXED BUTTON */}
                                <button
                                    onClick={goToForm}
                                    className="
                                        mt-6 inline-flex items-center gap-2
                                        text-emerald-700 font-medium w-fit
                                        hover:gap-3 transition-all
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-emerald-500/40
                                        rounded-md
                                    "
                                >
                                    Learn how you can help
                                    <TbArrowRight />
                                </button>
                            </div>
                        </article>

                        {/* RIGHT COLUMN */}
                        <div className="md:col-span-5 flex flex-col gap-6 h-full">
                            {roles.map((role) => (
                                <article
                                    key={role.title}
                                    className="
                                        flex-1 flex flex-col
                                        rounded-2xl sm:rounded-[26px]
                                        bg-white border border-gray-200
                                        shadow-sm p-6 sm:p-7
                                        transition-all duration-300
                                        hover:shadow-md hover:-translate-y-1
                                    "
                                >
                                    <span
                                        className="
                                        w-fit text-xs px-3 py-1
                                        rounded-full bg-gray-100
                                        text-gray-700 border border-gray-200
                                    "
                                    >
                                        {role.tag}
                                    </span>

                                    <h3 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                                        {role.title}
                                    </h3>

                                    <p className="mt-3 text-sm sm:text-base text-gray-600 leading-6 flex-1">
                                        {role.desc}
                                    </p>

                                    {/* FIXED BUTTON */}
                                    <button
                                        onClick={goToForm}
                                        className="
                                            mt-5 inline-flex items-center gap-2
                                            text-emerald-700 font-medium w-fit
                                            hover:gap-3 transition-all
                                            focus:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-emerald-500/40
                                            rounded-md
                                        "
                                    >
                                        Learn More
                                        <TbArrowRight />
                                    </button>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VolunteerRoles;
