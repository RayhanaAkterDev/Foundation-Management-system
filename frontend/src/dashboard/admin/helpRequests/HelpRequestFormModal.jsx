import React, { useMemo, useState } from 'react';
import { X, Save, LoaderCircle } from 'lucide-react';

const EMPTY_FORM = {
    title: '',
    category: '',
    priority: 'normal',
    description: '',
    location: '',
    people_affected: '',
    needed_by: '',
    status: 'pending',
};

const HelpRequestFormModal = ({
    open,
    mode = 'add',
    loading = false,
    error = '',
    fieldErrors = {},
    request = null,
    onClose,
    onSubmit,
}) => {
    const isEdit = mode === 'edit';

    const initialForm = useMemo(() => {
        if (!isEdit || !request) {
            return EMPTY_FORM;
        }

        return {
            title: request.title || '',
            category: request.category || '',
            priority: request.priority || 'normal',
            description: request.description || '',
            location: request.location || '',
            people_affected: request.people_affected ?? '',
            needed_by: request.needed_by ? request.needed_by.slice(0, 10) : '',
            status: request.status || 'pending',
        };
    }, [isEdit, request]);

    const [form, setForm] = useState(initialForm);
    const [lastRequestId, setLastRequestId] = useState(request?.id ?? null);

    if (!open) {
        return null;
    }

    // Reinitialize only when a different request is opened.
    if (
        (request?.id ?? null) !== lastRequestId ||
        (!isEdit && lastRequestId !== null)
    ) {
        setLastRequestId(request?.id ?? null);
        setForm(initialForm);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
    };

    const getFieldError = (field) => {
        const value = fieldErrors?.[field];

        if (Array.isArray(value)) {
            return value[0];
        }

        return value || '';
    };

    const inputClass = (field) =>
        `mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
            getFieldError(field) ? 'border-red-300' : 'border-border'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            {isEdit ? 'Administration' : 'New request'}
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                            {isEdit ? 'Edit help request' : 'Add help request'}
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            {isEdit
                                ? 'Update the help request information below.'
                                : 'Create a help request for the platform.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="overflow-y-auto">
                    <div className="space-y-6 px-6 py-6">
                        {/* Error */}
                        {error && (
                            <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Basic information */}
                        <section>
                            <div className="mb-4">
                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                    Request information
                                </p>

                                <h3 className="mt-1 text-sm font-bold text-text-primary">
                                    Basic details
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="text-xs font-semibold text-text-primary"
                                    >
                                        Request title
                                    </label>

                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Enter request title"
                                        className={inputClass('title')}
                                    />

                                    {getFieldError('title') && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {getFieldError('title')}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className="text-xs font-semibold text-text-primary"
                                        >
                                            Category
                                        </label>

                                        <select
                                            id="category"
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            className={inputClass('category')}
                                        >
                                            <option value="">
                                                Select category
                                            </option>
                                            <option value="food">Food</option>
                                            <option value="medical">
                                                Medical
                                            </option>
                                            <option value="education">
                                                Education
                                            </option>
                                            <option value="shelter">
                                                Shelter
                                            </option>
                                            <option value="clothing">
                                                Clothing
                                            </option>
                                            <option value="emergency">
                                                Emergency
                                            </option>
                                            <option value="other">Other</option>
                                        </select>

                                        {getFieldError('category') && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {getFieldError('category')}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="priority"
                                            className="text-xs font-semibold text-text-primary"
                                        >
                                            Priority
                                        </label>

                                        <select
                                            id="priority"
                                            name="priority"
                                            value={form.priority}
                                            onChange={handleChange}
                                            className={inputClass('priority')}
                                        >
                                            <option value="low">Low</option>
                                            <option value="normal">
                                                Normal
                                            </option>
                                            <option value="high">High</option>
                                            <option value="urgent">
                                                Urgent
                                            </option>
                                        </select>

                                        {getFieldError('priority') && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {getFieldError('priority')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="text-xs font-semibold text-text-primary"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe the help needed..."
                                        className={`${inputClass(
                                            'description',
                                        )} resize-none`}
                                    />

                                    {getFieldError('description') && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {getFieldError('description')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Request details */}
                        <section className="border-t border-border pt-6">
                            <div className="mb-4">
                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                    Coordination details
                                </p>

                                <h3 className="mt-1 text-sm font-bold text-text-primary">
                                    Need information
                                </h3>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="location"
                                        className="text-xs font-semibold text-text-primary"
                                    >
                                        Location
                                    </label>

                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="Enter location"
                                        className={inputClass('location')}
                                    />

                                    {getFieldError('location') && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {getFieldError('location')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="people_affected"
                                        className="text-xs font-semibold text-text-primary"
                                    >
                                        People affected
                                    </label>

                                    <input
                                        id="people_affected"
                                        name="people_affected"
                                        type="number"
                                        min="1"
                                        value={form.people_affected}
                                        onChange={handleChange}
                                        placeholder="Number of people"
                                        className={inputClass(
                                            'people_affected',
                                        )}
                                    />

                                    {getFieldError('people_affected') && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {getFieldError('people_affected')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="needed_by"
                                        className="text-xs font-semibold text-text-primary"
                                    >
                                        Needed by
                                    </label>

                                    <input
                                        id="needed_by"
                                        name="needed_by"
                                        type="date"
                                        value={form.needed_by}
                                        onChange={handleChange}
                                        className={inputClass('needed_by')}
                                    />

                                    {getFieldError('needed_by') && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {getFieldError('needed_by')}
                                        </p>
                                    )}
                                </div>

                                {isEdit && (
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="text-xs font-semibold text-text-primary"
                                        >
                                            Status
                                        </label>

                                        <select
                                            id="status"
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className={inputClass('status')}
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="verified">
                                                Verified
                                            </option>
                                            <option value="assigned">
                                                Assigned
                                            </option>
                                            <option value="in_progress">
                                                In Progress
                                            </option>
                                            <option value="fulfilled">
                                                Fulfilled
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </select>

                                        {getFieldError('status') && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {getFieldError('status')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2.5 border-t border-border bg-surface-soft px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="inline-flex h-10 items-center rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    {isEdit ? 'Save Changes' : 'Create Request'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpRequestFormModal;
