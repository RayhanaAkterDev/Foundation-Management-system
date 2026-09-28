import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { fetchCategories } from '@/api/categories';
import {
    analyzeHelpRequest,
    createHelpRequest,
} from '@/dashboard/individual/myHelpRequests/api/helpRequestAPI';

// =========================================================
// Stored authentication helpers
// =========================================================

const getStoredUser = () => {
    try {
        const raw =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const getStoredToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

// =========================================================
// Category helpers
// =========================================================

const getCategorySlug = (category) => {
    if (!category) return '';

    if (typeof category === 'string') {
        return category;
    }

    return category.slug || category.value || '';
};

const getCategoryName = (category) => {
    if (!category) return '';

    if (typeof category === 'string') {
        return category;
    }

    return (
        category.name_bn ||
        category.bangla_name ||
        category.name ||
        category.title ||
        category.slug ||
        ''
    );
};

// =========================================================
// Component
// =========================================================

const RequestForm = ({ setSuccess }) => {
    const user = getStoredUser();
    const authToken = getStoredToken();

    const isLoggedIn = Boolean(user && authToken);

    // =====================================================
    // Form state
    // =====================================================

    const [form, setForm] = useState({
        description: '',
    });

    // =====================================================
    // AI analysis state
    // =====================================================

    const [analysis, setAnalysis] = useState(null);

    const [categories, setCategories] = useState([]);

    const [analyzing, setAnalyzing] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [loadingCategories, setLoadingCategories] = useState(false);

    const [error, setError] = useState({});

    // =====================================================
    // Load categories
    // =====================================================

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);

            try {
                const data = await fetchCategories();

                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load categories:', err);

                setError((prev) => ({
                    ...prev,
                    categories: 'বিভাগের তালিকা লোড করা যায়নি।',
                }));
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    // =====================================================
    // Form change
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError((prev) => ({
            ...prev,
            [name]: '',
            analyze: '',
        }));

        // If the original description changes,
        // the previous AI analysis is no longer reliable.
        if (name === 'description') {
            setAnalysis(null);
        }
    };

    // =====================================================
    // Analysis field change
    // =====================================================

    const handleAnalysisChange = (field, value) => {
        setAnalysis((prev) => ({
            ...prev,
            [field]: value,
        }));

        setError((prev) => ({
            ...prev,
            [field]: '',
            submit: '',
        }));
    };

    // =====================================================
    // Analyze request
    // =====================================================

    const handleAnalyze = async () => {
        if (!isLoggedIn) {
            return;
        }

        const description = form.description.trim();

        if (!description) {
            setError({
                description:
                    'অনুগ্রহ করে আপনার পরিস্থিতি সম্পর্কে বিস্তারিত লিখুন।',
            });

            return;
        }

        if (description.length < 10) {
            setError({
                description:
                    'অনুগ্রহ করে অন্তত ১০ অক্ষরে আপনার পরিস্থিতি বিস্তারিত লিখুন।',
            });

            return;
        }

        setError({});
        setAnalysis(null);
        setAnalyzing(true);

        try {
            const response = await analyzeHelpRequest(description);

            const nextAnalysis = response?.analysis || null;

            if (!nextAnalysis) {
                setError({
                    analyze:
                        'আপনার অনুরোধ বিশ্লেষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
                });

                return;
            }

            setAnalysis({
                title: nextAnalysis.title || '',
                description: nextAnalysis.description || description,
                category: nextAnalysis.category || '',
                urgency: nextAnalysis.urgency || '',
                district: nextAnalysis.district || '',
                address: nextAnalysis.address || '',
                deadline: nextAnalysis.deadline || '',
                keywords: Array.isArray(nextAnalysis.keywords)
                    ? nextAnalysis.keywords
                    : [],
            });
        } catch (err) {
            console.error('Failed to analyze help request:', err);

            setError({
                analyze:
                    err?.message ||
                    'আপনার অনুরোধ বিশ্লেষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
            });
        } finally {
            setAnalyzing(false);
        }
    };

    // =====================================================
    // Final submit
    // =====================================================

    const handleSubmitRequest = async () => {
        if (!isLoggedIn) {
            return;
        }

        if (!analysis) {
            setError({
                analyze: 'প্রথমে আপনার অনুরোধ বিশ্লেষণ করুন।',
            });

            return;
        }

        const title = analysis.title?.trim() || '';

        const description = form.description.trim();

        const category = analysis.category?.trim() || '';

        const district = analysis.district?.trim() || '';

        const address = analysis.address?.trim() || '';

        const urgency = analysis.urgency?.trim() || '';

        const validationErrors = {};

        if (!title) {
            validationErrors.title = 'অনুগ্রহ করে একটি শিরোনাম দিন।';
        }

        if (!description) {
            validationErrors.description = 'অনুগ্রহ করে আপনার পরিস্থিতি লিখুন।';
        }

        if (!category) {
            validationErrors.category = 'অনুগ্রহ করে একটি বিভাগ নির্বাচন করুন।';
        }

        if (!district) {
            validationErrors.district = 'অনুগ্রহ করে জেলা নির্বাচন বা লিখুন।';
        }

        if (!address) {
            validationErrors.address = 'অনুগ্রহ করে ঠিকানা দিন।';
        }

        if (!urgency) {
            validationErrors.urgency = 'অনুগ্রহ করে জরুরিতা নির্বাচন করুন।';
        }

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);

            return;
        }

        setError({});
        setSubmitting(true);

        try {
            await createHelpRequest({
                title,
                description,
                category,
                district,
                address,
                urgency,
            });

            if (typeof setSuccess === 'function') {
                setSuccess(true);
            }
        } catch (err) {
            console.error('Failed to submit help request:', err);

            setError({
                submit:
                    err?.message ||
                    'আপনার সাহায্যের অনুরোধ পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // Logged-out state
    // =====================================================

    if (!isLoggedIn) {
        return (
            <div className="flex min-h-130 flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div className="mx-auto w-full max-w-xl">
                    <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
                        <p className="font-bengali text-sm font-medium text-text-muted">
                            সাহায্যের অনুরোধ জানাতে প্রথমে আপনার অ্যাকাউন্টে
                            প্রবেশ করুন।
                        </p>

                        <h2 className="mt-3 font-bengali text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                            আপনার সাহায্যের আবেদন তৈরি করুন
                        </h2>

                        <p className="mt-3 font-bengali text-sm leading-7 text-text-muted">
                            আপনার পরিস্থিতি বিস্তারিত লিখুন। আমরা আপনার অনুরোধটি
                            সাজিয়ে দেওয়ার পর আপনি নিজে পর্যালোচনা করে পাঠাতে
                            পারবেন।
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/account/login?role=individual"
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-primary
                                    px-5
                                    font-bengali
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-primary-dark
                                "
                            >
                                লগইন করুন
                            </Link>

                            <Link
                                to="/register"
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface
                                    px-5
                                    font-bengali
                                    text-sm
                                    font-semibold
                                    text-text-primary
                                    transition
                                    hover:bg-background
                                "
                            >
                                নতুন অ্যাকাউন্ট তৈরি করুন
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // Main form
    // =====================================================

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                if (analysis) {
                    handleSubmitRequest();
                } else {
                    handleAnalyze();
                }
            }}
            className="p-6 sm:p-8 lg:p-10"
        >
            {/* =================================================
                Header
            ================================================= */}

            <div className="max-w-3xl">
                <p className="font-bengali text-sm font-semibold text-primary">
                    আপনার পরিস্থিতি
                </p>

                <h2 className="mt-2 font-bengali text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                    কী ধরনের সাহায্য প্রয়োজন?
                </h2>

                <p className="mt-3 font-bengali text-sm leading-7 text-text-muted">
                    আপনার পরিস্থিতি নিজের ভাষায় বিস্তারিত লিখুন। বিশ্লেষণের পর
                    প্রয়োজনীয় তথ্যগুলো সাজিয়ে দেওয়া হবে এবং পাঠানোর আগে আপনি
                    নিজে সবকিছু পর্যালোচনা করতে পারবেন।
                </p>
            </div>

            {/* =================================================
                Description
            ================================================= */}

            <div className="mt-8">
                <label
                    htmlFor="description"
                    className="font-bengali text-sm font-semibold text-text-primary"
                >
                    আপনার পরিস্থিতি *
                </label>

                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={8}
                    placeholder="আপনার কী সমস্যা হয়েছে, কী ধরনের সাহায্য প্রয়োজন এবং পরিস্থিতি সম্পর্কে প্রাসঙ্গিক তথ্য নিজের ভাষায় লিখুন..."
                    className="
                        mt-3
                        w-full
                        resize-none
                        rounded-2xl
                        border
                        border-border
                        bg-background
                        px-4
                        py-4
                        font-bengali
                        text-sm
                        leading-7
                        text-text-primary
                        outline-none
                        transition
                        placeholder:text-text-muted
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/10
                    "
                />

                <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-bengali text-xs leading-5 text-text-muted">
                        প্রয়োজনে আপনার অবস্থান, ঠিকানা, সময়সীমা বা পরিস্থিতির
                        জরুরিতার মতো তথ্যও এখানে লিখতে পারেন।
                    </p>

                    <p className="shrink-0 text-xs text-text-muted">
                        {form.description.length}/5000
                    </p>
                </div>

                {error.description && (
                    <p className="mt-2 font-bengali text-xs text-red-600">
                        {error.description}
                    </p>
                )}
            </div>

            {/* =================================================
                Analysis loading
            ================================================= */}

            {analyzing && (
                <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

                        <p className="font-bengali text-sm font-medium text-text-primary">
                            আপনার অনুরোধ বিশ্লেষণ করা হচ্ছে...
                        </p>
                    </div>

                    <p className="mt-2 font-bengali text-xs leading-6 text-text-muted">
                        আপনার লেখা থেকে প্রাসঙ্গিক তথ্য সাজিয়ে দেওয়া হচ্ছে।
                    </p>
                </div>
            )}

            {/* =================================================
                AI analysis result
            ================================================= */}

            {analysis && !analyzing && (
                <div className="mt-8 rounded-2xl border border-border bg-background p-5 sm:p-6">
                    {/* =================================================
                        Review header
                    ================================================= */}

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="font-bengali text-sm font-semibold text-primary">
                                পর্যালোচনা করুন
                            </p>

                            <h3 className="mt-1 font-bengali text-xl font-semibold tracking-tight text-text-primary">
                                আপনার অনুরোধের তথ্য
                            </h3>
                        </div>

                        <p className="font-bengali text-xs text-text-muted">
                            পাঠানোর আগে তথ্য পরিবর্তন করতে পারবেন
                        </p>
                    </div>

                    {/* =================================================
                        Title
                    ================================================= */}

                    <div className="mt-6">
                        <label
                            htmlFor="analysis-title"
                            className="font-bengali text-sm font-semibold text-text-primary"
                        >
                            শিরোনাম *
                        </label>

                        <input
                            id="analysis-title"
                            type="text"
                            value={analysis.title || ''}
                            onChange={(e) =>
                                handleAnalysisChange('title', e.target.value)
                            }
                            className="
                                mt-2
                                h-12
                                w-full
                                rounded-xl
                                border
                                border-border
                                bg-surface
                                px-4
                                font-bengali
                                text-sm
                                font-medium
                                text-text-primary
                                outline-none
                                transition
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/10
                            "
                        />

                        {error.title && (
                            <p className="mt-2 font-bengali text-xs text-red-600">
                                {error.title}
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        Category + urgency
                    ================================================= */}

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Category */}

                        <div>
                            <label
                                htmlFor="analysis-category"
                                className="font-bengali text-sm font-semibold text-text-primary"
                            >
                                বিভাগ *
                            </label>

                            <select
                                id="analysis-category"
                                value={analysis.category || ''}
                                onChange={(e) =>
                                    handleAnalysisChange(
                                        'category',
                                        e.target.value,
                                    )
                                }
                                disabled={loadingCategories}
                                className="
                                    mt-2
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface
                                    px-4
                                    font-bengali
                                    text-sm
                                    text-text-primary
                                    outline-none
                                    transition
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/10
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                <option value="">বিভাগ নির্বাচন করুন</option>

                                {categories.map((category) => {
                                    const slug = getCategorySlug(category);
                                    const name = getCategoryName(category);

                                    return (
                                        <option key={slug} value={slug}>
                                            {name}
                                        </option>
                                    );
                                })}
                            </select>

                            {error.category && (
                                <p className="mt-2 font-bengali text-xs text-red-600">
                                    {error.category}
                                </p>
                            )}
                        </div>

                        {/* Urgency */}

                        <div>
                            <label
                                htmlFor="analysis-urgency"
                                className="font-bengali text-sm font-semibold text-text-primary"
                            >
                                জরুরিতা *
                            </label>

                            <select
                                id="analysis-urgency"
                                value={analysis.urgency || ''}
                                onChange={(e) =>
                                    handleAnalysisChange(
                                        'urgency',
                                        e.target.value,
                                    )
                                }
                                className="
                                    mt-2
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface
                                    px-4
                                    font-bengali
                                    text-sm
                                    text-text-primary
                                    outline-none
                                    transition
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/10
                                "
                            >
                                <option value="">জরুরিতা নির্বাচন করুন</option>

                                <option value="low">কম</option>

                                <option value="medium">মাঝারি</option>

                                <option value="high">জরুরি</option>
                            </select>

                            {error.urgency && (
                                <p className="mt-2 font-bengali text-xs text-red-600">
                                    {error.urgency}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* =================================================
                        District
                    ================================================= */}

                    <div className="mt-5">
                        <label
                            htmlFor="analysis-district"
                            className="font-bengali text-sm font-semibold text-text-primary"
                        >
                            জেলা *
                        </label>

                        <input
                            id="analysis-district"
                            type="text"
                            value={analysis.district || ''}
                            onChange={(e) =>
                                handleAnalysisChange('district', e.target.value)
                            }
                            placeholder="যেমন: কুমিল্লা"
                            className="
                                mt-2
                                h-12
                                w-full
                                rounded-xl
                                border
                                border-border
                                bg-surface
                                px-4
                                font-bengali
                                text-sm
                                text-text-primary
                                outline-none
                                transition
                                placeholder:text-text-muted
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/10
                            "
                        />

                        {error.district && (
                            <p className="mt-2 font-bengali text-xs text-red-600">
                                {error.district}
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        Address
                    ================================================= */}

                    <div className="mt-5">
                        <label
                            htmlFor="analysis-address"
                            className="font-bengali text-sm font-semibold text-text-primary"
                        >
                            ঠিকানা *
                        </label>

                        <textarea
                            id="analysis-address"
                            value={analysis.address || ''}
                            onChange={(e) =>
                                handleAnalysisChange('address', e.target.value)
                            }
                            rows={3}
                            placeholder="আপনার সাহায্যের প্রয়োজনীয় স্থান বা ঠিকানা"
                            className="
                                mt-2
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-border
                                bg-surface
                                px-4
                                py-3
                                font-bengali
                                text-sm
                                leading-6
                                text-text-primary
                                outline-none
                                transition
                                placeholder:text-text-muted
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/10
                            "
                        />

                        {error.address && (
                            <p className="mt-2 font-bengali text-xs text-red-600">
                                {error.address}
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        Extracted deadline metadata
                    ================================================= */}

                    {analysis.deadline && (
                        <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-3">
                            <p className="font-bengali text-xs font-semibold text-text-primary">
                                প্রয়োজনের সময়সীমা
                            </p>

                            <p className="mt-1 font-bengali text-sm leading-6 text-text-muted">
                                {analysis.deadline}
                            </p>

                            <p className="mt-1 font-bengali text-xs leading-5 text-text-muted">
                                এটি আপনার বর্ণনা থেকে পাওয়া তথ্য; প্রয়োজনে
                                আপনি মূল পরিস্থিতির বিবরণে এটি পরিবর্তন করতে
                                পারেন।
                            </p>
                        </div>
                    )}

                    {/* =================================================
                        Review notice
                    ================================================= */}

                    <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-3">
                        <p className="font-bengali text-xs leading-6 text-text-muted">
                            অনুরোধ পাঠানোর আগে উপরের তথ্যগুলো যাচাই করুন।
                            বিশ্লেষণ শুধু আপনার তথ্য সাজাতে সাহায্য করে; আপনার
                            অনুমতি ছাড়া কোনো অনুরোধ পাঠানো হয় না।
                        </p>
                    </div>

                    {/* =================================================
                        Submit error
                    ================================================= */}

                    {error.submit && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="font-bengali text-sm leading-6 text-red-700">
                                {error.submit}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* =================================================
                Analysis error
            ================================================= */}

            {error.analyze && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="font-bengali text-sm leading-6 text-red-700">
                        {error.analyze}
                    </p>
                </div>
            )}

            {/* =================================================
                Category loading error
            ================================================= */}

            {error.categories && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="font-bengali text-sm leading-6 text-red-700">
                        {error.categories}
                    </p>
                </div>
            )}

            {/* =================================================
                Actions
            ================================================= */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {analysis ? (
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={analyzing || submitting}
                        className="
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-border
                            bg-surface
                            px-5
                            font-bengali
                            text-sm
                            font-semibold
                            text-text-primary
                            transition
                            hover:bg-background
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {analyzing
                            ? 'বিশ্লেষণ করা হচ্ছে...'
                            : 'আবার বিশ্লেষণ করুন'}
                    </button>
                ) : (
                    <div />
                )}

                <Button
                    type="submit"
                    disabled={analyzing || submitting || loadingCategories}
                >
                    {analyzing
                        ? 'বিশ্লেষণ করা হচ্ছে...'
                        : submitting
                          ? 'পাঠানো হচ্ছে...'
                          : analysis
                            ? 'অনুরোধ পাঠান'
                            : 'অনুরোধ বিশ্লেষণ করুন'}
                </Button>
            </div>
        </form>
    );
};

export default RequestForm;
