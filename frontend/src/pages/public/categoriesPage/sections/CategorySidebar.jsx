import { useNavigate, useParams } from 'react-router-dom';
import { categories } from '@/data/categories';

const CategorySidebar = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const isActive = (id) => categoryId === id;

    return (
        <aside className="sticky top-32 w-full rounded-2xl bg-primary border border-white/10 p-4">
            {/* ALL */}
            <button
                onClick={() => navigate('/categories')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                    !categoryId ? 'bg-white/15 text-white' : 'text-white/70'
                }`}
            >
                All Campaigns
            </button>

            {/* URGENT */}
            <button
                onClick={() => navigate('/categories/urgent')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                    categoryId === 'urgent'
                        ? 'bg-white/15 text-white'
                        : 'text-white/70'
                }`}
            >
                Urgent Cases
            </button>

            <div className="my-3 h-px bg-white/10" />

            {/* CATEGORIES */}
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => navigate(`/categories/${cat.id}`)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                        isActive(cat.id)
                            ? 'bg-white/15 text-white'
                            : 'text-white/70'
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </aside>
    );
};

export default CategorySidebar;
