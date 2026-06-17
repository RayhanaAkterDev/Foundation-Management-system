import React, { useState } from 'react';
import Button from '@/components/Button';
import RequestInput from './RequestInput';
import RequestTypeSelector from './RequestTypeSelector';
import UrgencySelector from './UrgencySelector';

const RequestForm = ({ setSuccess }) => {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        location: '',
        requestType: '',
        customRequestType: '',
        urgency: '',
        details: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const err = {};

        if (!form.name) err.name = 'Required';
        if (!form.phone) err.phone = 'Required';
        if (!form.location) err.location = 'Required';

        if (!form.requestType) err.requestType = 'Select type';

        if (form.requestType === 'Other' && !form.customRequestType) {
            err.customRequestType = 'Specify type';
        }

        if (!form.urgency) err.urgency = 'Select urgency';
        if (!form.details) err.details = 'Required';

        return err;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const err = validate();
        if (Object.keys(err).length) {
            setErrors(err);
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1000);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-10 p-8 border border-border rounded-3xl bg-white/50"
        >
            <div>
                <h2 className="text-lg font-semibold mb-4">Personal Info</h2>

                <div className="grid md:grid-cols-2 gap-5">
                    <RequestInput
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <RequestInput
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />

                    <RequestInput
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        error={errors.location}
                    />
                </div>
            </div>

            <RequestTypeSelector
                form={form}
                setForm={setForm}
                error={errors.requestType}
            />

            <UrgencySelector
                form={form}
                setForm={setForm}
                error={errors.urgency}
            />

            <div>
                <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    rows={6}
                    className="w-full border border-border rounded-xl px-4 py-3"
                    placeholder="Describe your situation..."
                />

                {errors.details && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.details}
                    </p>
                )}
            </div>

            <div className="flex justify-between items-center border-t pt-6">
                <p className="text-sm text-text-secondary">
                    Verified before processing
                </p>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </div>
        </form>
    );
};

export default RequestForm;
