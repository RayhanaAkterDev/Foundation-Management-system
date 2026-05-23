import React from 'react';
import { TbMail, TbShieldCheck } from 'react-icons/tb';

const FooterCTA = () => {
    return (
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}
            <div className="max-w-xl">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <TbMail size={22} />
                    </div>

                    <div>
                        <h3 className="text-3xl font-semibold text-primary">
                            Stay updated with CareLink
                        </h3>

                        <p className="mt-2 text-[15px] leading-7 text-text-secondary">
                            Get insights, updates, and community impact stories
                            directly in your inbox.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="w-full max-w-md">
                <div className="flex overflow-hidden rounded-xl border border-border bg-white focus-within:border-primary">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-transparent px-4 py-3 text-[15px] outline-none"
                    />

                    <button className="bg-primary px-6 text-[15px] font-medium text-white transition hover:bg-primary-hover">
                        Subscribe
                    </button>
                </div>

                <p className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
                    <TbShieldCheck />
                    We respect your privacy. Unsubscribe anytime.
                </p>
            </div>
        </div>
    );
};

export default FooterCTA;