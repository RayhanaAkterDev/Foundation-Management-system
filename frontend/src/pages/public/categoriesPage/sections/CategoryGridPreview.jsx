const CategoryGridPreview = ({ campaigns }) => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((c) => (
                <div
                    key={c.id}
                    className="p-5 rounded-xl bg-white/5 border border-white/10"
                >
                    {c.urgency === 'critical' && (
                        <div className="text-xs text-red-400 mb-2">
                            Critical
                        </div>
                    )}

                    {c.urgency === 'urgent' && (
                        <div className="text-xs text-orange-400 mb-2">
                            Urgent
                        </div>
                    )}

                    <div className="font-medium">{c.title}</div>

                    <div className="text-xs mt-2 text-white/50">
                        {c.category}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryGridPreview;
