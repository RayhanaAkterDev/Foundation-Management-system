import React from 'react';
import { TbShieldCheck } from 'react-icons/tb';

import humanProof from '@/assets/home/transparency/humanProof.png';
import Badge from '@/components/Badge';

const HumanProof = () => {
    return (
        <div className="rounded-4xl border border-border bg-surface p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-center">
                {/* Text */}
                <div className="md:col-span-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Badge
                            variant="primary"
                            tone="soft"
                            size="sm"
                            icon={TbShieldCheck}
                        >
                            Verified Recipient
                        </Badge>

                        <span className="text-xs text-text-secondary">
                            Case ID #CRL-2048 · Kurigram District
                        </span>
                    </div>

                    <div className="mt-3 md:mt-4 text-sm text-text-secondary">
                        <span className="font-medium text-text-primary">
                            Flood recovery support
                        </span>

                        <span className="mx-2">•</span>

                        <span>verified case</span>
                    </div>

                    <blockquote className="mt-5 md:mt-6 text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
                        “Support arrived within two days after the flood. We
                        were able to rebuild our home and send our children back
                        to school.”
                    </blockquote>

                    <div className="mt-5 md:mt-6 flex justify-between items-center min-h-16">
                        <span className="self-start font-medium">
                            — Salma Begum
                        </span>

                        <span className="text-xs text-text-secondary/80 self-end">
                            Verified May 2026
                        </span>
                    </div>
                </div>

                {/* Image */}
                <div className="md:col-span-2">
                    <img
                        src={humanProof}
                        alt="Verified impact story"
                        className="w-full h-auto rounded-3xl object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default HumanProof;