import React from 'react';
import {
    ArrowLeft,
    Save,
    Upload,
    Building2,
    Check,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import {
    focusAreaOptions,
    communityOptions,
    teamSizeOptions,
    activityOptions,
    toArray,
    getStatusLabel,
} from '../utils/orgProfileUtils';

const input =
    'w-full min-w-0 border border-[#303A47] bg-[#151B24] px-4 py-3 text-[14px] text-[#EEF1F5] outline-none transition-colors placeholder:text-[#697586] hover:border-[#465261] focus:border-[#8493A6] disabled:opacity-50';
const panel = 'border border-[#252D38] bg-[#0E1219] p-5 sm:p-7';
function Field({ label, name, value, onChange, ...rest }) {
    return (
        <label className="block min-w-0">
            <span className="mb-2 block text-[14px] font-medium text-[#B8C0CA]">
                {label}
            </span>
            <input
                name={name}
                value={value ?? ''}
                onChange={(e) => onChange(name, e.target.value)}
                className={input}
                {...rest}
            />
        </label>
    );
}
function Section({ title, children, description }) {
    return (
        <section className={panel}>
            <div className="mb-6">
                <h3 className="text-[18px] font-semibold text-[#EEF1F5]">
                    {title}
                </h3>
                {description && (
                    <p className="mt-1 text-[14px] text-[#8792A1]">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </section>
    );
}
function Choices({ options, value, onChange }) {
    const selected = toArray(value);
    const known = new Set(options.map((x) => x.value));
    const all = [
        ...selected
            .filter((x) => !known.has(x))
            .map((x) => ({ value: x, label: x })),
        ...options,
    ];
    return (
        <div className="grid gap-2 sm:grid-cols-2">
            {all.map((option) => {
                const active = selected.includes(option.value);
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                            onChange(
                                active
                                    ? selected.filter((x) => x !== option.value)
                                    : [...selected, option.value],
                            )
                        }
                        className={`flex min-h-11 items-center gap-3 border px-3.5 py-2.5 text-left text-[14px] transition-colors ${active ? 'border-[#586678] bg-[#1D2632] text-[#EEF1F5]' : 'border-[#303A47] bg-[#151B24] text-[#B8C0CA] hover:border-[#586678] hover:bg-[#1A222D]'}`}
                    >
                        <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center border ${active ? 'border-[#8493A6] bg-[#8493A6] text-white' : 'border-[#465261] text-transparent'}`}
                        >
                            <Check size={13} />
                        </span>
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
function ImageControl({ field, label, image, uploadingImage, onUploadImage }) {
    const busy = Boolean(uploadingImage);
    const isBanner = field === 'banner';
    return (
        <div className="min-w-0">
            <p className="mb-3 text-[14px] font-medium text-[#B8C0CA]">
                {label}
            </p>
            <div
                className={`flex items-center justify-center overflow-hidden border border-[#303A47] bg-[#151B24] ${isBanner ? 'h-36' : 'h-36'}`}
            >
                {image ? (
                    <img
                        src={image}
                        alt={label}
                        className={
                            isBanner
                                ? 'h-full w-full object-cover'
                                : 'h-24 w-24 object-cover'
                        }
                    />
                ) : (
                    <Building2 size={30} className="text-[#8792A1]" />
                )}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12px] text-[#8792A1]">
                    JPG, PNG, WebP · Max 5 MB
                </span>
                <label
                    className={`inline-flex min-h-10 items-center gap-2 border border-[#394555] bg-[#1A222D] px-3.5 text-[13px] font-medium text-[#EEF1F5] ${busy ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[#586678] hover:bg-[#1D2632]'}`}
                >
                    <Upload size={15} />
                    {uploadingImage === field ? 'Uploading...' : 'Change image'}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={busy}
                        className="sr-only"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUploadImage(field, file);
                            e.target.value = '';
                        }}
                    />
                </label>
            </div>
        </div>
    );
}
export default function OrgProfileEdit({
    form,
    profile,
    saving,
    onChange,
    onSave,
    onCancel,
    onUploadImage,
    uploadingImage,
    imageUploadError,
    imageUploadSuccess,
}) {
    const busy = saving || Boolean(uploadingImage);
    return (
        <div className="space-y-5 pb-8 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-[21px] font-semibold text-[#EEF1F5]">
                        Edit organization profile
                    </h2>
                    <p className="mt-1 text-[14px] text-[#8792A1]">
                        Update your organization's information and appearance.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={busy}
                    className="inline-flex min-h-10 items-center gap-2 border border-[#394555] px-4 text-[14px] text-[#B8C0CA] hover:bg-[#1A222D] disabled:opacity-50"
                >
                    <ArrowLeft size={16} />
                    Back to profile
                </button>
            </div>
            <Section title="Profile appearance">
                <div className="grid gap-7 lg:grid-cols-2">
                    <ImageControl
                        field="photo"
                        label="Organization logo"
                        image={profile?.photo ?? profile?.user?.photo}
                        uploadingImage={uploadingImage}
                        onUploadImage={onUploadImage}
                    />
                    <ImageControl
                        field="banner"
                        label="Cover banner"
                        image={profile?.banner}
                        uploadingImage={uploadingImage}
                        onUploadImage={onUploadImage}
                    />
                </div>
                {imageUploadError && (
                    <p
                        role="alert"
                        className="mt-4 flex gap-2 text-[14px] text-red-300"
                    >
                        <AlertCircle size={17} />
                        {imageUploadError}
                    </p>
                )}
                {imageUploadSuccess && (
                    <p
                        role="status"
                        className="mt-4 flex gap-2 text-[14px] text-[#B8C0CA]"
                    >
                        <CheckCircle2 size={17} />
                        {imageUploadSuccess}
                    </p>
                )}
            </Section>
            <form onSubmit={onSave} className="space-y-5">
                <Section title="Organization information">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field
                            label="Organization name"
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            required
                        />
                        <Field
                            label="Contact email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            required
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
                            minLength={11}
                            maxLength={11}
                            pattern="01[0-9]{9}"
                            title="Enter exactly 11 digits starting with 01"
                            placeholder="01XXXXXXXXX"
                        />
                        <Field
                            label="Website"
                            name="website"
                            type="url"
                            value={form.website}
                            onChange={onChange}
                            placeholder="https://example.org"
                            pattern="https?://[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:[0-9]{1,5})?(/[^\s]*)?"
                            title="Enter a valid URL starting with http:// or https://"
                        />
                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-[14px] font-medium text-[#B8C0CA]">
                                Office address
                            </span>
                            <textarea
                                rows={3}
                                value={form.address ?? ''}
                                onChange={(e) =>
                                    onChange('address', e.target.value)
                                }
                                className={`${input} resize-y`}
                            />
                        </label>
                    </div>
                </Section>
                <Section title="Mission and purpose">
                    <label className="block">
                        <span className="mb-2 block text-[14px] font-medium text-[#B8C0CA]">
                            Mission statement
                        </span>
                        <textarea
                            rows={5}
                            value={form.mission ?? ''}
                            onChange={(e) =>
                                onChange('mission', e.target.value)
                            }
                            className={`${input} resize-y leading-7`}
                            placeholder="Describe your organization's mission..."
                        />
                    </label>
                </Section>
                <Section
                    title="Work and communities"
                    description="Define the causes you work on and the people you support."
                >
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <h4 className="mb-3 text-[14px] font-medium text-[#B8C0CA]">
                                Focus areas
                            </h4>
                            <Choices
                                options={focusAreaOptions}
                                value={form.focus_areas}
                                onChange={(v) => onChange('focus_areas', v)}
                            />
                        </div>
                        <div>
                            <h4 className="mb-3 text-[14px] font-medium text-[#B8C0CA]">
                                Communities served
                            </h4>
                            <Choices
                                options={communityOptions}
                                value={form.communities_served}
                                onChange={(v) =>
                                    onChange('communities_served', v)
                                }
                            />
                        </div>
                    </div>
                </Section>
                <Section title="Team and activities">
                    <div className="mb-7">
                        <h4 className="mb-3 text-[14px] font-medium text-[#B8C0CA]">
                            Team size
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {teamSizeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={
                                        form.team_size === option.value
                                    }
                                    onClick={() =>
                                        onChange(
                                            'team_size',
                                            form.team_size === option.value
                                                ? ''
                                                : option.value,
                                        )
                                    }
                                    className={`min-h-10 border px-4 text-[14px] transition-colors ${form.team_size === option.value ? 'border-[#586678] bg-[#1D2632] text-[#EEF1F5]' : 'border-[#303A47] bg-[#151B24] text-[#B8C0CA] hover:border-[#586678] hover:bg-[#1A222D]'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-[#29323E] pt-6">
                        <h4 className="mb-3 text-[14px] font-medium text-[#B8C0CA]">
                            Primary activities
                        </h4>
                        <Choices
                            options={activityOptions}
                            value={form.primary_activities}
                            onChange={(v) => onChange('primary_activities', v)}
                        />
                    </div>
                </Section>
                <section className={`${panel} flex flex-wrap gap-x-10 gap-y-4`}>
                    <div>
                        <p className="text-[13px] text-[#8792A1]">
                            Registration number
                        </p>
                        <p className="mt-1 text-[14px] text-[#EEF1F5]">
                            {profile?.registration_number || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[13px] text-[#8792A1]">
                            Organization type
                        </p>
                        <p className="mt-1 text-[14px] text-[#EEF1F5]">
                            {profile?.organization_type || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[13px] text-[#8792A1]">
                            Verification
                        </p>
                        <p className="mt-1 text-[14px] text-[#EEF1F5]">
                            {getStatusLabel(profile?.verification_status)}
                        </p>
                    </div>
                </section>
                <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#29323E] pt-5 sm:flex-row">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onCancel}
                        className="min-h-11 border border-[#394555] px-5 text-[14px] text-[#B8C0CA] hover:bg-[#1A222D] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#465261] px-6 text-[14px] font-semibold text-white hover:bg-[#586678] disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? 'Saving changes...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
