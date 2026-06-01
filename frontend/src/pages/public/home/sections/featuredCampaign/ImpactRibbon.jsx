import { TbCircleCheckFilled } from 'react-icons/tb';

const impactItems = [
    'Clean drinking water',
    'Emergency food support',
    'Medical assistance',
    'Temporary shelter',
];

const ImpactRibbon = () => {
    return (
        <div className="border-t border-white/15 pt-6 mt-6">
            <p className="mb-4 text-sm font-medium tracking-wide text-surface/70 uppercase">
                Immediate needs
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
                {impactItems.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                        <TbCircleCheckFilled className="shrink-0 text-base text-emerald-400" />

                        <span className="text-sm font-medium text-surface/90">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImpactRibbon;
