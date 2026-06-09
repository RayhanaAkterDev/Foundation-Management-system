import React from 'react';
import { Link } from 'react-router-dom';
import Motion from '@/components/motion/Motion';
import localCases from './data/impactData';
import { FiMapPin } from 'react-icons/fi';
import Badge from '@/components/Badge';
import pulseStats from './data/pulseStats';

const getUrgency = (id) => {
    if (id % 3 === 0) return { label: 'Critical', color: 'danger' };
    if (id % 2 === 0) return { label: 'Urgent', color: 'warning' };
    return { label: 'Active', color: 'primary' };
};

const RightPanel = () => {
    return (
        <Motion variant="fadeLeft" className="md:col-span-3 w-full min-w-0">
            <div className="h-full rounded-3xl border border-primary/8 bg-white p-5 sm:p-6 lg:p-8 flex flex-col min-w-0">
                {/* HEADER */}
                <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="min-w-0">
                        <h4 className="text-xl font-semibold break-words">
                            Live Needs Feed
                        </h4>
                        <p className="text-xs text-text-secondary mt-1 break-words">
                            Updated 2 minutes ago • Real-time community pulse
                        </p>
                    </div>

                    <Badge variant="accent" tone="glass" size="md" dot pulse>
                        LIVE
                    </Badge>
                </div>

                {/* PULSE SUMMARY */}
                <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/5 p-4 min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary">
                            Active Demand in Your Area
                        </span>
                    </div>

                    <div className="mt-4 space-y-3 text-sm">
                        {pulseStats.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-3"
                            >
                                <span className="text-text-secondary break-words">
                                    {item.icon} {item.label}
                                </span>

                                <span
                                    className={`font-semibold ${item.valueColor} whitespace-nowrap`}
                                >
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LIVE FEED */}
                <div className="relative mt-8 flex-1 overflow-hidden min-w-0">
                    <div className="absolute left-1.5 top-0 bottom-10 w-px bg-primary/10" />

                    <div className="space-y-6 overflow-y-auto max-h-80 pr-2 min-w-0">
                        {localCases.map((item) => {
                            const urgency = getUrgency(item.id);

                            return (
                                <Link
                                    key={item.id}
                                    to={`/campaign/${item.id}`}
                                    className="group flex gap-4 min-w-0"
                                >
                                    {/* DOT */}
                                    <div className="relative z-10 mt-2 shrink-0">
                                        <div
                                            className={`h-3 w-3 rounded-full
                                            ${
                                                urgency.color === 'danger'
                                                    ? 'bg-red-500'
                                                    : urgency.color ===
                                                        'warning'
                                                      ? 'bg-orange-400'
                                                      : 'bg-green-500'
                                            }`}
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 border-b border-primary/10 pb-4 min-w-0">
                                        <h5 className="font-medium group-hover:text-primary transition break-words">
                                            {item.title}
                                        </h5>

                                        <p className="text-xs text-text-secondary mt-1 break-words">
                                            {item.id % 3 === 0
                                                ? 'Needs immediate medical attention'
                                                : item.id % 2 === 0
                                                  ? 'Resources running low'
                                                  : 'Waiting for support allocation'}
                                        </p>

                                        <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary min-w-0">
                                            <FiMapPin />
                                            <span className="break-words">
                                                {item.location} •{' '}
                                                {item.distance}
                                            </span>
                                        </div>

                                        <div className="mt-2">
                                            <Badge
                                                variant={urgency.color}
                                                tone="soft"
                                                size="sm"
                                            >
                                                {urgency.label}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* IMAGE */}
                                    <img
                                        src={item.image}
                                        className="h-14 w-14 rounded-xl object-cover border border-border shrink-0"
                                        alt=""
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between text-xs text-text-secondary">
                        <span>12 new requests in last 24h</span>
                        <span className="text-primary font-medium">
                            Live tracking
                        </span>
                    </div>
                </div>
            </div>
        </Motion>
    );
};

export default RightPanel;
