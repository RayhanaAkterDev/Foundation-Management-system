import { useState } from 'react';

const initial = {
    name: '',
    email: '',
    location: '',
    message: '',
};

const VolunteerForm = ({ focus }) => {
    const [form, setForm] = useState(initial);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ✅ basic validation logic
    const isValid =
        form.name.trim() !== '' &&
        form.email.trim() !== '' &&
        form.location.trim() !== '' &&
        form.message.trim() !== '' &&
        form.email.includes('@');

    const handleSubmit = (e) => {
        e.preventDefault();

        // extra safety check
        if (!isValid) return;

        setSubmitted(true);
        setForm(initial);
    };

    return (
        <section
            id="volunteer-form"
            className={`section-gap transition-colors duration-500 ${
                focus ? 'bg-primary/5' : ''
            }`}
        >
            <div className="container-width max-w-4xl">
                {/* SUCCESS STATE */}
                {submitted ? (
                    <div className="text-center space-y-6 py-10 sm:py-16">
                        <div className="text-5xl">✓</div>

                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            Application submitted successfully
                        </h2>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            Thank you for your interest in volunteering. We’ve
                            received your application and our team will contact
                            you soon.
                        </p>

                        <button
                            onClick={() => setSubmitted(false)}
                            className="
                                mt-6
                                px-6 py-3
                                rounded-full
                                bg-primary text-white
                                font-medium
                                hover:opacity-90
                                transition
                            "
                        >
                            Submit another response
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Heading */}
                        <div className="mb-10 sm:mb-14 text-center">
                            <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                                Join Us
                            </span>

                            <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                Apply to become a volunteer
                            </h2>

                            <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                Helping communities starts with a small step.
                                Tell us about yourself and we'll get back to you
                                soon.
                            </p>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8 sm:space-y-10 md:space-y-12"
                        >
                            <div className="border-b border-border pb-5 sm:pb-6">
                                <label className="block text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                                    Your name
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full bg-transparent text-base sm:text-lg py-1 placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>

                            <div className="border-b border-border pb-5 sm:pb-6">
                                <label className="block text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                                    Email address
                                </label>

                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="example@email.com"
                                    className="w-full bg-transparent text-base sm:text-lg py-1 placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>

                            <div className="border-b border-border pb-5 sm:pb-6">
                                <label className="block text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                                    Where are you located?
                                </label>

                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Dhaka, Bangladesh"
                                    className="w-full bg-transparent text-base sm:text-lg py-1 placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>

                            <div className="border-b border-border pb-5 sm:pb-6">
                                <label className="block text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                                    Why do you want to volunteer?
                                </label>

                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Share your motivation..."
                                    className="w-full bg-transparent text-base sm:text-lg resize-none placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>

                            <div className="pt-2 sm:pt-4 text-right">
                                <button
                                    type="submit"
                                    disabled={!isValid}
                                    className={`
                                        w-full sm:w-auto
                                        px-8 py-3
                                        rounded-full
                                        font-medium
                                        transition
                                        ${
                                            isValid
                                                ? 'bg-primary text-white hover:opacity-90'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
};

export default VolunteerForm;
