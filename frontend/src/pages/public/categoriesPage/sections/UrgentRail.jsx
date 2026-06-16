import { Link } from 'react-router-dom';
import { getUrgentCampaigns } from '@/data/selectors';

const UrgentRail = () => {
    if (!getUrgentCampaigns.length) return null;
    return (
        <div className="flex gap-3 overflow-x-auto pb-3">
            {getUrgentCampaigns.map((c) => (
                <Link
                    key={c.id}
                    to={`/campaign/${c.id}`}
                    className="
                        min-w-55
                        px-4 py-3
                        rounded-xl
                        border border-red-500/20
                        bg-red-500/5
                        hover:bg-red-500/10
                        transition
                    "
                >
                    <div className="text-xs text-red-400 mb-1">
                        {c.category}
                    </div>
                    <div className="text-sm font-medium text-text-primary">
                        {c.title}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default UrgentRail;
