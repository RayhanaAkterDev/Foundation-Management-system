import React, { useState } from "react";
import {
  X,
  FileText,
  Tag,
  AlertOctagon,
  ArrowUp,
  Minus,
  MapPin,
  Map,
  Check,
  Save,
} from "lucide-react";

const CATEGORIES = [
  {
    value: "Education",
    label: "Education",
  },
  {
    value: "Healthcare",
    label: "Healthcare",
  },
  {
    value: "Food Assistance",
    label: "Food Assistance",
  },
  {
    value: "Shelter",
    label: "Shelter",
  },
  {
    value: "Livelihood",
    label: "Livelihood",
  },
  {
    value: "Disaster Relief",
    label: "Disaster Relief",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const URGENCY_LEVELS = [
  {
    value: "critical",
    label: "Critical",
    description: "Immediate attention required",
    icon: AlertOctagon,
    iconClass: "bg-red-50 text-red-600",
    activeClass: "border-red-200 bg-red-50/70",
    dotClass: "bg-red-500",
  },
  {
    value: "high",
    label: "High",
    description: "Needs attention soon",
    icon: ArrowUp,
    iconClass: "bg-orange-50 text-orange-600",
    activeClass: "border-orange-200 bg-orange-50/70",
    dotClass: "bg-orange-500",
  },
  {
    value: "normal",
    label: "Normal",
    description: "Standard assistance workflow",
    icon: Minus,
    iconClass: "bg-teal-50 text-teal-600",
    activeClass: "border-primary/25 bg-primary/[0.045]",
    dotClass: "bg-primary",
  },
];

const normalizeCategory = (value) => {
  if (!value) {
    return "";
  }

  const category = String(value).trim();

  const match = CATEGORIES.find(
    (item) => item.value.toLowerCase() === category.toLowerCase(),
  );

  return match ? match.value : "";
};

const normalizeUrgency = (value) => {
  const urgency = String(value ?? "")
    .trim()
    .toLowerCase();

  if (urgency === "critical" || urgency === "high" || urgency === "normal") {
    return urgency;
  }

  return "normal";
};

const EditModal = ({
  request,
  loading = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  if (!request) {
    return null;
  }

  return (
    <EditModalForm
      key={request.id}
      request={request}
      loading={loading}
      error={error}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

const EditModalForm = ({
  request,
  loading = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  const [title, setTitle] = useState(request.title ?? "");

  const [description, setDescription] = useState(request.description ?? "");

  const [category, setCategory] = useState(normalizeCategory(request.category));

  const [urgency, setUrgency] = useState(
    normalizeUrgency(request.urgency ?? request.priority),
  );

  const [district, setDistrict] = useState(request.district ?? "");

  const [address, setAddress] = useState(request.address ?? "");

  const [validationError, setValidationError] = useState("");

  const clearValidationError = () => {
    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setValidationError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedDistrict = district.trim();
    const trimmedAddress = address.trim();

    if (!trimmedTitle) {
      setValidationError("Title is required.");
      return;
    }

    if (!trimmedDescription) {
      setValidationError("Description is required.");
      return;
    }

    if (!category) {
      setValidationError("Please select a category.");
      return;
    }

    if (!urgency) {
      setValidationError("Please select an urgency level.");
      return;
    }

    if (!trimmedDistrict) {
      setValidationError("District is required.");
      return;
    }

    onConfirm?.({
      title: trimmedTitle,
      description: trimmedDescription,
      category,
      urgency,
      district: trimmedDistrict,
      address: trimmedAddress || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[3px] sm:p-6">
      <button
        type="button"
        aria-label="Close modal"
        onClick={!loading ? onClose : undefined}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
        {/* ============================================================
            HEADER
        ============================================================ */}
        <header className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-5 px-6 py-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <FileText size={18} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[17px] font-bold tracking-[-0.01em] text-slate-900">
                    Edit Help Request
                  </h2>

                  {request.id && (
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-500">
                      #{request.id}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-xs text-slate-500">
                  Update the request details and assistance priority.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close">
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* ============================================================
            FORM
        ============================================================ */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60">
          <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-7 sm:py-7">
            {/* ========================================================
                REQUEST INFORMATION
            ======================================================== */}
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                  <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-800">
                    Request information
                  </h3>
                </div>

                <p className="mt-1.5 pl-3.5 text-xs leading-5 text-slate-500">
                  Keep the request title, description, and category accurate for
                  review and coordination.
                </p>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label
                    htmlFor="edit-request-title"
                    className="mb-2 block text-xs font-semibold text-slate-700">
                    Request title
                  </label>

                  <input
                    id="edit-request-title"
                    type="text"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      clearValidationError();
                    }}
                    disabled={loading}
                    maxLength={255}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="edit-request-description"
                      className="text-xs font-semibold text-slate-700">
                      Description
                    </label>

                    <span className="text-[10px] font-medium tabular-nums text-slate-400">
                      {description.length}/1000
                    </span>
                  </div>

                  <textarea
                    id="edit-request-description"
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value.slice(0, 1000));
                      clearValidationError();
                    }}
                    disabled={loading}
                    rows={4}
                    maxLength={1000}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Category */}
                <div className="max-w-md">
                  <label
                    htmlFor="edit-request-category"
                    className="mb-2 block text-xs font-semibold text-slate-700">
                    Category
                  </label>

                  <div className="relative">
                    <select
                      id="edit-request-category"
                      value={category}
                      onChange={(event) => {
                        setCategory(event.target.value);
                        clearValidationError();
                      }}
                      disabled={loading}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 pr-10 text-sm font-medium text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100">
                      <option value="">Select category</option>

                      {CATEGORIES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <Tag
                      size={15}
                      strokeWidth={2}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================
                DIVIDER
            ======================================================== */}
            <div className="my-7 border-t border-slate-200" />

            {/* ========================================================
                URGENCY
            ======================================================== */}
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                  <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-800">
                    Assistance priority
                  </h3>
                </div>

                <p className="mt-1.5 pl-3.5 text-xs leading-5 text-slate-500">
                  Set how urgently this request should be handled.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {URGENCY_LEVELS.map((item) => {
                  const selected = urgency === item.value;
                  const Icon = item.icon;

                  return (
                    <label
                      key={item.value}
                      className={`relative flex min-h-[112px] cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                        selected
                          ? item.activeClass
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      } ${loading ? "cursor-not-allowed opacity-60" : ""}`}>
                      <input
                        type="radio"
                        name="edit-urgency"
                        value={item.value}
                        checked={selected}
                        onChange={(event) => {
                          setUrgency(event.target.value);
                          clearValidationError();
                        }}
                        disabled={loading}
                        className="sr-only"
                      />

                      <div className="flex items-start justify-between">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconClass}`}>
                          <Icon size={16} strokeWidth={2.2} />
                        </span>

                        <span
                          className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                            selected
                              ? "border-primary bg-primary"
                              : "border-slate-300 bg-white"
                          }`}>
                          {selected && (
                            <Check
                              size={11}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}
                        </span>
                      </div>

                      <div className="mt-auto pt-3">
                        <p className="text-xs font-bold text-slate-900">
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      {selected && (
                        <span
                          className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${item.dotClass}`}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </section>

            {/* ========================================================
                DIVIDER
            ======================================================== */}
            <div className="my-7 border-t border-slate-200" />

            {/* ========================================================
                LOCATION
            ======================================================== */}
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                  <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-800">
                    Assistance location
                  </h3>
                </div>

                <p className="mt-1.5 pl-3.5 text-xs leading-5 text-slate-500">
                  Update where support is currently needed.
                </p>
              </div>

              <div className="grid gap-5 grid-cols-1">
                {/* District */}
                <div>
                  <label
                    htmlFor="edit-request-district"
                    className="mb-2 block text-xs font-semibold text-slate-700">
                    District
                  </label>

                  <div className="relative">
                    <Map
                      size={15}
                      strokeWidth={2}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="edit-request-district"
                      type="text"
                      value={district}
                      onChange={(event) => {
                        setDistrict(event.target.value);
                        clearValidationError();
                      }}
                      disabled={loading}
                      maxLength={255}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="edit-request-address"
                    className="mb-2 block text-xs font-semibold text-slate-700">
                    Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={15}
                      strokeWidth={2}
                      className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
                    />

                    <textarea
                      id="edit-request-address"
                      value={address}
                      onChange={(event) => {
                        setAddress(event.target.value);
                        clearValidationError();
                      }}
                      disabled={loading}
                      rows={3}
                      maxLength={1000}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================
                ERROR
            ======================================================== */}
            {(validationError || error) && (
              <div className="mt-7 flex items-start gap-3 border-l-2 border-red-500 bg-red-50 px-4 py-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                <p className="text-xs font-medium leading-5 text-red-700">
                  {validationError || error}
                </p>
              </div>
            )}
          </div>

          {/* ==========================================================
              FOOTER
          ========================================================== */}
          <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-3.5 sm:px-7">
            <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
              <p className="hidden text-[10px] text-slate-400 sm:block">
                Changes will update this help request.
              </p>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50">
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
                  <Save size={15} strokeWidth={2.2} />

                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
