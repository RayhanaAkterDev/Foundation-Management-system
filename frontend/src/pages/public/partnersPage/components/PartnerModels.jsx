import { useState } from 'react';
import {
    TbBuildingCommunity,
    TbCpu,
    TbTruckDelivery,
    TbBook2,
    TbPigMoney,
} from 'react-icons/tb';

const data = [
    {
        icon: TbBuildingCommunity,
        title: 'Resource Support',
        desc: 'Provide food, medicine, clothing, funding, and emergency supplies that directly support ongoing relief operations.',
        best: ['Companies', 'NGOs', 'Individuals'],
    },
    {
        icon: TbCpu,
        title: 'Technology & Systems',
        desc: 'Build and support digital infrastructure including AI tools, data systems, platforms, and automation for coordination.',
        best: ['Tech Companies', 'Developers'],
    },
    {
        icon: TbTruckDelivery,
        title: 'Field Operations',
        desc: 'Work on the ground by coordinating volunteers, delivering aid, and managing local execution of programs.',
        best: ['Community Groups', 'NGOs'],
    },
    {
        icon: TbBook2,
        title: 'Knowledge & Research',
        desc: 'Contribute research, insights, training, and strategy to improve long-term impact and decision-making.',
        best: ['Universities', 'Researchers'],
    },
    {
        icon: TbPigMoney,
        title: 'Funding & Grants',
        desc: 'Support programs financially through grants, sponsorships, and long-term funding partnerships.',
        best: ['Corporates', 'Donors', 'Foundations'],
    },
];

const PartnerModels = () => {
    const [active, setActive] = useState(0);

    return (
        <section className="bg-primary text-white mt-14 sm:mt-20 py-12 sm:py-20">
            <div className="container-width">
                {/* HEADER */}
                <div className="px-4">
                    <p className="uppercase tracking-widest text-[10px] sm:text-sm text-white/60">
                        Partnership Models
                    </p>

                    <h2
                        className="
                        mt-3
                        text-xl sm:text-3xl lg:text-5xl
                        font-semibold leading-snug
                    "
                    >
                        Different ways to create impact together
                    </h2>

                    <p
                        className="
                        mt-3
                        text-xs sm:text-sm lg:text-base
                        text-white/70
                        max-w-xl
                        leading-relaxed
                    "
                    >
                        Partners contribute in multiple ways depending on their
                        strengths — from funding to field execution.
                    </p>
                </div>

                {/* LIST */}
                <div className="mt-8 sm:mt-12 px-4 divide-y divide-white/10">
                    {data.map((item, index) => {
                        const isActive = active === index;
                        const Icon = item.icon;

                        return (
                            <div key={item.title} className="py-4 sm:py-6">
                                <button
                                    onClick={() => setActive(index)}
                                    className="
                                        w-full flex items-start justify-between
                                        gap-4 sm:gap-6
                                        text-left
                                    "
                                >
                                    {/* LEFT */}
                                    <div className="flex gap-3 sm:gap-5 min-w-0">
                                        <div className="mt-0.5 text-white/80 shrink-0">
                                            <Icon className="text-base sm:text-xl" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                className="
                                                text-sm sm:text-lg lg:text-2xl
                                                font-semibold leading-snug
                                            "
                                            >
                                                {item.title}
                                            </h3>

                                            <p
                                                className="
                                                mt-0.5
                                                text-[10px] sm:text-xs lg:text-sm
                                                text-white/50
                                                leading-snug
                                            "
                                            >
                                                {item.best.join(' · ')}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="
                                        text-white/50
                                        text-lg sm:text-2xl
                                        leading-none shrink-0
                                    "
                                    >
                                        {isActive ? '−' : '+'}
                                    </div>
                                </button>

                                {/* CONTENT */}
                                <div
                                    className={`
                                        overflow-hidden transition-all duration-300 ease-in-out
                                        ${isActive ? 'max-h-40 mt-2 sm:mt-3' : 'max-h-0'}
                                    `}
                                >
                                    <p
                                        className="
                                        text-xs sm:text-sm lg:text-base
                                        text-white/70
                                        leading-relaxed
                                        pl-7 sm:pl-10
                                        max-w-xl
                                    "
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PartnerModels;
