import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
    TbArrowRight,
    TbCheck,
    TbLock,
    TbLogin2,
    TbUserPlus,
} from 'react-icons/tb';

import Button from '@/components/Button';
import { fetchCategories } from '@/api/categories';

import {
    analyzeHelpRequest,
    createHelpRequest,
} from '@/dashboard/individual/myHelpRequests/api/helpRequestAPI';

const toBangla = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const getStoredUser = () => {
    try {
        const raw =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const getStoredToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const getCategorySlug = (category) =>
    typeof category === 'string'
        ? category
        : category?.slug || category?.value || '';

const getCategoryName = (category) =>
    typeof category === 'string'
        ? category
        : category?.name_bn ||
          category?.bangla_name ||
          category?.name ||
          category?.title ||
          category?.slug ||
          '';

const fieldClass =
    'mt-3 w-full rounded-xl border border-[#d5e3dc] bg-[#fbfdfc] px-4 py-4 font-bengali text-[15px] text-[#0f172a] outline-none transition-colors focus:border-[#0f766e] focus:bg-white focus:ring-4 focus:ring-[#0f766e]/[0.08] disabled:opacity-60';

const labelClass =
    'block font-bengali text-[14px] font-semibold text-[#142a27]';

const errorClass = 'mt-2 font-bengali text-[12px] leading-5 text-red-600';

const RequestForm = ({ setSuccess }) => {
    const user = getStoredUser();
    const authToken = getStoredToken();
    const isLoggedIn = Boolean(user && authToken);

    const [form, setForm] = useState({ description: '' });
    const [analysis, setAnalysis] = useState(null);
    const [categories, setCategories] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [error, setError] = useState({});

    useEffect(() => {
        let active = true;

        const loadCategories = async () => {
            setLoadingCategories(true);

            try {
                const data = await fetchCategories();

                if (active) {
                    setCategories(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error('Failed to load categories:', err);

                if (active) {
                    setError((prev) => ({
                        ...prev,
                        categories: 'বিভাগের তালিকা লোড করা যায়নি।',
                    }));
                }
            } finally {
                if (active) setLoadingCategories(false);
            }
        };

        loadCategories();

        return () => {
            active = false;
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError((prev) => ({
            ...prev,
            [name]: '',
            analyze: '',
            submit: '',
        }));

        if (name === 'description') {
            setAnalysis(null);
        }
    };

    const handleAnalysisChange = (field, value) => {
        setAnalysis((prev) => (prev ? { ...prev, [field]: value } : prev));

        setError((prev) => ({
            ...prev,
            [field]: '',
            submit: '',
        }));
    };

    const handleAnalyze = async () => {
        if (!isLoggedIn || analyzing || submitting) return;

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
                    'অনুগ্রহ করে অন্তত ১০ অক্ষরে আপনার পরিস্থিতি লিখুন।',
            });
            return;
        }

        setError({});
        setAnalysis(null);
        setAnalyzing(true);

        try {
            const response = await analyzeHelpRequest(description);
            const result = response?.analysis || null;

            if (!result) {
                setError({
                    analyze: 'অনুরোধ বিশ্লেষণ করা যায়নি। আবার চেষ্টা করুন।',
                });
                return;
            }

            setAnalysis({
                title: result.title || '',
                description: result.description || description,
                category: result.category || '',
                urgency: result.urgency || '',
                district: result.district || '',
                address: result.address || '',
                deadline: result.deadline || '',
                keywords: Array.isArray(result.keywords) ? result.keywords : [],
            });
        } catch (err) {
            console.error('Failed to analyze help request:', err);

            setError({
                analyze:
                    err?.message ||
                    'অনুরোধ বিশ্লেষণ করা যায়নি। আবার চেষ্টা করুন।',
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmitRequest = async () => {
        if (!isLoggedIn || !analysis || analyzing || submitting) return;

        const title = analysis.title?.trim() || '';
        const description = form.description.trim();
        const category = analysis.category?.trim() || '';
        const district = analysis.district?.trim() || '';
        const address = analysis.address?.trim() || '';
        const urgency = analysis.urgency?.trim() || '';

        const validationErrors = {};

        if (!title) validationErrors.title = 'একটি শিরোনাম দিন.';
        if (!description)
            validationErrors.description = 'আপনার পরিস্থিতি লিখুন।';
        if (!category) validationErrors.category = 'একটি বিভাগ নির্বাচন করুন।';
        if (!district) validationErrors.district = 'জেলা লিখুন।';
        if (!address) validationErrors.address = 'ঠিকানা লিখুন।';
        if (!urgency)
            validationErrors.urgency = 'জরুরিতার মাত্রা নির্বাচন করুন।';

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
                    'সাহায্যের অনুরোধ পাঠানো যায়নি। আবার চেষ্টা করুন।',
            });
        } finally {
            setSubmitting(false);
        }
    };

    /* LOGGED-OUT STATE */

    if (!isLoggedIn) {
        return (
            <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
                <div className="max-w-[660px]">
                    <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#0f766e]">
                        <TbLock size={17} />
                        অ্যাকাউন্ট প্রয়োজন
                    </span>

                    <h2 className="mt-5 text-[1.9rem] font-semibold leading-[1.45] sm:text-[2.3rem]">
                        আবেদন শুরু করতে
                        <span className="block text-[#0f766e]">লগইন করুন</span>
                    </h2>

                    <p className="mt-6 max-w-[580px] text-[15px] leading-[2] text-[#64748b]">
                        সাহায্যের আবেদন জমা দিতে আপনার অ্যাকাউন্টে প্রবেশ করুন।
                        লগইন করার পর আপনার প্রয়োজন বিস্তারিত লিখে তথ্য যাচাই ও
                        আবেদন জমা দিতে পারবেন।
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Link
                            to="/login?role=individual"
                            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-[#0f766e] px-6 text-[14px] font-semibold text-white! transition hover:bg-[#115e59]"
                        >
                            <TbLogin2 size={19} />
                            লগইন করুন
                            <TbArrowRight size={17} />
                        </Link>

                        <Link
                            to="/register"
                            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-[#dce6e1] bg-white px-6 text-[14px] font-semibold text-[#0f172a] transition hover:bg-[#f7faf8]"
                        >
                            <TbUserPlus size={19} />
                            নতুন অ্যাকাউন্ট তৈরি করুন
                        </Link>
                    </div>
                </div>

                <div className="mt-14 flex items-start gap-3 border-t border-[#e5ece8] pt-6">
                    <TbCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-[#0f766e]"
                    />

                    <p className="text-[13px] leading-[1.9] text-[#64748b]">
                        লগইন করার পর আপনার আবেদন এখান থেকেই শুরু করতে পারবেন।
                    </p>
                </div>
            </div>
        );
    }

    /* LOGGED-IN FORM */

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();

                if (analysis) {
                    handleSubmitRequest();
                } else {
                    handleAnalyze();
                }
            }}
            className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14"
        >
            <div className="border-b border-[#e5ece8] pb-8">
                <span className="text-[12px] font-semibold text-[#0f766e]">
                    {analysis
                        ? 'ধাপ ০২ · তথ্য পর্যালোচনা'
                        : 'ধাপ ০১ · প্রয়োজন জানান'}
                </span>

                <h2 className="mt-4 text-[1.65rem] font-semibold leading-[1.5] sm:text-[1.95rem]">
                    {analysis
                        ? 'আপনার আবেদনের তথ্য যাচাই করুন'
                        : 'আপনার পরিস্থিতি সম্পর্কে লিখুন'}
                </h2>

                <p className="mt-4 text-[14px] leading-[1.9] text-[#64748b]">
                    {analysis
                        ? 'প্রয়োজনে তথ্য সংশোধন করে আবেদন পাঠান।'
                        : 'আপনার কী ধরনের সহায়তা প্রয়োজন, তা বিস্তারিত লিখুন।'}
                </p>
            </div>

            <div className="py-10">
                <label htmlFor="help-description" className={labelClass}>
                    আপনার পরিস্থিতি ও প্রয়োজন
                </label>

                <textarea
                    id="help-description"
                    name="description"
                    rows={9}
                    maxLength={5000}
                    value={form.description}
                    onChange={handleChange}
                    disabled={analyzing || submitting}
                    placeholder="আপনার পরিস্থিতি, কী ধরনের সহায়তা প্রয়োজন এবং কোথায় প্রয়োজন—বিস্তারিত লিখুন..."
                    className={`${fieldClass} min-h-[290px] resize-y leading-[1.95]`}
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    {error.description ? (
                        <p role="alert" className={errorClass}>
                            {error.description}
                        </p>
                    ) : (
                        <p className="text-[12px] text-[#94a3b8]">
                            অন্তত ১০ অক্ষরে লিখুন।
                        </p>
                    )}

                    <span className="text-[12px] text-[#94a3b8]">
                        {toBangla(form.description.length)}/৫০০০
                    </span>
                </div>
            </div>

            {error.analyze && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-700"
                >
                    {error.analyze}
                </p>
            )}

            {analysis && (
                <div className="border-t border-[#e5ece8] pt-10">
                    <h3 className="text-[1.25rem] font-semibold">
                        বিশ্লেষিত তথ্য
                    </h3>

                    <p className="mt-2 text-[13px] leading-[1.9] text-[#64748b]">
                        নিচের তথ্যগুলো যাচাই করুন। প্রয়োজন হলে সংশোধন করুন।
                    </p>

                    <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="help-title" className={labelClass}>
                                আবেদনের শিরোনাম
                            </label>

                            <input
                                id="help-title"
                                type="text"
                                value={analysis.title || ''}
                                onChange={(event) =>
                                    handleAnalysisChange(
                                        'title',
                                        event.target.value,
                                    )
                                }
                                className={fieldClass}
                            />

                            {error.title && (
                                <p className={errorClass}>{error.title}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="help-category"
                                className={labelClass}
                            >
                                সহায়তার বিভাগ
                            </label>

                            <select
                                id="help-category"
                                value={analysis.category || ''}
                                onChange={(event) =>
                                    handleAnalysisChange(
                                        'category',
                                        event.target.value,
                                    )
                                }
                                disabled={loadingCategories}
                                className={fieldClass}
                            >
                                <option value="">বিভাগ নির্বাচন করুন</option>

                                {categories.map((category) => {
                                    const slug = getCategorySlug(category);

                                    return (
                                        <option key={slug} value={slug}>
                                            {getCategoryName(category)}
                                        </option>
                                    );
                                })}
                            </select>

                            {error.category && (
                                <p className={errorClass}>{error.category}</p>
                            )}

                            {error.categories && (
                                <p className={errorClass}>{error.categories}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="help-urgency"
                                className={labelClass}
                            >
                                জরুরিতার মাত্রা
                            </label>

                            <select
                                id="help-urgency"
                                value={analysis.urgency || ''}
                                onChange={(event) =>
                                    handleAnalysisChange(
                                        'urgency',
                                        event.target.value,
                                    )
                                }
                                className={fieldClass}
                            >
                                <option value="">
                                    জরুরিতার মাত্রা নির্বাচন করুন
                                </option>
                                <option value="low">কম</option>
                                <option value="medium">মাঝারি</option>
                                <option value="high">জরুরি</option>
                            </select>

                            {error.urgency && (
                                <p className={errorClass}>{error.urgency}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="help-district"
                                className={labelClass}
                            >
                                জেলা
                            </label>

                            <input
                                id="help-district"
                                type="text"
                                value={analysis.district || ''}
                                onChange={(event) =>
                                    handleAnalysisChange(
                                        'district',
                                        event.target.value,
                                    )
                                }
                                placeholder="আপনার জেলার নাম"
                                className={fieldClass}
                            />

                            {error.district && (
                                <p className={errorClass}>{error.district}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="help-address"
                                className={labelClass}
                            >
                                ঠিকানা
                            </label>

                            <input
                                id="help-address"
                                type="text"
                                value={analysis.address || ''}
                                onChange={(event) =>
                                    handleAnalysisChange(
                                        'address',
                                        event.target.value,
                                    )
                                }
                                placeholder="বিস্তারিত ঠিকানা"
                                className={fieldClass}
                            />

                            {error.address && (
                                <p className={errorClass}>{error.address}</p>
                            )}
                        </div>
                    </div>

                    {analysis.deadline && (
                        <p className="mt-5 text-[12px] text-[#64748b]">
                            সম্ভাব্য সময়সীমা: {toBangla(analysis.deadline)}
                        </p>
                    )}
                </div>
            )}

            {error.submit && (
                <p
                    role="alert"
                    className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-700"
                >
                    {error.submit}
                </p>
            )}

            <div className="mt-8 flex flex-col gap-5 border-t border-[#e5ece8] pt-8 sm:flex-row sm:items-center sm:justify-between">
                {analysis ? (
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={analyzing || submitting}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#dce6e1] bg-white px-5 text-[13px] font-semibold text-[#0f172a] transition hover:bg-[#f7faf8] disabled:opacity-50"
                    >
                        {analyzing
                            ? 'বিশ্লেষণ করা হচ্ছে...'
                            : 'আবার বিশ্লেষণ করুন'}
                    </button>
                ) : (
                    <p className="text-[12px] leading-[1.8] text-[#64748b]">
                        আবেদন পাঠানোর আগে তথ্য যাচাই করতে পারবেন।
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
