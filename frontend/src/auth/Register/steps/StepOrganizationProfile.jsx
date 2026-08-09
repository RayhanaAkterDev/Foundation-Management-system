import React, { useRef } from 'react';
import { Phone, MapPin, Globe, FileText, Building2, Upload } from 'lucide-react';

const organizationTypes = [
  'NGO',
  'Foundation',
  'Charity',
  'Non-Profit Organization',
  'Social Enterprise',
  'Educational Institution',
  'Healthcare Organization',
  'Community Organization',
  'Other',
];

const FieldWrapper = ({ label, htmlFor, error, required, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-[#0f172a]">
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
  'h-12 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#0f172a] placeholder-[#6b7280] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20';
const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-200';

const StepOrganizationProfile = ({ formData, onChange, errors }) => {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const preview = URL.createObjectURL(file);
    onChange('organizationLogo', file);
    onChange('organizationLogoPreview', preview);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-[#0f172a] md:text-3xl">
          Tell us about your organization
        </h2>
        <p className="text-base text-[#6b7280]">
          Help us understand your organization so we can verify and support your work.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Phone */}
        <div>
          <FieldWrapper label="Phone" htmlFor="orgPhone" error={errors.phone} required>
            <div className="relative">
              <InputIcon icon={Phone} />
              <input
                id="orgPhone"
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

        {/* Organization Type */}
        <div>
          <FieldWrapper label="Organization Type" htmlFor="orgType" error={errors.organizationType} required>
            <div className="relative">
              <InputIcon icon={Building2} />
              <select
                id="orgType"
                value={formData.organizationType || ''}
                onChange={(e) => onChange('organizationType', e.target.value)}
                className={`${inputBase} appearance-none ${errors.organizationType ? inputError : ''}`}
              >
                <option value="" disabled>
                  Select type
                </option>
                {organizationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </FieldWrapper>
        </div>

        {/* Registration Number */}
        <div>
          <FieldWrapper
            label="Registration Number"
            htmlFor="regNumber"
            error={errors.registrationNumber}
            required
          >
            <div className="relative">
              <InputIcon icon={FileText} />
              <input
                id="regNumber"
                type="text"
                placeholder="Registration number"
                value={formData.registrationNumber || ''}
                onChange={(e) => onChange('registrationNumber', e.target.value)}
                className={`${inputBase} ${errors.registrationNumber ? inputError : ''}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Website — optional */}
        <div>
          <FieldWrapper label="Website" htmlFor="website" error={errors.website} required={false}>
            <div className="relative">
              <InputIcon icon={Globe} />
              <input
                id="website"
                type="url"
                placeholder="https://www.organization.org"
                value={formData.website || ''}
                onChange={(e) => onChange('website', e.target.value)}
                className={`${inputBase} ${errors.website ? inputError : ''}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <FieldWrapper label="Address" htmlFor="orgAddress" error={errors.address} required>
            <div className="relative">
              <InputIcon icon={MapPin} top="top-3.5" />
              <textarea
                id="orgAddress"
                rows={3}
                placeholder="Organization address"
                value={formData.address || ''}
                onChange={(e) => onChange('address', e.target.value)}
                className={`w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 pt-2.5 pb-2.5 text-sm text-[#0f172a] placeholder-[#6b7280] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 resize-none ${
                  errors.address ? inputError : ''
                }`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Organization Logo — optional */}
        <div className="md:col-span-2">
          <FieldWrapper
            label="Organization Logo"
            htmlFor="orgLogo"
            error={errors.organizationLogo}
            required={false}
          >
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-4 rounded-xl border border-dashed border-[#e5e7eb] bg-[#eef3f6]/40 p-4 text-left transition-colors hover:bg-[#eef3f6]"
            >
              {formData.organizationLogoPreview ? (
                <img
                  src={formData.organizationLogoPreview}
                  alt="Logo preview"
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white text-[#6b7280]">
                  <Building2 className="h-8 w-8" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#0f172a]">
                  {formData.organizationLogo?.name || 'Upload your logo'}
                </p>
                <p className="text-xs text-[#6b7280]">
                  {formData.organizationLogo ? 'Logo selected' : 'JPG or PNG, up to 5 MB'}
                </p>
              </div>
              <Upload className="h-5 w-5 shrink-0 text-[#6b7280]" />
            </button>
            <input
              ref={fileRef}
              id="orgLogo"
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

export default StepOrganizationProfile;
