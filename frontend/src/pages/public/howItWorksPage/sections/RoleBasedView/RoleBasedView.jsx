import React, { useState } from 'react';
import roles from './data';
import SectionHeading from '@/components/SectionHeading';

const RoleBasedView = () => {
    const [active, setActive] = useState('Requester');

    const activeRole = roles.find((r) => r.label === active);
    const ActiveIcon = activeRole.icon;

    return (
        <section className="container-width section-gap border-t border-border">
            {/* HEADER */}
            <SectionHeading
                gap="lg"
                title="Who participates in SP system?"
                headingSize="section"
                description="A connected ecosystem where each role plays a defined part in turning real-world needs into verified action."
                descriptionSize="hero"
            />

            {/* MOBILE HINT */}
            <p className="mt-6 text-center text-sm md:hidden text-primary/70 leading-relaxed">
                Tap any role card to view how it interacts with the system
            </p>

            {/* ROLE GRID */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles.map((role) => {
                    const isActive = role.label === active;
                    const Icon = role.icon;

                    return (
                        <button
                            key={role.label}
                            onClick={() => setActive(role.label)}
                            className={`
                                text-left rounded-2xl border transition-all duration-200 cursor-pointer
                                p-6 sm:p-7
                                hover:-translate-y-1 hover:shadow-md

                                ${
                                    isActive
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                        : 'border-border bg-surface hover:border-primary/30'
                                }
                            `}
                        >
                            {/* ICON */}
                            <div
                                className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center mb-5
                                    ${
                                        isActive
                                            ? 'bg-primary text-surface'
                                            : 'bg-primary/10 text-primary'
                                    }
                                `}
                            >
                                <Icon size={20} />
                            </div>

                            {/* TITLE */}
                            <h3 className="font-semibold text-text-primary text-base sm:text-lg leading-snug">
                                {role.title}
                            </h3>

                            {/* DESCRIPTION */}
                            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
                                {role.desc}
                            </p>

                            {/* ACTION */}
                            <div className="mt-5 text-sm">
                                <span className="text-primary font-medium">
                                    Action:
                                </span>{' '}
                                <span className="text-text-primary font-medium">
                                    {role.action}
                                </span>
                            </div>

                            {/* MOBILE AFFORDANCE */}
                            <div className="mt-6 md:hidden text-xs text-primary/70 font-medium">
                                Tap to view details →
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ACTIVE PANEL */}
            <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-primary p-7 sm:p-9 md:p-10 flex gap-6 items-start shadow-lg">
                {/* ICON */}
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
                    <ActiveIcon size={22} />
                </div>

                {/* TEXT */}
                <div className="space-y-3">
                    <h4 className="text-lg sm:text-xl font-semibold text-surface">
                        Active Role: {activeRole.label}
                    </h4>

                    <p className="text-sm sm:text-base text-surface/90 leading-relaxed max-w-2xl">
                        {activeRole.desc}
                    </p>

                    <div className="text-sm text-white font-semibold">
                        System Action: {activeRole.action}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoleBasedView;
