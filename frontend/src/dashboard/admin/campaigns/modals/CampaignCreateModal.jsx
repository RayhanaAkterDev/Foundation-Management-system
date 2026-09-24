import React, { useState } from "react";

import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  FileText,
  ImagePlus,
  MapPin,
  Target,
  X,
} from "lucide-react";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  scope: "global",
  district: "",
  location: "",
  affected_areas: "",
  target_amount: "",
  start_date: "",
  end_date: "",
  cover_image: null,
};

const CATEGORIES = [
  "Education",
  "Healthcare",
  "Food Assistance",
  "Shelter",
  "Livelihood",
  "Disaster Relief",
  "Other",
];

const CampaignCreateModal = ({
  loading = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setValidationError("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    setForm((current) => ({
      ...current,
      cover_image: file,
    }));

    setValidationError("");
  };

  const validate = () => {
    if (!form.title.trim()) {
      return "Campaign title is required.";
    }

    if (!form.description.trim()) {
      return "Campaign description is required.";
    }

    if (!form.category) {
      return "Please select a campaign category.";
    }

    if (!form.location.trim()) {
      return "Campaign location is required.";
    }

    if (!form.target_amount) {
      return "Target amount is required.";
    }

    const targetAmount = Number(form.target_amount);

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      return "Target amount must be greater than zero.";
    }

    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);

      if (end < start) {
        return "End date cannot be earlier than the start date.";
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validate();

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    setValidationError("");

    await onConfirm?.({
      type: "global_situation",
      help_request_id: null,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      scope: "global",
      district: form.district.trim(),
      location: form.location.trim(),
      affected_areas: form.affected_areas.trim(),
      target_amount: form.target_amount,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      cover_image: form.cover_image,
    });
  };

  const inputClass =
    "h-12.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-3 focus:ring-primary/10 sm:h-13";

  const labelClass = "mb-2 block text-[11px] font-semibold text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-hidden bg-slate-950/55 px-2 py-2 backdrop-blur-sm sm:px-4 sm:py-4 md:px-5 md:py-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 flex h-full max-h-[96dvh] w-full max-w-240 min-w-0 overflow-hidden rounded-xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)] sm:h-auto sm:max-h-[94dvh] sm:rounded-2xl">
        {/* Left panel */}
        <aside className="relative hidden shrink-0 overflow-hidden bg-primary lg:block lg:w-64 xl:w-72">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/8" />
          <div className="absolute -bottom-44 -left-44 h-104 w-104 rounded-full border border-white/6" />

          <div className="relative flex h-full flex-col px-8 py-8">
            <div>
              <p className="text-[11px] font-bold tracking-wide text-white">
                Stand For People
              </p>

              <p className="mt-1 text-[10px] text-white/45">
                Humanitarian coordination
              </p>
            </div>

            <div className="my-auto">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-px w-7 bg-accent" />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                  Global response
                </span>
              </div>

              <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-white xl:text-[38px]">
                Respond to
                <br />
                situations
                <br />
                <span className="text-accent">that matter.</span>
              </h2>

              <p className="mt-6 max-w-52 text-[12px] leading-6 text-white/50">
                Create a coordinated campaign for a wider humanitarian
                situation.
              </p>
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="text-[10px] font-medium text-white/40">
                Global humanitarian campaign
              </p>
            </div>
          </div>
        </aside>

        {/* Right side */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f8faf9]">
          {/* Header */}
          <header className="shrink-0 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6 md:px-9">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-primary">
                    New campaign
                  </span>
                </div>

                <h3 className="text-[23px] font-bold tracking-[-0.035em] text-slate-950 sm:text-[27px]">
                  Create a global campaign
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                aria-label="Close modal">
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="px-5 py-6 sm:px-7 md:px-9 md:py-7">
                {/* Error */}
                {(validationError || error) && (
                  <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                    <p className="text-xs font-medium leading-5 text-red-700">
                      {validationError || error}
                    </p>
                  </div>
                )}

                {/* Campaign details */}
                <section>
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
                      01
                    </span>

                    <h4 className="text-sm font-bold text-slate-900">
                      Campaign details
                    </h4>

                    <Target className="ml-auto h-4 w-4 text-accent" />
                  </div>

                  <div>
                    <label htmlFor="campaign-title" className={labelClass}>
                      Campaign title
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="campaign-title"
                      type="text"
                      value={form.title}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      placeholder="Enter campaign title"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="campaign-category" className={labelClass}>
                        Category
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <select
                          id="campaign-category"
                          value={form.category}
                          onChange={(event) =>
                            updateField("category", event.target.value)
                          }
                          disabled={loading}
                          className={`${inputClass} appearance-none pr-10`}>
                          <option value="">Select category</option>

                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="campaign-scope" className={labelClass}>
                        Scope
                      </label>

                      <div className="relative">
                        <select
                          id="campaign-scope"
                          value="global"
                          disabled
                          className={`${inputClass} cursor-not-allowed appearance-none border-primary/20 bg-primary/5 pr-10 font-semibold text-primary`}>
                          <option value="global">Global</option>
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="campaign-description"
                      className={labelClass}>
                      Description
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                      id="campaign-description"
                      value={form.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      rows={6}
                      placeholder="Describe the humanitarian situation and intended response..."
                      disabled={loading}
                      className="min-h-35 w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3.5 text-[13px] font-medium leading-6 text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-3 focus:ring-primary/10 sm:min-h-38"
                    />
                  </div>
                </section>

                {/* Location */}
                <section className="mt-8">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
                      02
                    </span>

                    <h4 className="text-sm font-bold text-slate-900">
                      Location & impact
                    </h4>

                    <MapPin className="ml-auto h-4 w-4 text-accent" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="campaign-district" className={labelClass}>
                        District
                      </label>

                      <input
                        id="campaign-district"
                        type="text"
                        value={form.district}
                        onChange={(event) =>
                          updateField("district", event.target.value)
                        }
                        placeholder="e.g. Multiple districts"
                        disabled={loading}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="campaign-location" className={labelClass}>
                        Location
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="campaign-location"
                          type="text"
                          value={form.location}
                          onChange={(event) =>
                            updateField("location", event.target.value)
                          }
                          placeholder="Affected region or area"
                          disabled={loading}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="campaign-affected-areas"
                      className={labelClass}>
                      Affected areas
                    </label>

                    <textarea
                      id="campaign-affected-areas"
                      value={form.affected_areas}
                      onChange={(event) =>
                        updateField("affected_areas", event.target.value)
                      }
                      rows={3}
                      placeholder="Describe affected communities or areas..."
                      disabled={loading}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3.5 text-[13px] font-medium leading-6 text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-3 focus:ring-primary/10"
                    />
                  </div>
                </section>

                {/* Funding */}
                <section className="mt-8">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
                      03
                    </span>

                    <h4 className="text-sm font-bold text-slate-900">
                      Funding & schedule
                    </h4>

                    <CalendarDays className="ml-auto h-4 w-4 text-primary/50" />
                  </div>

                  <div>
                    <label htmlFor="campaign-target" className={labelClass}>
                      Target amount
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="campaign-target"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.target_amount}
                      onChange={(event) =>
                        updateField("target_amount", event.target.value)
                      }
                      placeholder="Enter fundraising target"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="campaign-start-date"
                        className={labelClass}>
                        Start date
                      </label>

                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="campaign-start-date"
                          type="date"
                          value={form.start_date}
                          onChange={(event) =>
                            updateField("start_date", event.target.value)
                          }
                          disabled={loading}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="campaign-end-date" className={labelClass}>
                        End date
                      </label>

                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="campaign-end-date"
                          type="date"
                          value={form.end_date}
                          onChange={(event) =>
                            updateField("end_date", event.target.value)
                          }
                          disabled={loading}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Image */}
                <section className="mt-8">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
                      04
                    </span>

                    <h4 className="text-sm font-bold text-slate-900">
                      Campaign image
                    </h4>

                    <ImagePlus className="ml-auto h-4 w-4 text-primary/50" />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-4 transition-colors hover:border-primary/40 hover:bg-primary/2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                      <ImagePlus className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {form.cover_image
                          ? form.cover_image.name
                          : "Choose a cover image"}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        JPG, PNG or WebP
                      </p>
                    </div>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                </section>
              </div>
            </div>

            {/* Footer */}
            <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-3.5 sm:px-7 md:px-9">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-xs font-bold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Create Campaign
                    </>
                  )}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreateModal;
