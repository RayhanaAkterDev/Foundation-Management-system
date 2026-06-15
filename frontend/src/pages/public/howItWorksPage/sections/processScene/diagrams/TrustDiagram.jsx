import { TbCheck } from 'react-icons/tb';

const items = [
    { label: 'Identity Check', status: 'verified' },
    { label: 'Duplicate Detection', status: 'verified' },
    { label: 'Location Validation', status: 'verified' },
    { label: 'Human Review', status: 'verified' },
];

const TrustDiagram = () => {
    return (
        <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-6 sm:space-y-10">
            {/* TRUST CORE */}
            <div className="relative flex justify-center">
                <div className="relative">
                    {/* glow */}
                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-105 sm:scale-110" />

                    {/* pulse ring */}
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />

                    {/* core */}
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-primary/30 bg-linear-to-b from-primary/10 to-transparent flex flex-col items-center justify-center relative backdrop-blur-md">
                        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary">
                            94
                        </h2>

                        <p className="text-xs sm:text-sm text-text-secondary mt-1">
                            Trust Index
                        </p>

                        <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            Verified System
                        </div>
                    </div>
                </div>
            </div>

            {/* VERIFICATION LAYERS */}
            <div className="space-y-2 sm:space-y-3">
                {items.map((item, idx) => (
                    <div
                        key={item.label}
                        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-surface p-3 sm:p-5 flex items-center justify-between transition hover:border-primary/30"
                    >
                        {/* subtle glow */}
                        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent" />

                        <div className="relative flex items-center gap-2 sm:gap-3">
                            <span className="text-[10px] sm:text-xs text-text-secondary w-5 sm:w-6">
                                {String(idx + 1).padStart(2, '0')}
                            </span>

                            <span className="text-sm sm:text-base font-medium text-text-primary">
                                {item.label}
                            </span>
                        </div>

                        <div className="relative flex items-center gap-1 sm:gap-2">
                            <span className="text-[10px] sm:text-xs text-primary font-medium">
                                Passed
                            </span>

                            <TbCheck className="text-primary text-base sm:text-xl" />
                        </div>
                    </div>
                ))}
            </div>

            {/* summary */}
            <div className="text-center text-[10px] sm:text-xs text-text-secondary leading-relaxed px-2">
                Multiple verification signals validated before processing
            </div>
        </div>
    );
};

export default TrustDiagram;
