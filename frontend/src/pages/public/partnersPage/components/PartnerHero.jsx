import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

import {
    TbHeartHandshake,
    TbBuildingCommunity,
    TbSchool,
    TbBuildingBank,
    TbUsers,
    TbWorld,
} from 'react-icons/tb';

const PartnerNode = ({ icon, title }) => (
    <div className="group flex flex-col items-center">
        <div
            className="
            size-16
            rounded-2xl
            bg-surface
            border
            border-border
            shadow-sm
            flex
            items-center
            justify-center
            text-primary
            text-3xl
            transition-all
            duration-300
            group-hover:-translate-y-1
            group-hover:shadow-lg
        "
        >
            {icon}
        </div>

        <span className="mt-2 text-sm font-medium">{title}</span>
    </div>
);

const PartnerHero = () => {
    return (
        <section className="section-gap container-width">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                {/* LEFT - 50% */}
                <div className="flex-1 min-w-0 lg:basis-1/2">
                    <SectionHeading
                        gap="md"
                        align="left"
                        badge={{
                            label: 'Partnership Program',
                            icon: TbHeartHandshake,
                            variant: 'primary',
                            size: 'md',
                        }}
                        title={
                            <>
                                Build meaningful{' '}
                                <span className="text-primary">impact</span>{' '}
                                together
                            </>
                        }
                        headingSize="hero"
                        description="
                            Collaborate with Stand For People to create sustainable
                            humanitarian impact through technology, volunteers and
                            community-driven initiatives.
                        "
                        descriptionSize="hero"
                    />
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Button size="lg">Become Partner</Button>
                        <Button variant="outline" size="lg">
                            Explore Programs
                        </Button>
                    </div>
                </div>
                {/* RIGHT - Partnership Ecosystem */}
                <div className="order-2 lg:order-0 w-full lg:flex-[0_0_50%]">
                    <div className="relative mx-auto h-95 sm:h-112.5 lg:h-130 max-w-150 overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0 rounded-4xl border border-border bg-linear-to-br from-primary/5 via-background to-primary/10" />
                        {/* Orbit Rings */}
                        <div className="absolute left-1/2 top-1/2 size-65 sm:size-80 lg:size-105 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
                        <div className="absolute left-1/2 top-1/2 size-45 sm:size-60 lg:size-75 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />
                        {/* SVG Connections */}
                        <svg className="absolute inset-0 h-full w-full">
                            <line
                                x1="50%"
                                y1="50%"
                                x2="50%"
                                y2="15%"
                                stroke="currentColor"
                                className="text-border"
                            />
                            <line
                                x1="50%"
                                y1="50%"
                                x2="82%"
                                y2="35%"
                                stroke="currentColor"
                                className="text-border"
                            />
                            <line
                                x1="50%"
                                y1="50%"
                                x2="72%"
                                y2="80%"
                                stroke="currentColor"
                                className="text-border"
                            />
                            <line
                                x1="50%"
                                y1="50%"
                                x2="28%"
                                y2="80%"
                                stroke="currentColor"
                                className="text-border"
                            />
                            <line
                                x1="50%"
                                y1="50%"
                                x2="18%"
                                y2="35%"
                                stroke="currentColor"
                                className="text-border"
                            />
                        </svg>
                        {/* CENTER HUB */}
                        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="mx-auto flex size-20 sm:size-24 lg:size-28 items-center justify-center rounded-full bg-primary text-white shadow-xl">
                                <TbHeartHandshake className="text-4xl lg:text-5xl" />
                            </div>
                            <h4 className="mt-3 font-bold text-sm sm:text-base">
                                Stand For People
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                Partnership Network
                            </p>
                        </div>
                        {/* NGOs */}
                        <div className="absolute left-1/2 top-[5%] -translate-x-1/2">
                            <PartnerNode
                                icon={<TbBuildingCommunity />}
                                title="NGOs"
                            />
                        </div>
                        {/* Companies */}
                        <div className="absolute right-[4%] top-[28%]">
                            <PartnerNode
                                icon={<TbBuildingBank />}
                                title="Companies"
                            />
                        </div>
                        {/* Universities */}
                        <div className="absolute right-[15%] bottom-[8%]">
                            <PartnerNode
                                icon={<TbSchool />}
                                title="Universities"
                            />
                        </div>
                        {/* Volunteers */}
                        <div className="absolute left-[15%] bottom-[8%]">
                            <PartnerNode
                                icon={<TbUsers />}
                                title="Volunteers"
                            />
                        </div>
                        {/* Communities */}
                        <div className="absolute left-[4%] top-[28%]">
                            <PartnerNode
                                icon={<TbWorld />}
                                title="Communities"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerHero;
