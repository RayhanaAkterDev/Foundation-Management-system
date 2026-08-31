import React, { useRef } from 'react';
import { Phone, MapPin, Calendar, Upload, UserCircle } from 'lucide-react';

const FieldWrapper = ({ label, htmlFor, error, required, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-text-primary">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
      {!required && <span className="ml-1 text-xs font-normal text-[#6b7280]">(optional)</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const InputIcon = ({ icon: Icon, top }) => (
  <Icon
    className={`absolute left-3 ${top || 'top-1/2 -translate-y-1/2'} h-4 w-4 text-[#6b7280] pointer-events-none`}
  />
);

const inputBase =
  'h-12 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-text-primary placeholder-[#6b7280] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20';
const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-200';

const StepIndividualProfile = ({ formData, onChange, errors }) => {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const preview = URL.createObjectURL(file);
    onChange('profilePhoto', file);
    onChange('profilePhotoPreview', preview);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
          Tell us about yourself
        </h2>
        <p className="text-base text-[#6b7280]">
          A few details to help us connect you with the right support and opportunities.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Phone */}
        <div>
          <FieldWrapper label="Phone" htmlFor="phone" error={errors.phone} required>
            <div className="relative">
              <InputIcon icon={Phone} />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 234 567 890"
                value={formData.phone || ''}
                onChange={(e) => onChange('phone', e.target.value)}
                className={`${inputBase} ${errors.phone ? inputError : ''}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* District */}
        <div>
          <FieldWrapper label="District" htmlFor="district" error={errors.district} required>
            <div className="relative">
              <InputIcon icon={MapPin} />
              <input
                id="district"
                type="text"
                placeholder="Your district"
                value={formData.district || ''}
                onChange={(e) => onChange('district', e.target.value)}
                className={`${inputBase} ${errors.district ? inputError : ''}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <FieldWrapper label="Address" htmlFor="address" error={errors.address} required>
            <div className="relative">
              <InputIcon icon={MapPin} top="top-3.5" />
              <textarea
                id="address"
                rows={3}
                placeholder="Your full address"
                value={formData.address || ''}
                onChange={(e) => onChange('address', e.target.value)}
                className={`w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 pt-2.5 pb-2.5 text-sm text-text-primary placeholder-[#6b7280] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none ${
                  errors.address ? inputError : ''
                }`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Date of Birth — optional */}
        <div>
          <FieldWrapper label="Date of Birth" htmlFor="dob" error={errors.dob} required={false}>
            <div className="relative">
              <InputIcon icon={Calendar} />
              <input
                id="dob"
                type="date"
                value={formData.dob || ''}
                onChange={(e) => onChange('dob', e.target.value)}
                className={`${inputBase} ${errors.dob ? inputError : ''}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Profile Photo — optional */}
        <div className="md:col-span-2">
          <FieldWrapper label="Profile Photo" htmlFor="profilePhoto" error={errors.profilePhoto} required={false}>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-4 rounded-xl border border-dashed border-[#e5e7eb] bg-[#eef3f6]/40 p-4 text-left transition-colors hover:bg-[#eef3f6]"
            >
              {formData.profilePhotoPreview ? (
                <img
                  src={formData.profilePhotoPreview}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-[#6b7280]">
                  <UserCircle className="h-8 w-8" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  {formData.profilePhoto?.name || 'Upload a photo'}
                </p>
                <p className="text-xs text-[#6b7280]">
                  {formData.profilePhoto ? 'Photo selected' : 'JPG or PNG, up to 5 MB'}
                </p>
              </div>
              <Upload className="h-5 w-5 shrink-0 text-[#6b7280]" />
            </button>
            <input
              ref={fileRef}
              id="profilePhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
};

export default StepIndividualProfile;
