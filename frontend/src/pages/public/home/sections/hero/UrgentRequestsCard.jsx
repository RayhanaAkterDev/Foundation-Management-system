import React from 'react';
import urgentRequests from './data/urgentRequests';
import Badge from '@/components/Badge';
import { Link } from 'react-router-dom';

const UrgentRequestsCard = () => {
    return (
        <div
            className="
                w-full
                rounded-3xl
                border border-border
                bg-transparent
                p-3 sm:p-4 lg:p-5
                shadow-[0_20px_60px_rgba(15,23,42,0.08)]
                backdrop-blur
            "
        >
            {/* Header */}
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    Urgent Requests
                </h3>

                <Link>
                    <Badge
                        variant="default"
                        className="text-text-secondary border-none text-[10px] sm:text-xs"
                    >
                        View All
                    </Badge>
                </Link>
            </div>

            {/* Requests */}
            <div className="max-h-36 sm:max-h-44 xl:max-h-48 overflow-y-auto custom-scroll pr-1">
                {urgentRequests.map((request) => {
                    const Icon = request.icon;

                    return (
                        <div
                            key={request.id}
                            className="
                                flex items-center justify-between
                                border-b border-border/60 first:border-t

                                /* KEY FIX: compact spacing */
                                py-1.5 sm:py-2

                                cursor-pointer
                            "
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div
                                    className={`
                                        flex
                                        h-8 w-8 sm:h-10 sm:w-10
                                        items-center justify-center
                                        rounded-full text-surface
                                        ${request.bgColor}
                                    `}
                                >
                                    <Icon size={16} />
                                </div>

                                <div>
                                    <h4 className="text-[12px] sm:text-[13px] font-semibold text-slate-800">
                                        {request.title}
                                    </h4>
                                    <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500">
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
                                        text-[9px] sm:text-[11px]
                                        font-medium
                                        ${request.badgeClass}
                                    `}
                                >
                                    {request.priority}
                                </span>

                                <p className="mt-1 text-[9px] sm:text-[11px] text-slate-400">
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