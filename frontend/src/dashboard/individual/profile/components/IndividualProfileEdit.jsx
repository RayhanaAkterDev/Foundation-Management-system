import React from 'react';
import {
    ArrowLeft,
    CalendarDays,
    Mail,
    MapPin,
    Save,
    UserRound,
} from 'lucide-react';

const inputClass =
    'min-h-11 w-full min-w-0 border border-[#303A47] bg-[#151B24] px-4 py-2.5 text-[14px] text-[#EEF1F5] outline-none transition-colors placeholder:text-[#697586] hover:border-[#465261] focus:border-[#8493A6] focus:ring-0 disabled:opacity-50';
const panel = 'border border-[#252D38] bg-[#0E1219]';

function Field({ label, name, value, onChange, className = '', ...props }) {
    return (
        <div className={`min-w-0 ${className}`}>
            <label
                htmlFor={`individual-${name}`}
                className="mb-2 block text-[14px] font-medium text-[#B8C0CA]"
            >
                {label}
            </label>
            <input
                id={`individual-${name}`}
                name={name}
                value={value ?? ''}
                onChange={(e) => onChange(name, e.target.value)}
                className={inputClass}
                {...props}
            />
        </div>
    );
}

export default function IndividualProfileEdit({
    form,
    memberSince,
    saving,
    onChange,
    onSave,
    onCancel,
}) {
    const joined = memberSince ? new Date(memberSince) : null;
    const joinedText =
        joined && !Number.isNaN(joined.getTime())
            ? joined.toLocaleDateString('en-BD', {
                  month: 'long',
                  year: 'numeric',
              })
            : 'Not available';
    return (
        <div className="space-y-5 pb-8 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-[21px] font-semibold text-[#EEF1F5]">
                        Edit personal profile
                    </h2>
                    <p className="mt-1 text-[14px] text-[#8792A1]">
                        Update your contact and personal information.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="inline-flex min-h-10 items-center gap-2 border border-[#394555] px-4 text-[13px] font-medium text-[#B8C0CA] transition-colors hover:bg-[#1A222D] disabled:opacity-50"
                >
                    <ArrowLeft size={15} /> Back to profile
                </button>
            </div>
            <form
                onSubmit={onSave}
                className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)] xl:items-start"
            >
                <div className="space-y-5">
                    <section className={`${panel} p-5 sm:p-7`}>
                        <div className="mb-6 border-b border-[#29323E] pb-5">
                            <h3 className="text-[18px] font-semibold text-[#EEF1F5]">
                                Basic information
                            </h3>
                            <p className="mt-1 text-[14px] text-[#8792A1]">
                                The details associated with your account.
                            </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Full name"
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                required
                                placeholder="Your full name"
                            />
                            <Field
                                label="Email address"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={onChange}
                                required
                                placeholder="name@example.com"
                            />
                            <Field
                                label="Phone number"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                value={form.phone}
                                onChange={(name, value) =>
                                    onChange(
                                        name,
                                        value.replace(/\D/g, '').slice(0, 11),
                                    )
                                }
                                placeholder="01XXXXXXXXX"
                                minLength={11}
                                maxLength={11}
                                pattern="01[0-9]{9}"
                                title="Enter exactly 11 digits starting with 01"
                            />
                            <Field
                                label="Date of birth"
                                name="date_of_birth"
                                type="date"
                                max={new Date().toISOString().slice(0, 10)}
                                value={form.date_of_birth}
                                onChange={onChange}
                            />
                        </div>
                    </section>
                    <section className={`${panel} p-5 sm:p-7`}>
                        <div className="mb-6 border-b border-[#29323E] pb-5">
                            <h3 className="text-[18px] font-semibold text-[#EEF1F5]">
                                Location details
                            </h3>
                            <p className="mt-1 text-[14px] text-[#8792A1]">
                                Your district and address.
                            </p>
                        </div>
                        <div className="space-y-5">
                            <Field
                                label="District"
                                name="district"
                                value={form.district}
                                onChange={onChange}
                                placeholder="Enter your district"
                            />
                            <div>
                                <label
                                    htmlFor="individual-address"
                                    className="mb-2 block text-[14px] font-medium text-[#B8C0CA]"
                                >
                                    Address
                                </label>
                                <textarea
                                    id="individual-address"
                                    rows={4}
                                    value={form.address ?? ''}
                                    onChange={(e) =>
                                        onChange('address', e.target.value)
                                    }
                                    placeholder="Your address"
                                    className={`${inputClass} resize-y leading-7`}
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <aside className="space-y-5">
                    <section className={`${panel} p-5 sm:p-7`}>
                        <h3 className="text-[17px] font-semibold text-[#EEF1F5]">
                            Account overview
                        </h3>
                        <div className="mt-5 space-y-5 border-t border-[#29323E] pt-5">
                            <div className="flex items-start gap-3">
                                <UserRound
                                    size={17}
                                    className="mt-0.5 text-[#8792A1]"
                                />
                                <div>
                                    <p className="text-[13px] text-[#8792A1]">
                                        Account type
                                    </p>
                                    <p className="mt-1 text-[14px] text-[#EEF1F5]">
                                        Individual
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CalendarDays
                                    size={17}
                                    className="mt-0.5 text-[#8792A1]"
                                />
                                <div>
                                    <p className="text-[13px] text-[#8792A1]">
                                        Member since
                                    </p>
                                    <p className="mt-1 text-[14px] text-[#EEF1F5]">
                                        {joinedText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className={`${panel} p-5 sm:p-7`}>
                        <div className="flex items-start gap-3 text-[#8792A1]">
                            <Mail size={18} className="mt-0.5 shrink-0" />
                            <p className="text-[13px] leading-6">
                                Changing your email address requires
                                verification. You will be signed out after
                                saving a new email.
                            </p>
                        </div>
                    </section>
                    <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-[#465261] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#586678] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={16} />{' '}
                            {saving ? 'Saving changes...' : 'Save changes'}
                        </button>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={onCancel}
                            className="inline-flex min-h-11 items-center justify-center border border-[#394555] px-5 text-[14px] font-medium text-[#B8C0CA] transition-colors hover:bg-[#1A222D] disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </aside>
            </form>
        </div>
    );
}
