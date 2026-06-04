import React, { useState } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import SectionHeading from '@/components/SectionHeading';

const stats = [
    { label: 'Active', value: 28 },
    { label: 'Urgent', value: 6 },
    { label: 'Updated', value: 14 },
];

const dropdownData = [
    {
        options: ['All Categories', 'Medical', 'Food', 'Disaster'],
    },
    {
        options: ['All Status', 'Urgent', 'Active'],
    },
    {
        options: ['Latest', 'Most Urgent', 'Ending Soon'],
    },
];

const CampaignToolbar = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [selected, setSelected] = useState({
        0: 'All Categories',
        1: 'All Status',
        2: 'Latest',
    });

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    const selectOption = (idx, option) => {
        setSelected({ ...selected, [idx]: option });
        setOpenIndex(null);
    };

    return (
        <section className="bg-primary border-b border-white/10">
            <div className="container-width py-4">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    {/* LEFT */}
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-[70%]">
                        {/* SEARCH */}
                        <div className="flex items-center flex-1 bg-white/5 border border-white/10 rounded-md px-3 focus-within:ring-2 focus-within:ring-white/10 transition">
                            <FiSearch className="text-white/40" />

                            <input
                                autoFocus
                                type="text"
                                placeholder="Search campaigns..."
                                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none caret-white"
                            />
                        </div>

                        {/* CUSTOM DROPDOWNS */}
                        <div className="flex flex-wrap gap-2">
                            {dropdownData.map((item, idx) => (
                                <div key={idx} className="relative">
                                    {/* TRIGGER */}
                                    <button
                                        onClick={() => toggle(idx)}
                                        className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-md hover:bg-white/10 transition min-w-35"
                                    >
                                        {selected[idx]}
                                        <FiChevronDown className="text-white/40" />
                                    </button>

                                    {/* MENU */}
                                    {openIndex === idx && (
                                        <div className="absolute z-50 mt-2 w-full bg-primary border border-white/10 rounded-md overflow-hidden shadow-lg">
                                            {item.options.map((opt, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() =>
                                                        selectOption(idx, opt)
                                                    }
                                                    className="px-3 py-2 text-sm text-white hover:bg-white/10 cursor-pointer transition"
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4 text-sm text-white/60 whitespace-nowrap lg:ml-16 xl:ml-32 2xl:ml-48">
                        {stats.map((item, idx) => (
                            <React.Fragment key={item.label}>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-white/50 text-xs">
                                        {item.label}:
                                    </span>
                                    <span className="text-white font-semibold text-base">
                                        {item.value}
                                    </span>
                                </div>

                                {idx !== stats.length - 1 && (
                                    <div className="w-px h-4 bg-white/10" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CampaignToolbar;
