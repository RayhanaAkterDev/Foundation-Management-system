import React, { useState } from 'react';
import Button from '@/components/Button';
import { TbHeartHandshake, TbX } from 'react-icons/tb';

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

        setTimeout(() => {
            setSuccess(false);
        }, 5000);
    };

    return (
        <div className="relative rounded-3xl border border-border bg-white p-6">
            {/* SUCCESS OVERLAY */}
            {success && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl p-6 text-center">
                    <div className="space-y-3">
                        <div className="text-2xl font-bold text-green-600">
                            Application Submitted 🎉
                        </div>

                        <p className="text-sm text-text-secondary">
                            Thank you for joining Stand For People. Our
                            volunteer coordination team will contact you soon.
                        </p>

                        <Button
                            onClick={() => setSuccess(false)}
                            variant="outline"
                        >
                            <TbX />
                            Close
                        </Button>
                    </div>
                </div>
            )}

            <h3 className="text-lg font-semibold mb-4">
                Volunteer Application
            </h3>

            {error && <div className="mb-3 text-sm text-red-500">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* BASIC INFO */}
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border border-border rounded-xl px-4 py-3"
                />

                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full border border-border rounded-xl px-4 py-3"
                />

                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full border border-border rounded-xl px-4 py-3"
                />

                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Your Location (City / District)"
                    className="w-full border border-border rounded-xl px-4 py-3"
                />

                {/* SKILLS */}
                <div>
                    <p className="text-sm font-medium mb-2">
                        Select Your Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {skillOptions.map((skill) => (
                            <button
                                type="button"
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`px-3 py-1.5 rounded-full border text-xs transition ${
                                    skills.includes(skill)
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-border text-text-secondary hover:border-primary'
                                }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AVAILABILITY */}
                <select
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    className="w-full border border-border rounded-xl px-4 py-3"
                >
                    <option value="">Select Availability</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="remote">Remote Only</option>
                </select>

                {/* MOTIVATION */}
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Why do you want to volunteer?"
                    rows={4}
                    className="w-full border border-border rounded-xl px-4 py-3"
                />

                <Button type="submit" className="w-full">
                    <TbHeartHandshake />
                    Submit Application
                </Button>

                <p className="text-xs text-text-secondary text-center">
                    Applications are reviewed within 48–72 hours
                </p>
            </form>
        </div>
    );
};

export default VolunteerForm;
