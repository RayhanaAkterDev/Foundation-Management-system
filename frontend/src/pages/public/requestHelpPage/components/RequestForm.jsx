import React, { useState } from 'react';
import Button from '@/components/Button';

const RequestForm = ({ setSuccess }) => {
    const [form, setForm] = useState({
        description: '',
        name: '',
        phone: '',
        location: '',
        urgencyHint: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.description.trim()) {
            setError({
                description: 'Please describe your situation',
            });
            return;
        }

        setError({});
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1200);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                w-full
                bg-surface
                border-l border-border
                p-5 sm:p-7 lg:p-10
            "
        >
            {/* HEADER */}
            <div>
                <h2
                    className="
                    text-xl sm:text-2xl lg:text-3xl
                    font-semibold text-text-primary
                "
                >
                    Tell us what happened
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                    Your request will be reviewed carefully and matched with
                    support.
                </p>
            </div>

            {/* STORY */}
            <div className="mt-6 sm:mt-8 lg:mt-10">
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={window.innerWidth < 640 ? 6 : 9}
                    placeholder="Describe your situation..."
                    className="
                        w-full
                        text-sm
                        leading-7
                        bg-background
                        rounded-xl sm:rounded-2xl
                        p-4 sm:p-5
                        border border-border
                        focus:outline-none
                        focus:border-primary
                        focus:ring-2 focus:ring-primary/10
                    "
                />

                {error.description && (
                    <p className="mt-2 text-sm text-accent">
                        {error.description}
                    </p>
                )}
            </div>

            {/* OPTIONAL */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {['name', 'phone', 'location'].map((field) => (
                    <input
                        key={field}
                        name={field}
                        placeholder={field}
                        value={form[field]}
                        onChange={handleChange}
                        className="
                            h-11 sm:h-12
                            px-3 sm:px-4
                            rounded-xl
                            border border-border
                            bg-background
                            text-sm
                            focus:outline-none
                            focus:border-primary
                            focus:ring-2 focus:ring-primary/10
                        "
                    />
                ))}

                <select
                    name="urgencyHint"
                    value={form.urgencyHint}
                    onChange={handleChange}
                    className="
                        h-11 sm:h-12
                        px-3 sm:px-4
                        rounded-xl
                        border border-border
                        bg-background
                        text-sm
                    "
                >
                    <option value="">Urgency</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                </select>
            </div>

            {/* FOOTER */}
            <div
                className="
                mt-8 sm:mt-10
                pt-5 sm:pt-6
                border-t border-border
                flex flex-col sm:flex-row
                gap-4 sm:gap-0
                sm:items-center sm:justify-between
            "
            >
                <p className="text-xs text-text-secondary">
                    Secure & confidential review process
                </p>

                <Button disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </div>
        </form>
    );
};

export default RequestForm;
