import { TbCircleCheckFilled } from 'react-icons/tb';

const impactItems = [
    'Clean drinking water',
    'Emergency food support',
    'Medical assistance',
    'Temporary shelter',
];

const ImpactRibbon = () => {
    return (
        <div className="mt-5 sm:mt-6 border-t border-white/15 pt-5 sm:pt-6">
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm font-medium tracking-[0.12em] text-surface/70 uppercase">
                Immediate needs
            </p>

            <div className="flex flex-col gap-2.5 sm:gap-3">
                {impactItems.map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-2 sm:gap-2.5"
                    >
                        <TbCircleCheckFilled className="size-4 shrink-0 text-emerald-400 sm:size-4.5" />

                        <span className="text-sm sm:text-[15px] font-medium text-surface/90">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImpactRibbon;
