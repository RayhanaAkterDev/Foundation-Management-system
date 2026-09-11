import React from 'react';

const SectionHeading = ({ number, eyebrow, title, description, action }) => (
    <div className="mb-6 flex items-end justify-between gap-8">
        <div className="flex min-w-0 gap-4">
            {number && (
                <div className="flex w-8 shrink-0 flex-col items-center pt-0.5">
                    <span className="font-poppins text-[10px] font-semibold tabular-nums tracking-widest text-text-secondary">
                        {number}
                    </span>

                    <span className="mt-2.5 h-8 w-px bg-border" />
                </div>
            )}

            <div className="min-w-0">
                {eyebrow && (
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                        <span className="font-poppins text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
                            {eyebrow}
                        </span>
                    </div>
                )}

                <h2 className="font-fraunces text-[29px] leading-[1.08] tracking-[-0.028em] text-text-primary sm:text-[34px]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2.5 max-w-170 font-jost text-[13px] leading-[1.55] text-text-secondary">
                        {description}
                    </p>
                )}
            </div>
        </div>

        {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </div>
);

export default SectionHeading;
