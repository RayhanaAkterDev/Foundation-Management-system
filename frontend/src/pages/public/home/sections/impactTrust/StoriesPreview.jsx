import React from 'react';
import { TbShieldCheck } from 'react-icons/tb';
import { HiOutlineMapPin } from 'react-icons/hi2';
import stories from './data/storiesData';
import { Link } from 'react-router-dom';

const StoriesPreview = () => {
    return (
        <div className="mt-16">
            <div className="grid md:grid-cols-3 gap-8">
                {stories.map((story) => (
                    <article
                        key={story.category}
                        className="
                            group relative rounded-2xl border border-border
                            bg-surface/80 p-6
                            transition duration-300
                            hover:border-primary/30 hover:shadow-lg
                        "
                    >
                        {/* subtle trust indicator */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <TbShieldCheck
                                    size={16}
                                    className="text-primary"
                                />
                                <span className="text-[11px] uppercase tracking-wider">
                                    Verified story
                                </span>
                            </div>

                            <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {story.tag}
                            </span>
                        </div>

                        {/* main content */}
                        <div>
                            <h4 className="text-lg font-semibold text-text-primary leading-snug">
                                {story.category}
                            </h4>

                            <div className="flex items-center gap-1 mt-2 text-xs text-text-secondary">
                                <HiOutlineMapPin size={14} />
                                <span>{story.location}</span>
                            </div>

                            <p className="mt-4 text-sm leading-relaxed text-text-secondary line-clamp-4">
                                {story.text}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-[11px] text-text-secondary">
                                Community validated
                            </span>

                            <Link
                                className="
                                    text-[12px] font-medium text-primary
                                    opacity-80 group-hover:opacity-100
                                    transition cursor-pointer
                                "
                            >
                                Read story →
                            </Link>
                        </div>

                        {/* subtle hover accent */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/10 pointer-events-none" />
                    </article>
                ))}
            </div>
        </div>
    );
};

export default StoriesPreview;
