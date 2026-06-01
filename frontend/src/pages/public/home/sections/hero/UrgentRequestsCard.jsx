import React from 'react';
import urgentRequests from './data/urgentRequests';
import Badge from '@/components/Badge';
import { Link } from 'react-router-dom';

const UrgentRequestsCard = () => {
    return (
        <div
            className="absolute right-0 bottom-10
                w-full max-w-md
                rounded-[28px]
                border border-white/50
                bg-linear-to-b
                from-white
                to-slate-50/90
                p-5
                shadow-[0_20px_60px_rgba(15,23,42,0.08)]
                backdrop-blur-xl
            "
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">
                    Urgent Requests
                </h3>
                <button className="text-sm font-medium text-emerald-600 hover:opacity-80 cursor-pointer">
                    <Link>
                        <Badge variant='default' className='text-text-secondary border-none'>View All</Badge>
                    </Link>
                </button>
            </div>

            {/* Requests */}
            <div className="max-h-48 overflow-y-auto custom-scroll pr-1">
                {urgentRequests.map((request) => {
                    const Icon = request.icon;

                    return (
                        <div
                            key={request.id}
                            className="
                                flex items-center justify-between
                                border-b border-border/60 first:border-t
                                p-2 cursor-pointer
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`
                                        flex h-10 w-10 items-center justify-center
                                        rounded-full text-surface
                                        ${request.bgColor}
                                    `}
                                >
                                    <Icon size={18} />
                                </div>

                                <div>
                                    <h4 className="text-[13px] font-semibold text-slate-800">
                                        {request.title}
                                    </h4>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {request.location}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span
                                    className={`
                                        inline-flex items-center
                                        rounded-full
                                        px-2 py-0.5
                                        text-[11px] font-medium
                                        ${request.badgeClass}
                                    `}
                                >
                                    {request.priority}
                                </span>

                                <p className="mt-1.5 text-[11px] text-slate-400">
                                    {request.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UrgentRequestsCard;
