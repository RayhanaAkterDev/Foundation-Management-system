import React, { useMemo, useRef, useState } from 'react';

import {
    CalendarDays,
    Camera,
    Check,
    ChevronDown,
    MapPin,
    Phone,
    Search,
    Upload,
} from 'lucide-react';

/* =========================================================
   BANGLADESH DISTRICTS
========================================================= */

const BANGLADESH_DISTRICTS = [
    { value: 'Bagerhat', label: 'বাগেরহাট' },
    { value: 'Bandarban', label: 'বান্দরবান' },
    { value: 'Barguna', label: 'বরগুনা' },
    { value: 'Barishal', label: 'বরিশাল' },
    { value: 'Bhola', label: 'ভোলা' },
    { value: 'Bogura', label: 'বগুড়া' },
    { value: 'Brahmanbaria', label: 'ব্রাহ্মণবাড়িয়া' },
    { value: 'Chandpur', label: 'চাঁদপুর' },
    { value: 'Chapainawabganj', label: 'চাঁপাইনবাবগঞ্জ' },
    { value: 'Chattogram', label: 'চট্টগ্রাম' },
    { value: 'Chuadanga', label: 'চুয়াডাঙ্গা' },
    { value: "Cox's Bazar", label: 'কক্সবাজার' },
    { value: 'Cumilla', label: 'কুমিল্লা' },
    { value: 'Dhaka', label: 'ঢাকা' },
    { value: 'Dinajpur', label: 'দিনাজপুর' },
    { value: 'Faridpur', label: 'ফরিদপুর' },
    { value: 'Feni', label: 'ফেনী' },
    { value: 'Gaibandha', label: 'গাইবান্ধা' },
    { value: 'Gazipur', label: 'গাজীপুর' },
    { value: 'Gopalganj', label: 'গোপালগঞ্জ' },
    { value: 'Habiganj', label: 'হবিগঞ্জ' },
    { value: 'Jamalpur', label: 'জামালপুর' },
    { value: 'Jashore', label: 'যশোর' },
    { value: 'Jhalokati', label: 'ঝালকাঠি' },
    { value: 'Jhenaidah', label: 'ঝিনাইদহ' },
    { value: 'Joypurhat', label: 'জয়পুরহাট' },
    { value: 'Khagrachhari', label: 'খাগড়াছড়ি' },
    { value: 'Khulna', label: 'খুলনা' },
    { value: 'Kishoreganj', label: 'কিশোরগঞ্জ' },
    { value: 'Kurigram', label: 'কুড়িগ্রাম' },
    { value: 'Kushtia', label: 'কুষ্টিয়া' },
    { value: 'Lakshmipur', label: 'লক্ষ্মীপুর' },
    { value: 'Lalmonirhat', label: 'লালমনিরহাট' },
    { value: 'Madaripur', label: 'মাদারীপুর' },
    { value: 'Magura', label: 'মাগুরা' },
    { value: 'Manikganj', label: 'মানিকগঞ্জ' },
    { value: 'Meherpur', label: 'মেহেরপুর' },
    { value: 'Moulvibazar', label: 'মৌলভীবাজার' },
    { value: 'Munshiganj', label: 'মুন্সিগঞ্জ' },
    { value: 'Mymensingh', label: 'ময়মনসিংহ' },
    { value: 'Naogaon', label: 'নওগাঁ' },
    { value: 'Narail', label: 'নড়াইল' },
    { value: 'Narayanganj', label: 'নারায়ণগঞ্জ' },
    { value: 'Narsingdi', label: 'নরসিংদী' },
    { value: 'Natore', label: 'নাটোর' },
    { value: 'Netrokona', label: 'নেত্রকোনা' },
    { value: 'Nilphamari', label: 'নীলফামারী' },
    { value: 'Noakhali', label: 'নোয়াখালী' },
    { value: 'Pabna', label: 'পাবনা' },
    { value: 'Panchagarh', label: 'পঞ্চগড়' },
    { value: 'Patuakhali', label: 'পটুয়াখালী' },
    { value: 'Pirojpur', label: 'পিরোজপুর' },
    { value: 'Rajbari', label: 'রাজবাড়ী' },
    { value: 'Rajshahi', label: 'রাজশাহী' },
    { value: 'Rangamati', label: 'রাঙ্গামাটি' },
    { value: 'Rangpur', label: 'রংপুর' },
    { value: 'Satkhira', label: 'সাতক্ষীরা' },
    { value: 'Shariatpur', label: 'শরীয়তপুর' },
    { value: 'Sherpur', label: 'শেরপুর' },
    { value: 'Sirajganj', label: 'সিরাজগঞ্জ' },
    { value: 'Sunamganj', label: 'সুনামগঞ্জ' },
    { value: 'Sylhet', label: 'সিলেট' },
    { value: 'Tangail', label: 'টাঙ্গাইল' },
    { value: 'Thakurgaon', label: 'ঠাকুরগাঁও' },
];

/* =========================================================
   FIELD
========================================================= */

const Field = ({ label, optional = false, error, children }) => (
    <div>
        <div className="mb-2.5 flex min-h-5.5 items-center gap-2">
            <span className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#263b38]">
                {label}

                {!optional && <span className="ml-1 text-[#d94b4b]">*</span>}
            </span>

            {optional && (
                <span className="font-['Noto_Sans_Bengali'] text-[13px] font-medium text-[#84938f]">
                    ঐচ্ছিক
                </span>
            )}
        </div>

        {children}

        {error && (
            <p className="mt-2 font-['Noto_Sans_Bengali'] text-[13px] leading-5 text-red-600">
                {error}
            </p>
        )}
    </div>
);

/* =========================================================
   INPUT STYLES
========================================================= */

const inputClass = (error) => `
    h-[55px]
    w-full
    rounded-[10px]
    border
    bg-white
    pl-11.5
    pr-4

    font-['Noto_Sans_Bengali']
    text-[15px]
    font-medium
    text-[#172a27]

    outline-none
    transition-all
    duration-200

    placeholder:font-normal
    placeholder:text-[#96a4a1]

    ${
        error
            ? `
                border-red-400
                bg-red-50/20
                focus:border-red-500
                focus:ring-4
                focus:ring-red-100/70
            `
            : `
                border-[#d5dfdd]
                hover:border-[#afc6c2]
                focus:border-[#0f766e]
                focus:bg-white
                focus:ring-4
                focus:ring-[#0f766e]/8
            `
    }
`;

const textareaClass = (error) => `
    min-h-[112px]
    w-full
    resize-none
    rounded-[10px]
    border
    bg-white
    py-3.5
    pl-11.5
    pr-4

    font-['Noto_Sans_Bengali']
    text-[15px]
    font-medium
    leading-7
    text-[#172a27]

    outline-none
    transition-all
    duration-200

    placeholder:font-normal
    placeholder:text-[#96a4a1]

    ${
        error
            ? `
                border-red-400
                bg-red-50/20
                focus:border-red-500
                focus:ring-4
                focus:ring-red-100/70
            `
            : `
                border-[#d5dfdd]
                hover:border-[#afc6c2]
                focus:border-[#0f766e]
                focus:bg-white
                focus:ring-4
                focus:ring-[#0f766e]/8
            `
    }
`;

/* =========================================================
   INPUT ICON
========================================================= */

const InputIcon = ({ children }) => (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11.5 items-center justify-center">
        {children}
    </span>
);

/* =========================================================
   NORMALIZE SEARCH
========================================================= */

const normalizeSearch = (text = '') =>
    text.trim().toLocaleLowerCase().replace(/\s+/g, ' ');

/* =========================================================
   DISTRICT COMBOBOX
========================================================= */

const DistrictCombobox = ({ value, onChange, error }) => {
    const inputRef = useRef(null);

    const selectedDistrict = useMemo(
        () =>
            BANGLADESH_DISTRICTS.find((district) => district.value === value) ||
            null,
        [value],
    );

    /*
     * query === null means the user is NOT actively
     * searching. In that state we derive the visible text
     * directly from the selected value.
     *
     * This removes the need for setState inside useEffect.
     */
    const [query, setQuery] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const displayValue = query !== null ? query : selectedDistrict?.label || '';

    /* =====================================================
       FILTER + PREFIX-FIRST SORT
    ====================================================== */

    const filteredDistricts = useMemo(() => {
        const search = normalizeSearch(displayValue);

        if (!search) {
            return [...BANGLADESH_DISTRICTS].sort((a, b) =>
                a.label.localeCompare(b.label, 'bn'),
            );
        }

        return BANGLADESH_DISTRICTS.map((district) => {
            const bangla = normalizeSearch(district.label);

            const english = normalizeSearch(district.value);

            let priority = 99;

            /*
             * Exact match
             */
            if (bangla === search || english === search) {
                priority = 0;
            } else if (
                /*
                 * Starts with typed letters.
                 * These results come before contains matches.
                 */
                bangla.startsWith(search) ||
                english.startsWith(search)
            ) {
                priority = 1;
            } else if (bangla.includes(search) || english.includes(search)) {
                /*
                 * Contains typed text elsewhere.
                 */
                priority = 2;
            }

            return {
                ...district,
                priority,
            };
        })
            .filter((district) => district.priority !== 99)
            .sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }

                return a.label.localeCompare(b.label, 'bn');
            });
    }, [displayValue]);

    /* =====================================================
       SELECT DISTRICT
    ====================================================== */

    const selectDistrict = (district) => {
        onChange(district.value);

        /*
         * Return to derived display mode.
         * The Bangla label will now come from value.
         */
        setQuery(null);
        setIsOpen(false);
        setActiveIndex(0);

        inputRef.current?.blur();
    };

    /* =====================================================
       USER TYPES
    ====================================================== */

    const handleInputChange = (event) => {
        const nextQuery = event.target.value;

        setQuery(nextQuery);
        setIsOpen(true);
        setActiveIndex(0);

        /*
         * Once the user edits an already-selected
         * district, clear the saved selection until
         * another valid district is chosen.
         */
        if (value) {
            onChange('');
        }
    };

    /* =====================================================
       FOCUS
    ====================================================== */

    const handleFocus = () => {
        /*
         * If there is already a selected district,
         * clearing the temporary query makes it easy
         * for the user to immediately type another one.
         *
         * The selected value itself remains intact until
         * the user actually starts typing.
         */
        setQuery('');
        setIsOpen(true);
        setActiveIndex(0);
    };

    /* =====================================================
       BLUR
    ====================================================== */

    const handleBlur = () => {
        /*
         * Delay allows dropdown option onMouseDown /
         * onClick to complete first.
         */
        window.setTimeout(() => {
            setIsOpen(false);
            setQuery(null);
            setActiveIndex(0);
        }, 120);
    };

    /* =====================================================
       KEYBOARD
    ====================================================== */

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (!isOpen) {
                setIsOpen(true);
                return;
            }

            if (filteredDistricts.length === 0) {
                return;
            }

            setActiveIndex((current) =>
                Math.min(current + 1, filteredDistricts.length - 1),
            );

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (filteredDistricts.length === 0) {
                return;
            }

            setActiveIndex((current) => Math.max(current - 1, 0));

            return;
        }

        if (event.key === 'Enter' && isOpen && filteredDistricts.length > 0) {
            event.preventDefault();

            const district =
                filteredDistricts[
                    Math.min(activeIndex, filteredDistricts.length - 1)
                ];

            if (district) {
                selectDistrict(district);
            }

            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();

            setQuery(null);
            setIsOpen(false);
            setActiveIndex(0);

            inputRef.current?.blur();
        }
    };

    /* =====================================================
       TOGGLE DROPDOWN
    ====================================================== */

    const handleToggle = () => {
        if (isOpen) {
            setQuery(null);
            setIsOpen(false);
            setActiveIndex(0);
            inputRef.current?.blur();

            return;
        }

        setQuery('');
        setIsOpen(true);
        setActiveIndex(0);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    return (
        <div className="relative">
            {/* =================================================
                INPUT
            ================================================== */}

            <div className="relative">
                <InputIcon>
                    <MapPin
                        className="h-4.5 w-4.5 text-[#7d908c]"
                        strokeWidth={1.7}
                    />
                </InputIcon>

                <input
                    ref={inputRef}
                    type="text"
                    value={displayValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="জেলা খুঁজুন"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-autocomplete="list"
                    aria-controls="district-listbox"
                    className={`
                        ${inputClass(error)}
                        pr-12
                    `}
                />

                <button
                    type="button"
                    tabIndex={-1}
                    aria-label="জেলার তালিকা দেখুন"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleToggle}
                    className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-[#778a86]
                        transition

                        hover:bg-[#edf4f2]
                        hover:text-primary
                    "
                >
                    <ChevronDown
                        className={`
                            h-4.25
                            w-4.25
                            transition-transform
                            duration-200

                            ${isOpen ? 'rotate-180' : ''}
                        `}
                        strokeWidth={1.8}
                    />
                </button>
            </div>

            {/* =================================================
                DROPDOWN
            ================================================== */}

            {isOpen && (
                <div
                    className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+7px)]
                        z-50
                        overflow-hidden
                        rounded-[11px]
                        border
                        border-[#d5dfdd]
                        bg-white
                        shadow-[0_16px_40px_rgba(15,23,42,0.10)]
                    "
                >
                    {/* SEARCH INFO */}

                    <div className="flex h-10.5 items-center gap-2 border-b border-[#e7eceb] px-3.5">
                        <Search
                            className="h-3.5 w-3.5 shrink-0 text-[#81918e]"
                            strokeWidth={1.8}
                        />

                        <span className="font-['Noto_Sans_Bengali'] text-[12px] font-medium text-[#74837f]">
                            {displayValue.trim()
                                ? `${filteredDistricts.length}টি জেলা পাওয়া গেছে`
                                : 'বাংলাদেশের ৬৪ জেলা'}
                        </span>
                    </div>

                    {/* RESULTS */}

                    <div
                        id="district-listbox"
                        role="listbox"
                        className="max-h-62.5 overflow-y-auto p-1.5"
                    >
                        {filteredDistricts.length > 0 ? (
                            filteredDistricts.map((district, index) => {
                                const selected = value === district.value;

                                const active = index === activeIndex;

                                return (
                                    <button
                                        key={district.value}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        onMouseEnter={() =>
                                            setActiveIndex(index)
                                        }
                                        onMouseDown={(event) => {
                                            event.preventDefault();

                                            selectDistrict(district);
                                        }}
                                        className={`
                                                flex
                                                min-h-11
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-lg
                                                px-3
                                                text-left
                                                transition-colors

                                                ${
                                                    selected
                                                        ? 'bg-background-teal'
                                                        : active
                                                          ? 'bg-[#f4f8f7]'
                                                          : 'bg-white'
                                                }
                                            `}
                                    >
                                        <span
                                            className={`
                                                    flex
                                                    h-7
                                                    w-7
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-[7px]

                                                    ${
                                                        selected
                                                            ? 'bg-[#dcefeb] text-primary'
                                                            : 'bg-[#f1f5f4] text-[#82928f]'
                                                    }
                                                `}
                                        >
                                            <MapPin
                                                className="h-3.5 w-3.5"
                                                strokeWidth={1.8}
                                            />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <span className="block font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#263b38]">
                                                {district.label}
                                            </span>

                                            <span className="mt-0.5 block font-['Poppins'] text-[11px] font-medium text-[#8a9895]">
                                                {district.value}
                                            </span>
                                        </div>

                                        {selected && (
                                            <Check
                                                className="h-4 w-4 shrink-0 text-primary"
                                                strokeWidth={2.4}
                                            />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <MapPin
                                    className="mx-auto h-5 w-5 text-[#9caaa7]"
                                    strokeWidth={1.6}
                                />

                                <p className="mt-2 font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#536561]">
                                    কোনো জেলা পাওয়া যায়নি
                                </p>

                                <p className="mt-1 font-['Noto_Sans_Bengali'] text-[13px] leading-6 text-[#899793]">
                                    বাংলা অথবা ইংরেজিতে জেলার নাম লিখুন।
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* =========================================================
   BANGLA / ENGLISH NUMBER HELPERS
========================================================= */

const toBanglaDigits = (value = '') =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const toEnglishDigits = (value = '') =>
    String(value).replace(/[০-৯]/g, (digit) => {
        const banglaDigits = '০১২৩৪৫৬৭৮৯';

        return String(banglaDigits.indexOf(digit));
    });

/* =========================================================
   STEP INDIVIDUAL PROFILE
========================================================= */

const StepIndividualProfile = ({ formData, onChange, errors = {} }) => {
    const fileRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;

        if (!file) return;

        const preview = URL.createObjectURL(file);

        onChange('profilePhoto', file);
        onChange('profilePhotoPreview', preview);
    };

    const hasPhoto = Boolean(formData.profilePhotoPreview);

    return (
        <div className="w-full">
            {/* =================================================
                HEADER
            ================================================== */}

            <header className="max-w-170">
                <div className="flex items-center gap-2.5">
                    <span className="h-0.5 w-7 rounded-full bg-primary" />

                    <span className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-primary">
                        আপনার প্রোফাইল
                    </span>
                </div>

                <h1 className="mt-3.5 font-['Noto_Sans_Bengali'] text-[27px] font-semibold leading-[1.45] tracking-[-0.012em] text-text-primary sm:text-[30px]">
                    যোগাযোগের প্রয়োজনীয় তথ্য দিন
                </h1>

                <p className="mt-2.5 max-w-145 font-['Noto_Sans_Bengali'] text-[15px] leading-7 text-[#6c7c78]">
                    আপনার সঙ্গে যোগাযোগ ও প্রয়োজনীয় সমন্বয়ের জন্য তথ্যগুলো পূরণ
                    করুন।
                </p>
            </header>

            {/* =================================================
                FORM
            ================================================== */}

            <div className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                {/* PHONE */}

                <Field label="মোবাইল নম্বর" error={errors.phone}>
                    <div className="relative">
                        <InputIcon>
                            <Phone
                                className="h-4.5 w-4.5 text-[#7d908c]"
                                strokeWidth={1.7}
                            />
                        </InputIcon>

                        <input
                            type="tel"
                            inputMode="numeric"
                            value={toBanglaDigits(formData.phone || '')}
                            onChange={(event) => {
                                const englishValue = toEnglishDigits(
                                    event.target.value,
                                )
                                    .replace(/\D/g, '')
                                    .slice(0, 11);

                                onChange('phone', englishValue);
                            }}
                            placeholder="০১XXXXXXXXX"
                            autoComplete="tel"
                            className={inputClass(errors.phone)}
                        />
                    </div>
                </Field>

                {/* DISTRICT */}

                <Field label="জেলা" error={errors.district}>
                    <DistrictCombobox
                        value={formData.district || ''}
                        onChange={(district) => onChange('district', district)}
                        error={errors.district}
                    />
                </Field>

                {/* ADDRESS */}

                <div className="sm:col-span-2">
                    <Field label="বর্তমান ঠিকানা" error={errors.address}>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-0 top-0 flex h-[55px] w-11.5 items-center justify-center">
                                <MapPin
                                    className="h-4.5 w-4.5 text-[#7d908c]"
                                    strokeWidth={1.7}
                                />
                            </span>

                            <textarea
                                rows={3}
                                value={formData.address || ''}
                                onChange={(event) =>
                                    onChange('address', event.target.value)
                                }
                                placeholder="আপনার বর্তমান ঠিকানা লিখুন"
                                autoComplete="street-address"
                                className={textareaClass(errors.address)}
                            />
                        </div>
                    </Field>
                </div>

                {/* DATE OF BIRTH */}

                <Field label="জন্মতারিখ" optional error={errors.dob}>
                    <div className="relative">
                        {/* LEFT ICON */}
                        <InputIcon>
                            <CalendarDays
                                className="h-4.5 w-4.5 text-[#7d908c]"
                                strokeWidth={1.7}
                            />
                        </InputIcon>

                        {/* BANGLA DISPLAY */}
                        <input
                            type="text"
                            inputMode="numeric"
                            value={toBanglaDigits(formData.dob || '')}
                            onChange={(event) => {
                                const englishValue = toEnglishDigits(
                                    event.target.value,
                                );

                                const digits = englishValue
                                    .replace(/\D/g, '')
                                    .slice(0, 8);

                                let formatted = '';

                                if (digits.length <= 4) {
                                    formatted = digits;
                                } else if (digits.length <= 6) {
                                    formatted = `${digits.slice(
                                        0,
                                        4,
                                    )}-${digits.slice(4)}`;
                                } else {
                                    formatted = `${digits.slice(
                                        0,
                                        4,
                                    )}-${digits.slice(
                                        4,
                                        6,
                                    )}-${digits.slice(6, 8)}`;
                                }

                                onChange('dob', formatted);
                            }}
                            placeholder="বছর-মাস-দিন"
                            autoComplete="bday"
                            className={`
                ${inputClass(errors.dob)}
                pr-12
            `}
                        />

                        {/* NATIVE DATE PICKER */}
                        <div
                            className="
                absolute
                right-2
                top-1/2
                h-9
                w-9
                -translate-y-1/2
            "
                        >
                            <input
                                type="date"
                                value={formData.dob || ''}
                                onChange={(event) =>
                                    onChange('dob', event.target.value)
                                }
                                aria-label="জন্মতারিখ নির্বাচন করুন"
                                className="
                    absolute
                    inset-0
                    z-10
                    h-full
                    w-full
                    cursor-pointer
                    opacity-0
                "
                            />

                            <span
                                className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    text-[#778a86]
                    transition
                "
                            >
                                <CalendarDays
                                    className="h-4.5 w-4.5"
                                    strokeWidth={1.8}
                                />
                            </span>
                        </div>
                    </div>
                </Field>

                {/* =================================================
                    PROFILE PHOTO
                ================================================== */}

                <div className="sm:col-span-2">
                    <div className="border-t border-[#e1e8e6] pt-5">
                        <Field label="প্রোফাইল ছবি" optional>
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="
                                    group
                                    flex
                                    w-full
                                    items-center
                                    gap-4
                                    rounded-[11px]
                                    border
                                    border-[#d5dfdd]
                                    bg-white
                                    p-3.5
                                    text-left
                                    outline-none
                                    transition-all
                                    duration-200

                                    hover:border-[#9dbeb8]
                                    hover:bg-[#fbfdfc]

                                    focus-visible:border-primary
                                    focus-visible:ring-4
                                    focus-visible:ring-primary/8

                                    sm:p-4
                                "
                            >
                                {/* PREVIEW */}

                                <span
                                    className={`
                                        relative
                                        flex
                                        h-14.5
                                        w-14.5
                                        shrink-0
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-[10px]
                                        border

                                        ${
                                            hasPhoto
                                                ? 'border-[#cbdad7] bg-[#eef4f2]'
                                                : 'border-[#dce5e3] bg-[#edf4f2]'
                                        }
                                    `}
                                >
                                    {hasPhoto ? (
                                        <img
                                            src={formData.profilePhotoPreview}
                                            alt="প্রোফাইল ছবির প্রিভিউ"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Camera
                                            className="h-5.25 w-5.25 text-[#6f8782]"
                                            strokeWidth={1.7}
                                        />
                                    )}

                                    {hasPhoto && (
                                        <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                                            <Check
                                                className="h-2.25 w-2.25"
                                                strokeWidth={3}
                                            />
                                        </span>
                                    )}
                                </span>

                                {/* COPY */}

                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#263b38]">
                                        {formData.profilePhoto?.name ||
                                            'প্রোফাইল ছবি যোগ করুন'}
                                    </p>

                                    <p className="mt-1 font-['Noto_Sans_Bengali'] text-[13px] leading-6 text-[#758480]">
                                        {hasPhoto
                                            ? 'অন্য ছবি দিতে চাইলে আবার নির্বাচন করুন'
                                            : 'JPG বা PNG ছবি নির্বাচন করুন'}
                                    </p>
                                </div>

                                {/* ACTION */}

                                <span
                                    className="
                                        hidden
                                        h-9
                                        shrink-0
                                        items-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-[#c7dad6]
                                        bg-[#f5faf8]
                                        px-3.5

                                        font-['Noto_Sans_Bengali']
                                        text-[13px]
                                        font-semibold
                                        text-primary

                                        transition

                                        group-hover:border-[#9ec5be]
                                        group-hover:bg-background-teal

                                        sm:flex
                                    "
                                >
                                    <Upload
                                        className="h-3.75 w-3.75"
                                        strokeWidth={1.8}
                                    />

                                    {hasPhoto ? 'পরিবর্তন' : 'নির্বাচন'}
                                </span>
                            </button>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </Field>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepIndividualProfile;
