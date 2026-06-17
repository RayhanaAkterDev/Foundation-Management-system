const levels = [
    { label: 'Low', desc: 'Few days' },
    { label: 'Medium', desc: '24–48h' },
    { label: 'High', desc: 'Immediate' },
];

const UrgencySelector = ({ form, setForm, error }) => {
    return (
        <div>
            <h2 className="font-semibold mb-4">Urgency</h2>

            <div className="grid md:grid-cols-3 gap-3">
                {levels.map((l) => (
                    <button
                        key={l.label}
                        type="button"
                        onClick={() =>
                            setForm({
                                ...form,
                                urgency: l.label,
                            })
                        }
                        className={`p-4 border rounded-xl text-left ${
                            form.urgency === l.label
                                ? 'bg-primary text-white'
                                : 'border-border'
                        }`}
                    >
                        <p>{l.label}</p>
                        <p className="text-xs opacity-70">{l.desc}</p>
                    </button>
                ))}
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default UrgencySelector;
