import { useState } from 'react';

const initial = {
    name: '',
    email: '',
    location: '',
    message: '',
};

const VolunteerForm = () => {
    const [form, setForm] = useState(initial);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <section className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-center text-2xl md:text-4xl font-semibold">
                Apply to become a volunteer
            </h2>

            <form className="space-y-5">
                <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:outline-none"
                />

                <input
                    name="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:outline-none"
                />

                <input
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:outline-none"
                />

                <textarea
                    name="message"
                    placeholder="Why do you want to volunteer?"
                    rows={4}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:outline-none"
                />

                <button className="w-full py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition">
                    Submit Application
                </button>
            </form>
        </section>
    );
};

export default VolunteerForm;
