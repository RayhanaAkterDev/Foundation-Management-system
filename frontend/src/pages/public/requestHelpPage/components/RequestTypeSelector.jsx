const types = [
    'Food Assistance',
    'Medical',
    'Clothing',
    'Financial',
    'Disaster',
    'Other',
];

const RequestTypeSelector = ({ form, setForm, error }) => {
    return (
        <div>
            <h2 className="font-semibold mb-4">Type of Help</h2>

            <div className="grid md:grid-cols-3 gap-3">
                {types.map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() =>
                            setForm({
                                ...form,
                                requestType: t,
                                customRequestType: '',
                            })
                        }
                        className={`p-3 border rounded-xl text-sm ${
                            form.requestType === t
                                ? 'bg-primary text-white border-primary'
                                : 'border-border'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {form.requestType === 'Other' && (
                <input
                    className="mt-3 w-full border border-border rounded-xl px-4 py-3"
                    placeholder="Specify type"
                    value={form.customRequestType}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            customRequestType: e.target.value,
                        })
                    }
                />
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default RequestTypeSelector;
