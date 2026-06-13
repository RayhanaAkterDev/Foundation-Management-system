import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiX } from 'react-icons/fi';

const MegaMenu = ({ item, onClose }) => {
    const menuRef = useRef(null);

    if (!item) return null;

    const preview = item.preview;

    return (
        <div className="fixed top-24 left-0 w-full z-1000 flex justify-center">
            {/* BACKDROP */}
            <div
                className="fixed inset-0 z-999 bg-black/10 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* MENU */}
            <div
                ref={menuRef}
                className="relative z-1001 mt-4 w-[min(1100px,94vw)] bg-surface border border-border rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.14)]  max-h-[calc(100vh-8rem)]
        overflow-y-auto animate-[fadeIn_0.18s_ease-out]"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-border">
                    <p className="text-[12px] uppercase tracking-[0.25em] text-text-secondary">
                        {item.name}
                    </p>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-background"
                    >
                        <FiX />
                    </button>
                </div>

                {/* BODY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 lg:p-10">
                    {/* LEFT */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {item.groups.map((group) => (
                            <div key={group.title}>
                                <h4 className="text-[12px] uppercase tracking-[0.25em] text-text-secondary mb-5">
                                    {group.title}
                                </h4>

                                <div className="space-y-2">
                                    {group.items.map((link) => (
                                        <Link
                                            key={link.id}
                                            to={link.path}
                                            onClick={onClose}
                                            className="group flex justify-between gap-4 px-4 py-3 rounded-xl hover:bg-background transition"
                                        >
                                            <div>
                                                <h5 className="text-[15px] font-medium group-hover:text-primary">
                                                    {link.name}
                                                </h5>
                                                {link.desc && (
                                                    <p className="mt-1 text-[13px] text-text-secondary">
                                                        {link.desc}
                                                    </p>
                                                )}
                                            </div>

                                            <FiArrowRight className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-4">
                        <div className="h-full rounded-2xl overflow-hidden border border-border bg-background flex flex-col">
                            {preview?.image && (
                                <div className="h-40 w-full overflow-hidden">
                                    <img
                                        src={preview.image}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-6 flex flex-col justify-between flex-1">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-text-secondary">
                                        {item.name} Highlight
                                    </p>

                                    <h3 className="mt-3 text-xl font-semibold">
                                        {preview?.title}
                                    </h3>

                                    <p className="mt-3 text-[13px] text-text-secondary">
                                        {preview?.desc}
                                    </p>

                                    {preview?.highlight && (
                                        <p className="mt-4 text-[12px] text-primary font-medium">
                                            {preview.highlight}
                                        </p>
                                    )}
                                </div>

                                {preview?.cta && (
                                    <Link
                                        to={preview.cta}
                                        onClick={onClose}
                                        className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition"
                                    >
                                        Explore <FiArrowRight />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
