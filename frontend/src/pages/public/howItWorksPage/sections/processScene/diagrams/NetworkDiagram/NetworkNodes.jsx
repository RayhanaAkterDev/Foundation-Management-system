import { HeartHandshake, Users } from 'lucide-react';

export const TopNode = ({ icon, title, subtitle }) => {
    const Icon = icon;

    return (
        <div className="flex flex-col items-center text-center max-w-42.5 sm:max-w-47.5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center transition hover:scale-105">
                <Icon className="w-7 h-7 text-primary" />
            </div>

            <h4 className="mt-3 text-base sm:text-lg font-semibold text-foreground">
                {title}
            </h4>

            <p className="mt-1 text-xs sm:text-sm leading-5 text-muted-foreground">
                {subtitle}
            </p>
        </div>
    );
};

export const FoundationNode = () => {
    return (
        <div className="relative w-full max-w-85 px-6 sm:px-7 py-5 sm:py-6 rounded-[28px] bg-primary text-primary-foreground overflow-hidden shadow-[0_20px_60px_-25px_rgba(0,0,0,.25)]">
            <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-white/10" />

            <div className="relative w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                <Users className="w-7 h-7" />
            </div>

            <h3 className="relative mt-4 text-xl sm:text-2xl font-bold">
                Foundation
            </h3>

            <p className="relative mt-2 text-sm leading-6 text-primary-foreground/80">
                Verifies requests, prioritizes urgent cases and coordinates
                donations, volunteers and partnerships to maximize impact.
            </p>
        </div>
    );
};

export const CommunityNode = () => {
    return (
        <div className="bg-surface border border-border rounded-[26px] px-5 sm:px-6 py-5 text-center w-full max-w-70 sm:max-w-75">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <HeartHandshake className="w-7 h-7 text-primary" />
            </div>

            <h3 className="mt-4 text-lg sm:text-xl font-bold text-foreground">
                Communities
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Receive verified assistance and long-term support through a
                transparent and coordinated network.
            </p>
        </div>
    );
};
