import { Link } from 'react-router-dom';
import { getCampaignsByCategory } from '@/data/selectors';

const CategoryGrid = ({ category }) => {
    const campaigns = getCampaignsByCategory(category.id);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>

            <p className="text-sm text-white/70 mb-6">{category.description}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {campaigns.map((c) => (
                    <Link
                        key={c.id}
                        to={`/campaign/${c.id}`}
                        className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                    >
                        {c.urgency !== 'normal' && (
                            <div className="text-xs mb-2 text-orange-400">
                                {c.urgency}
                            </div>
                        )}

                        <div className="font-medium">{c.title}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryGrid;
