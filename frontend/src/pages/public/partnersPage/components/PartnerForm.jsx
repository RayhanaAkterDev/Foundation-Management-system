import { useState } from 'react';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import { TbCheck } from 'react-icons/tb';

const initial = {
    name: '',
    email: '',
    org: '',
    type: '',
    scale: '',
    message: '',
};

// MOVED OUTSIDE PartnerForm
// fixes react-hooks/static-components ESLint error
const ErrorText = ({ msg }) => {
    return msg ? (
        <p className="mt-1 text-[13px] leading-relaxed text-rose-400">{msg}</p>
    ) : null;
};

const PartnerForm = () => {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const validate = (data) => {
        const err = {};

        if (!data.name.trim()) err.name = 'Name is required';
        if (!data.email.includes('@')) err.email = 'Valid email is required';
        if (!data.org.trim()) err.org = 'Organization is required';
        if (!data.type) err.type = 'Select a partnership type';
        if (!data.scale) err.scale = 'Select operational scale';
        if (!data.message.trim()) err.message = 'Message cannot be empty';

        return err;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const vErrors = validate(form);
        setErrors(vErrors);

        setTouched({
            name: true,
            email: true,
            org: true,
            type: true,
            scale: true,
            message: true,
        });

        if (Object.keys(vErrors).length) return;

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setForm(initial);
        }, 1200);
    };

    const baseInput =
        'w-full bg-white border rounded-xl px-4 py-3 text-[15px] outline-none transition ' +
        'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

    const errorInput = 'border-red-200 focus:border-red-300 focus:ring-red-100';

    const normalInput = 'border-slate-200';

    const getClass = (name) =>
        `${baseInput} ${
            touched[name] && errors[name] ? errorInput : normalInput
        }`;

    return (
        <section className="section-gap">
            <div className="container-width">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
                    {/* LEFT SIDE — EXACT ORIGINAL */}

                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <SectionHeading
                            gap="lg"
                            align="left"
                            title="Build partnerships that reach people in real-world emergencies."
                            // headingSize="sectionHero"
                            headingClass="leading-14 tracking-tight"
                            description={
                                <>
                                    We connect organizations directly with field
                                    operations — disaster response, healthcare
                                    delivery, and coordinated relief systems.
                                    <div className="mt-6">
                                        <span className="flex items-center gap-2 text-[15px] sm:text-base leading-relaxed text-slate-700">
                                            <TbCheck />
                                            Real-time impact tracking
                                        </span>

                                        <span className="flex items-center gap-2 text-[15px] sm:text-base leading-relaxed text-slate-700">
                                            <TbCheck />
                                            Direct field coordination system
                                        </span>

                                        <span className="flex items-center gap-2 text-[15px] sm:text-base leading-relaxed text-slate-700">
                                            <TbCheck />
                                            AI-assisted need matching
                                        </span>
                                    </div>
                                </>
                            }
                            descriptionSize="hero"
                        />

                        <div className="mt-12 text-right flex items-center gap-4 justify-end">
                            <div className="w-10 h-px bg-primary/60" />
                            <p className="text-[15px] sm:text-base leading-relaxed italic font-fraunces text-primary">
                                “Partnership here is execution, not intention.”
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden"
                        >
                            {/* HEADER */}
                            <div className="px-6 sm:px-10 py-6 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                    Partnership Application
                                </h3>

                                <p className="text-sm sm:text-[15px] leading-relaxed text-text-secondary mt-2">
                                    Tell us about your organization and intent
                                </p>
                            </div>

                            {/* BODY */}
                            <div className="p-6 sm:p-10 space-y-6">
                                {/* ROW 1 */}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <input
                                            name="name"
                                            placeholder="Full name"
                                            value={form.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={getClass('name')}
                                        />
                                        <ErrorText
                                            msg={touched.name && errors.name}
                                        />
                                    </div>

                                    <div>
                                        <input
                                            name="email"
                                            placeholder="Email address"
                                            value={form.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={getClass('email')}
                                        />
                                        <ErrorText
                                            msg={touched.email && errors.email}
                                        />
                                    </div>
                                </div>

                                {/* ROW 2 */}
                                <div>
                                    <input
                                        name="org"
                                        placeholder="Organization / Institution"
                                        value={form.org}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getClass('org')}
                                    />
                                    <ErrorText
                                        msg={touched.org && errors.org}
                                    />
                                </div>

                                {/* ROW 3 */}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <select
                                            name="type"
                                            value={form.type}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={getClass('type')}
                                        >
                                            <option value="">
                                                Partnership type
                                            </option>
                                            <option value="funding">
                                                Funding Support
                                            </option>
                                            <option value="resource">
                                                Resource Support
                                            </option>
                                            <option value="tech">
                                                Technology Partnership
                                            </option>
                                            <option value="field">
                                                Field Operations
                                            </option>
                                        </select>
                                        <ErrorText
                                            msg={touched.type && errors.type}
                                        />
                                    </div>

                                    <div>
                                        <select
                                            name="scale"
                                            value={form.scale}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={getClass('scale')}
                                        >
                                            <option value="">
                                                Operational scale
                                            </option>
                                            <option value="local">Local</option>
                                            <option value="regional">
                                                Regional
                                            </option>
                                            <option value="national">
                                                National
                                            </option>
                                            <option value="global">
                                                Global
                                            </option>
                                        </select>
                                        <ErrorText
                                            msg={touched.scale && errors.scale}
                                        />
                                    </div>
                                </div>

                                {/* MESSAGE */}
                                <div>
                                    <textarea
                                        name="message"
                                        rows={6}
                                        placeholder="Describe your mission and collaboration intent"
                                        value={form.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getClass('message')}
                                    />
                                    <ErrorText
                                        msg={touched.message && errors.message}
                                    />
                                </div>

                                {/* ACTION */}
                                <div className="pt-6 border-t border-slate-100">
                                    <Button
                                        className="w-full py-3 text-base rounded-xl"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? 'Submitting...'
                                            : 'Submit Partnership Request'}
                                    </Button>

                                    {success && (
                                        <p className="mt-3 text-sm text-emerald-600 text-center leading-relaxed">
                                            Request submitted successfully.
                                            We’ll respond within 2–3 days.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerForm;
