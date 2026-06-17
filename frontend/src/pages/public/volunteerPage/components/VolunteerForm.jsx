import React, { useState } from 'react';
import Button from '@/components/Button';
import {
    TbHeartHandshake,
    TbUser,
    TbMail,
    TbPhone,
    TbMapPin,
    TbMessage2,
    TbCheck,
} from 'react-icons/tb';

const skillOptions = [
    'Food Distribution',
    'Medical Support',
    'Logistics',
    'Data Entry',
    'Field Work',
    'Communication',
    'Teaching',
    'Emergency Response',
];

const VolunteerForm = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        availability: '',
        message: '',
    });

    const [skills, setSkills] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const toggleSkill = (skill) => {
        setSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill],
        );
    };

    const validate = () => {
        if (!form.name.trim()) return 'Name is required';
        if (!form.email.includes('@')) return 'Valid email required';
        if (!form.phone.trim()) return 'Phone is required';
        if (!form.location.trim()) return 'Location is required';
        if (skills.length === 0) return 'Select at least one skill';
        if (!form.availability) return 'Select availability';
        if (!form.message.trim()) return 'Tell us why you want to volunteer';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const err = validate();
        if (err) {
            setError(err);
            return;
        }

        setSuccess(true);

        setForm({
            name: '',
            email: '',
            phone: '',
            location: '',
            availability: '',
            message: '',
        });

        setSkills([]);

        setTimeout(() => setSuccess(false), 5000);
    };

    return (
        <section className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-semibold">
                    Volunteer Application
                </h2>
                <p className="text-text-secondary mt-2">
                    Complete this short application and our team will review
                    your profile within 48–72 hours.
                </p>
            </div>

            {/* Success */}
            {success && (
                <div className="mb-8 flex items-start gap-3 border border-green-200 bg-green-50 px-5 py-4 rounded-2xl">
                    <TbCheck className="text-green-600 text-xl mt-0.5" />
                    <div>
                        <p className="font-medium text-green-700">
                            Application submitted successfully
                        </p>
                        <p className="text-sm text-green-600">
                            We’ll contact you soon with next steps.
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-8 border border-red-200 bg-red-50 px-5 py-4 rounded-2xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-10 border border-border rounded-3xl p-8 bg-white/40 backdrop-blur"
            >
                {/* SECTION 1: PERSONAL INFO */}
                <div>
                    <h3 className="text-lg font-semibold mb-6">
                        Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-5">
                        <Input
                            icon={<TbUser />}
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                        />

                        <Input
                            icon={<TbMail />}
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                        />

                        <Input
                            icon={<TbPhone />}
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                        />

                        <Input
                            icon={<TbMapPin />}
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="City / District"
                        />
                    </div>
                </div>

                {/* SECTION 2: SKILLS */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Skills & Interests
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {skillOptions.map((skill) => (
                            <button
                                type="button"
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`px-4 py-2 rounded-full border text-sm transition ${
                                    skills.includes(skill)
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-border hover:border-primary'
                                }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SECTION 3: AVAILABILITY */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Availability</h3>

                    <select
                        name="availability"
                        value={form.availability}
                        onChange={handleChange}
                        className="w-full border border-border rounded-xl px-4 py-3 bg-transparent outline-none focus:border-primary"
                    >
                        <option value="">Select Availability</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="remote">Remote Only</option>
                    </select>
                </div>

                {/* SECTION 4: MESSAGE */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Motivation</h3>

                    <div className="flex items-start gap-3 border border-border rounded-xl px-4 py-3 focus-within:border-primary">
                        <TbMessage2 className="mt-1 text-text-secondary" />
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Tell us why you want to volunteer and how you'd like to contribute..."
                            className="w-full bg-transparent outline-none resize-none"
                        />
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-border">
                    <p className="text-sm text-text-secondary">
                        Applications are reviewed within 48–72 hours.
                    </p>

                    <Button type="submit">
                        <TbHeartHandshake />
                        Submit Application
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default VolunteerForm;

/* Reusable Input Component */
const Input = ({ icon, ...props }) => {
    return (
        <div className="flex items-center gap-3 border border-border rounded-xl px-4 py-3 focus-within:border-primary transition">
            <span className="text-text-secondary">{icon}</span>
            <input {...props} className="w-full bg-transparent outline-none" />
        </div>
    );
};
