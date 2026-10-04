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
// Shared field styles
// =========================================================

const inputClassName = `
    mt-2.5
    w-full
    rounded-xl
    border
    border-border
    bg-background
    px-4
    text-[14px]
    text-text-primary
    outline-none
    transition

    placeholder:text-text-muted

    focus:border-primary
    focus:ring-2
    focus:ring-primary/10

    disabled:cursor-not-allowed
    disabled:opacity-60
`;

const selectClassName = `
    ${inputClassName}
    h-12
    appearance-none
    font-bengali
`;

const labelClassName = `
    font-bengali
    text-[14px]
    font-medium!
    text-text-primary

    sm:text-[15px]
`;

const errorClassName = `
    mt-2
    font-bengali
    text-xs
    leading-5
    text-red-600
`;

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
            <div className="flex min-h-[520px] items-center px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
                <div className="mx-auto w-full max-w-[620px]">
                    <div className="border-y border-border py-8 sm:py-10">
                        <p className="font-bengali text-[13px] font-medium! text-primary">
                            অ্যাকাউন্ট প্রয়োজন
                        </p>

                        <h2 className="mt-2.5 font-bengali text-[1.8rem] font-medium! leading-[1.4] tracking-[-0.02em] text-text-primary sm:text-[2.15rem]">
                            আপনার সাহায্যের আবেদন তৈরি করুন
                        </h2>

                        <p className="mt-3 max-w-xl font-bengali text-[14px] leading-7 text-text-secondary sm:text-[15px] sm:leading-8">
                            সাহায্যের অনুরোধ জানাতে প্রথমে আপনার অ্যাকাউন্টে
                            প্রবেশ করুন। এরপর আপনার পরিস্থিতি লিখে আবেদনটি
                            পর্যালোচনা করে পাঠাতে পারবেন।
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/login?role=individual"
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-primary
                                    px-5
                                    font-bengali
                                    text-sm
                                    font-medium!
                                    text-white!
                                    transition
                                    hover:bg-primary-dark
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-primary
                                    focus-visible:ring-offset-2
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
                                    rounded-lg
                                    border
                                    border-border
                                    bg-surface
                                    px-5
                                    font-bengali
                                    text-sm
                                    font-medium!
                                    text-text-primary
                                    transition
                                    hover:bg-background
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-primary
                                    focus-visible:ring-offset-2
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
            className="
                px-5
                py-8

                sm:px-8
                sm:py-10

                lg:px-10
                lg:py-12

                xl:px-12
                xl:py-14
            "
        >
            {/* =================================================
                FORM INTRO
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-5

                    border-b
                    border-border
                    pb-7

                    sm:pb-8

                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                    lg:gap-10
                "
            >
                <div className="max-w-[700px]">
                    <p className="font-bengali text-[12px] font-medium! text-primary sm:text-[13px]">
                        ধাপ ১ · আপনার পরিস্থিতি
                    </p>

                    <h2
                        className="
                            mt-2

                            font-bengali
                            text-[1.7rem]
                            font-medium!
                            leading-[1.4]
                            tracking-[-0.015em]
                            text-text-primary

                            sm:text-[2rem]

                            lg:text-[2.2rem]
                        "
                    >
                        কী ধরনের সাহায্য প্রয়োজন?
                    </h2>

                    <p
                        className="
                            mt-2.5
                            max-w-[650px]

                            font-bengali
                            text-[13px]
                            leading-7
                            text-text-secondary

                            sm:text-[14px]
                            sm:leading-7
                        "
                    >
                        আপনার পরিস্থিতি নিজের ভাষায় বিস্তারিত লিখুন। এরপর
                        প্রয়োজনীয় তথ্যগুলো সাজিয়ে দেওয়া হবে এবং পাঠানোর আগে আপনি
                        নিজে সবকিছু পর্যালোচনা করতে পারবেন।
                    </p>
                </div>

                <div
                    className="
                        hidden
                        shrink-0

                        lg:block
                    "
                >
                    <p className="font-bengali text-[11px] font-medium! uppercase tracking-[0.08em] text-text-muted">
                        ০১ / ০২
                    </p>

                    <p className="mt-1 font-bengali text-xs text-text-secondary">
                        প্রথমে আপনার কথা
                    </p>
                </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <div className="mt-8">
                <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor="description" className={labelClassName}>
                        আপনার পরিস্থিতি <span className="text-accent">*</span>
                    </label>

                    <span className="shrink-0 text-[11px] text-text-muted">
                        {form.description.length}/5000
                    </span>
                </div>

                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={8}
                    maxLength={5000}
                    placeholder="আপনার কী সমস্যা হয়েছে, কী ধরনের সাহায্য প্রয়োজন এবং পরিস্থিতি সম্পর্কে প্রাসঙ্গিক তথ্য নিজের ভাষায় লিখুন..."
                    className={`
                        ${inputClassName}

                        min-h-[190px]
                        resize-y

                        py-4

                        font-bengali
                        leading-7
                    `}
                />

                <div className="mt-2.5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <p className="max-w-2xl font-bengali text-[11px] leading-5 text-text-muted sm:text-xs">
                        প্রয়োজনে অবস্থান, ঠিকানা, সময়সীমা বা পরিস্থিতির জরুরিতার
                        মতো তথ্যও এখানে লিখতে পারেন।
                    </p>
                </div>

                {error.description && (
                    <p className={errorClassName}>{error.description}</p>
                )}
            </div>

            {/* =================================================
                ANALYSIS LOADING
            ================================================== */}

            {analyzing && (
                <div
                    className="
                        mt-7
                        flex
                        items-start
                        gap-3

                        border-y
                        border-primary/15

                        bg-primary/5

                        px-4
                        py-4

                        sm:px-5
                    "
                >
                    <div
                        className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            animate-spin
                            rounded-full
                            border-2
                            border-primary/20
                            border-t-primary
                        "
                    />

                    <div>
                        <p className="font-bengali text-sm font-medium! text-text-primary">
                            আপনার অনুরোধ বিশ্লেষণ করা হচ্ছে...
                        </p>

                        <p className="mt-1 font-bengali text-[11px] leading-5 text-text-secondary sm:text-xs">
                            আপনার লেখা থেকে প্রাসঙ্গিক তথ্য সাজিয়ে দেওয়া হচ্ছে।
                        </p>
                    </div>
                </div>
            )}

            {/* =================================================
                AI ANALYSIS RESULT
            ================================================== */}

            {analysis && !analyzing && (
                <div className="mt-9 border-t border-border pt-8 sm:mt-10 sm:pt-9">
                    {/* Review heading */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-2

                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                            sm:gap-6
                        "
                    >
                        <div>
                            <p className="font-bengali text-[12px] font-medium! text-primary sm:text-[13px]">
                                ধাপ ২ · পর্যালোচনা
                            </p>

                            <h3
                                className="
                                    mt-1.5

                                    font-bengali
                                    text-[1.5rem]
                                    font-medium!
                                    leading-[1.4]
                                    text-text-primary

                                    sm:text-[1.75rem]
                                "
                            >
                                আপনার অনুরোধের তথ্য
                            </h3>
                        </div>

                        <p className="font-bengali text-[11px] leading-5 text-text-muted sm:text-xs">
                            প্রয়োজন হলে নিচের তথ্য পরিবর্তন করুন
                        </p>
                    </div>

                    {/* =================================================
                        Review fields
                    ================================================== */}

                    <div className="mt-7 space-y-5">
                        {/* Title */}

                        <div>
                            <label
                                htmlFor="analysis-title"
                                className={labelClassName}
                            >
                                শিরোনাম <span className="text-accent">*</span>
                            </label>

                            <input
                                id="analysis-title"
                                type="text"
                                value={analysis.title || ''}
                                onChange={(e) =>
                                    handleAnalysisChange(
                                        'title',
                                        e.target.value,
                                    )
                                }
                                className={`
                                    ${inputClassName}
                                    h-12
                                    font-bengali
                                    font-medium!
                                `}
                            />

                            {error.title && (
                                <p className={errorClassName}>{error.title}</p>
                            )}
                        </div>

                        {/* Category + urgency */}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Category */}

                            <div>
                                <label
                                    htmlFor="analysis-category"
                                    className={labelClassName}
                                >
                                    বিভাগ <span className="text-accent">*</span>
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
                                    className={selectClassName}
                                >
                                    <option value="">
                                        বিভাগ নির্বাচন করুন
                                    </option>

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
                                    <p className={errorClassName}>
                                        {error.category}
                                    </p>
                                )}
                            </div>

                            {/* Urgency */}

                            <div>
                                <label
                                    htmlFor="analysis-urgency"
                                    className={labelClassName}
                                >
                                    জরুরিতা{' '}
                                    <span className="text-accent">*</span>
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
                                    className={selectClassName}
                                >
                                    <option value="">
                                        জরুরিতা নির্বাচন করুন
                                    </option>

                                    <option value="low">কম</option>
                                    <option value="medium">মাঝারি</option>
                                    <option value="high">জরুরি</option>
                                </select>

                                {error.urgency && (
                                    <p className={errorClassName}>
                                        {error.urgency}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* District */}

                        <div>
                            <label
                                htmlFor="analysis-district"
                                className={labelClassName}
                            >
                                জেলা <span className="text-accent">*</span>
                            </label>

                            <input
                                id="analysis-district"
                                type="text"
                                value={analysis.district || ''}
                                onChange={(e) =>
                                    handleAnalysisChange(
                                        'district',
                                        e.target.value,
                                    )
                                }
                                placeholder="যেমন: কুমিল্লা"
                                className={`
                                    ${inputClassName}
                                    h-12
                                    font-bengali
                                `}
                            />

                            {error.district && (
                                <p className={errorClassName}>
                                    {error.district}
                                </p>
                            )}
                        </div>

                        {/* Address */}

                        <div>
                            <label
                                htmlFor="analysis-address"
                                className={labelClassName}
                            >
                                ঠিকানা <span className="text-accent">*</span>
                            </label>

                            <textarea
                                id="analysis-address"
                                value={analysis.address || ''}
                                onChange={(e) =>
                                    handleAnalysisChange(
                                        'address',
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                placeholder="আপনার সাহায্যের প্রয়োজনীয় স্থান বা ঠিকানা"
                                className={`
                                    ${inputClassName}

                                    min-h-[92px]
                                    resize-y

                                    py-3

                                    font-bengali
                                    leading-6
                                `}
                            />

                            {error.address && (
                                <p className={errorClassName}>
                                    {error.address}
                                </p>
                            )}
                        </div>

                        {/* Deadline */}

                        {analysis.deadline && (
                            <div
                                className="
                                    border-l-2
                                    border-primary/30

                                    bg-background-warm

                                    px-4
                                    py-3.5

                                    sm:px-5
                                "
                            >
                                <p className="font-bengali text-xs font-medium! text-text-primary">
                                    প্রয়োজনের সময়সীমা
                                </p>

                                <p className="mt-1 font-bengali text-sm leading-6 text-text-secondary">
                                    {analysis.deadline}
                                </p>

                                <p className="mt-1 font-bengali text-[11px] leading-5 text-text-muted">
                                    এটি আপনার বর্ণনা থেকে পাওয়া তথ্য। প্রয়োজন
                                    হলে মূল পরিস্থিতির বিবরণে এটি পরিবর্তন করতে
                                    পারেন।
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Review notice */}

                    <div
                        className="
                            mt-6

                            flex
                            items-start
                            gap-3

                            border-t
                            border-border

                            pt-5
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                mt-2
                                size-1.5
                                shrink-0
                                rounded-full
                                bg-primary
                            "
                        />

                        <p className="font-bengali text-[11px] leading-6 text-text-secondary sm:text-xs">
                            অনুরোধ পাঠানোর আগে উপরের তথ্যগুলো যাচাই করুন।
                            বিশ্লেষণ শুধু আপনার তথ্য সাজাতে সাহায্য করে; আপনার
                            অনুমতি ছাড়া কোনো অনুরোধ পাঠানো হবে না।
                        </p>
                    </div>

                    {/* Submit error */}

                    {error.submit && (
                        <div
                            className="
                                mt-5
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                            "
                        >
                            <p className="font-bengali text-sm leading-6 text-red-700">
                                {error.submit}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* =================================================
                ANALYSIS ERROR
            ================================================== */}

            {error.analyze && (
                <div
                    className="
                        mt-6
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                    "
                >
                    <p className="font-bengali text-sm leading-6 text-red-700">
                        {error.analyze}
                    </p>
                </div>
            )}

            {/* =================================================
                CATEGORY ERROR
            ================================================== */}

            {error.categories && (
                <div
                    className="
                        mt-4
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                    "
                >
                    <p className="font-bengali text-sm leading-6 text-red-700">
                        {error.categories}
                    </p>
                </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div
                className="
                    mt-8

                    flex
                    flex-col-reverse
                    gap-3

                    border-t
                    border-border
                    pt-6

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
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

                            rounded-lg

                            border
                            border-border

                            bg-surface

                            px-5

                            font-bengali
                            text-sm
                            font-medium!
                            text-text-primary

                            transition

                            hover:bg-background

                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                            focus-visible:ring-offset-2

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {analyzing
                            ? 'বিশ্লেষণ করা হচ্ছে...'
                            : 'আবার বিশ্লেষণ করুন'}
                    </button>
                ) : (
                    <p className="hidden text-[11px] leading-5 text-text-muted sm:block">
                        আপনার তথ্য পর্যালোচনা না করে কোনো আবেদন পাঠানো হবে না।
                    </p>
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
