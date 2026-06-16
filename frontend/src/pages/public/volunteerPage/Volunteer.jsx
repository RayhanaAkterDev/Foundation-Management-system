import React, { useState } from 'react';
import {
    TbHeartHandshake,
    TbUsers,
    TbMapPin,
    TbClock,
    TbShieldCheck,
    TbCheck,
    TbX,
} from 'react-icons/tb';

import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

const roles = [
    {
        id: 1,
        title: 'Field Support Volunteer',
        location: 'Dhaka, Bangladesh',
        time: 'Flexible',
        type: 'On-site',
        desc: 'Help distribute food, medicine, and emergency supplies in affected areas.',
    },
    {
        id: 2,
        title: 'Remote Coordinator',
        location: 'Remote',
        time: '2–3 hrs/day',
        type: 'Remote',
        desc: 'Assist in organizing requests and coordinating between donors and field teams.',
    },
    {
        id: 3,
        title: 'Medical Support Assistant',
        location: 'Khulna, Bangladesh',
        time: 'Part-time',
        type: 'On-site',
        desc: 'Support medical teams in organizing patient care and logistics.',
    },
];

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

const Volunteer = () => {
    const [selectedRole, setSelectedRole] = useState(null);

    // FORM STATE
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
        <div className="min-h-screen bg-surface pt-24 pb-20">
            <div className="container-width space-y-12">
                {/* HERO */}
                <Motion variant="fadeUp">
                    <SectionHeading
                        align="left"
                        badge={{
                            label: 'Volunteer Program',
                            variant: 'primary',
                            tone: 'solid',
                        }}
                        title={
                            <>
                                Be the reason
                                <span className="block text-primary">
                                    someone survives today
                                </span>
                            </>
                        }
                        description="Join Stand For People volunteers and directly support real humanitarian operations across Bangladesh."
                        headingSize="sectionHero"
                    />
                </Motion>

                {/* IMPACT STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Active Volunteers', value: '1,240+' },
                        { label: 'Districts Covered', value: '32+' },
                        { label: 'Families Helped', value: '18,000+' },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                        >
                            <div className="text-3xl font-bold text-primary">
                                {s.value}
                            </div>
                            <div className="text-sm text-text-secondary mt-1">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ROLES */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">
                        Available Volunteer Roles
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={`cursor-pointer rounded-2xl border p-6 transition-all ${
                                    selectedRole?.id === role.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/40'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-lg">
                                        {role.title}
                                    </h3>

                                    {selectedRole?.id === role.id && (
                                        <TbCheck className="text-primary" />
                                    )}
                                </div>

                                <p className="text-sm text-text-secondary mt-2">
                                    {role.desc}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <TbMapPin /> {role.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <TbClock /> {role.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <TbUsers /> {role.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* APPLY SECTION */}
                <div className="grid md:grid-cols-2 gap-10 items-start">
                    {/* FORM */}
                    <div className="relative rounded-3xl border border-border bg-white p-6">
                        {/* SUCCESS OVERLAY */}
                        {success && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl p-6 text-center">
                                <div className="space-y-3">
                                    <div className="text-2xl font-bold text-green-600">
                                        Application Submitted 🎉
                                    </div>
                                    <p className="text-sm text-text-secondary">
                                        Our volunteer coordination team will
                                        contact you soon.
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

                        {error && (
                            <div className="mb-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="Location"
                                className="w-full border border-border rounded-xl px-4 py-3"
                            />

                            {/* SKILLS */}
                            <div>
                                <p className="text-sm font-medium mb-2">
                                    Skills
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {skillOptions.map((skill) => (
                                        <button
                                            type="button"
                                            key={skill}
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-3 py-1 rounded-full text-xs border ${
                                                skills.includes(skill)
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-border'
                                            }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <select
                                name="availability"
                                value={form.availability}
                                onChange={handleChange}
                                className="w-full border border-border rounded-xl px-4 py-3"
                            >
                                <option value="">Availability</option>
                                <option value="full">Full Time</option>
                                <option value="part">Part Time</option>
                                <option value="remote">Remote</option>
                            </select>

                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Why do you want to volunteer?"
                                className="w-full border border-border rounded-xl px-4 py-3"
                            />

                            <Button type="submit" className="w-full">
                                <TbHeartHandshake />
                                Submit Application
                            </Button>

                            <p className="text-xs text-text-secondary text-center">
                                Applications reviewed in 48–72 hours
                            </p>
                        </form>
                    </div>

                    {/* INFO SECTION (UNCHANGED) */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border p-6 bg-white">
                            <div className="flex items-center gap-2 font-semibold">
                                <TbShieldCheck className="text-primary" />
                                Verified Volunteer Network
                            </div>
                            <p className="text-sm text-text-secondary mt-2">
                                All volunteers go through identity and
                                background verification.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border p-6 bg-white">
                            <div className="flex items-center gap-2 font-semibold">
                                <TbUsers className="text-primary" />
                                Real Field Impact
                            </div>
                            <p className="text-sm text-text-secondary mt-2">
                                You directly support emergency relief operations
                                and community aid.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border p-6 bg-white">
                            <div className="flex items-center gap-2 font-semibold">
                                <TbHeartHandshake className="text-primary" />
                                Flexible Participation
                            </div>
                            <p className="text-sm text-text-secondary mt-2">
                                Choose between remote, part-time, or field
                                volunteering roles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Volunteer;
