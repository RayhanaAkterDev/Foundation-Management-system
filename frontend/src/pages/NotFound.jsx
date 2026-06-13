import React from 'react';
import { Link } from 'react-router-dom';
import { TbArrowLeft, TbHome } from 'react-icons/tb';
import EmptyStateIllustration from './EmptyStateIllustration';

const NotFound = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-surface px-4 sm:px-6 overflow-hidden">
            {/* Soft ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-105 h-105 bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-40 -right-40 w-105 h-105 bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-2xl text-center">
                {/* Illustration */}
                <div className="mb-10 flex justify-center">
                    <div className="scale-95 sm:scale-100 transition-transform">
                        <EmptyStateIllustration type="404" />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold capitalize ">
                    Page not found
                </h1>

                {/* Description */}
                <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-xl mx-auto">
                    The page you’re looking for doesn’t exist, may have been
                    moved, or the link might be broken.
                </p>

                {/* Actions */}
                <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 active:scale-[0.98] transition w-full sm:w-auto"
                    >
                        <TbHome size={18} />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-text hover:bg-muted/10 active:scale-[0.98] transition w-full sm:w-auto"
                    >
                        <TbArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                {/* Divider */}
                <div className="mt-12 flex items-center justify-center">
                    <div className="h-px w-24 bg-border/60" />
                </div>

                {/* Footer branding */}
                <p className="mt-5 text-xs sm:text-sm text-muted">
                    Stand For People • Connecting help where it’s needed most
                </p>
            </div>
        </section>
    );
};

export default NotFound;
