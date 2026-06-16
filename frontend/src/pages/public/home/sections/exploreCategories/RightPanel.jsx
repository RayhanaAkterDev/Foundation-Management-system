import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import ExploreAllCategoriesCta from './ExploreAllCategoriesCta';

const RightPanel = ({ categories, active, setActive }) => {
    return (
        <div className="lg:sticky lg:top-24">
            <Motion variant="fadeUp">
                <SectionHeading
                    gap="lg"
                    align="left"
                    title="Where would you like your help to go?"
                    headingClass='lg:leading-14! font-fraunces!'
                    headingSize="sectionHero"
                    description="Every category represents real people and real situations. Choose where your support should make a difference."
                    descriptionSize="sectionHero"
                />
            </Motion>

            <div className="my-10">
                <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">
                    Categories
                </p>
            </div>

            <div className="space-y-8">
                {categories.map((cat) => {
                    const isActive = active.id === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActive(cat)}
                            type="button"
                            className={`
                                relative w-full text-left group
                                transition-all duration-300
                                ${isActive ? 'scale-[1.01]' : 'opacity-80 hover:opacity-100'}
                            `}
                        >
                            {/* guide line */}
                            <span className="absolute left-0 top-1 bottom-1 w-px bg-border opacity-40" />

                            {/* active indicator */}
                            <span
                                className={`
                                    absolute left-0 top-0 h-full w-0.5 rounded-full
                                    transition-all duration-300
                                    ${isActive ? 'opacity-100' : 'opacity-0'}
                                `}
                                style={{ backgroundColor: cat.color }}
                            />

                            <div className="pl-6">
                                <div className="flex items-baseline justify-between gap-4">
                                    <span
                                        className="text-base sm:text-lg transition-all duration-300"
                                        style={{
                                            color: isActive
                                                ? cat.color
                                                : '#111827',
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                    >
                                        {cat.name}
                                    </span>

                                    <span className="text-xs text-text-secondary whitespace-nowrap">
                                        {cat.urgency}
                                    </span>
                                </div>

                                <p className="text-xs text-text-secondary/70 leading-relaxed mt-2">
                                    {cat.microHint ||
                                        'Explore active requests in this category'}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-14">
                <ExploreAllCategoriesCta />
            </div>
        </div>
    );
};

export default RightPanel;
