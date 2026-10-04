import React, { useMemo, useRef, useState } from 'react';

import {
    Building2,
    Check,
    ChevronDown,
    Globe2,
    ImagePlus,
    MapPin,
    Phone,
    Search,
    Upload,
} from 'lucide-react';

import { ORGANIZATION_TYPES } from '@/dashboard/admin/organizations/data/organizationTypes';

/* =========================================================
   BANGLADESH DISTRICTS
   Bangla UI / English stored value
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
    {
        value: 'Chapainawabganj',
        label: 'চাঁপাইনবাবগঞ্জ',
    },
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
   ORGANIZATION TYPE BANGLA LABELS

   These only change what the user sees.
   Original ORGANIZATION_TYPES values are still submitted.
========================================================= */

const ORGANIZATION_TYPE_LABELS = {
    NGO: 'বেসরকারি উন্নয়ন সংস্থা',
    Nonprofit: 'অলাভজনক সংস্থা',
    'Non-Profit': 'অলাভজনক সংস্থা',
    'Non-Profit Organization': 'অলাভজনক সংস্থা',

    Charity: 'দাতব্য সংস্থা',
    Foundation: 'ফাউন্ডেশন',

    'Community Organization': 'কমিউনিটি সংস্থা',
    'Community Based Organization': 'কমিউনিটিভিত্তিক সংস্থা',

    'Volunteer Organization': 'স্বেচ্ছাসেবী সংস্থা',
    'Youth Organization': 'যুব সংগঠন',
    'Social Organization': 'সামাজিক সংস্থা',
    'Religious Organization': 'ধর্মীয় সংস্থা',

    'Educational Institution': 'শিক্ষাপ্রতিষ্ঠান',

    'Healthcare Organization': 'স্বাস্থ্যসেবা সংস্থা',

    'Humanitarian Organization': 'মানবিক সহায়তা সংস্থা',

    'Civil Society Organization': 'নাগরিক সমাজ সংস্থা',

    'International NGO': 'আন্তর্জাতিক বেসরকারি উন্নয়ন সংস্থা',

    INGO: 'আন্তর্জাতিক বেসরকারি উন্নয়ন সংস্থা',

    Government: 'সরকারি সংস্থা',
    'Government Organization': 'সরকারি সংস্থা',

    Other: 'অন্যান্য',
};

const getOrganizationTypeLabel = (type) =>
    ORGANIZATION_TYPE_LABELS[type] || type;

/* =========================================================
   DIGIT HELPERS
========================================================= */

const toBanglaDigits = (value = '') =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const toEnglishDigits = (value = '') =>
    String(value).replace(/[০-৯]/g, (digit) => {
        const banglaDigits = '০১২৩৪৫৬৭৮৯';

        return String(banglaDigits.indexOf(digit));
    });

/* =========================================================
   SEARCH NORMALIZER
========================================================= */

const normalizeSearch = (value = '') =>
    String(value).trim().toLocaleLowerCase('bn-BD');

/* =========================================================
   FIELD
========================================================= */

const Field = ({ label, htmlFor, error, optional = false, children }) => (
    <div>
        <label
            htmlFor={htmlFor}
            className="
                mb-2.5
                flex
                min-h-5.5
                items-center
                gap-1.5
                font-['Noto_Sans_Bengali']
                text-[14px]
                font-semibold
                text-[#263b38]
            "
        >
            {label}

            {optional ? (
                <span
                    className="
                        text-[13px]
                        font-medium!
                        text-[#84938f]
                    "
                >
                    ঐচ্ছিক
                </span>
            ) : (
                <span className="text-[#d94b4b]">*</span>
            )}
        </label>

        {children}

        {error && (
            <p
                className="
                    mt-2
                    font-['Noto_Sans_Bengali']
                    text-[13px]
                    leading-5
                    text-red-600
                "
            >
                {error}
            </p>
        )}
    </div>
);

/* =========================================================
   INPUT ICON
========================================================= */

const InputIcon = ({ children }) => (
    <span
        className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            flex
            w-11.5
            items-center
            justify-center
        "
    >
        {children}
    </span>
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
    font-medium!
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
                focus:border-primary
                focus:ring-4
                focus:ring-primary/8
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
    font-medium!
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
                focus:border-primary
                focus:ring-4
                focus:ring-primary/8
            `
    }
`;

/* =========================================================
   ORGANIZATION TYPE DROPDOWN
========================================================= */

const OrganizationTypeCombobox = ({ value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    const selectedLabel = value ? getOrganizationTypeLabel(value) : '';

    const selectType = (type) => {
        onChange(type);

        setIsOpen(false);
        setActiveIndex(0);

        requestAnimationFrame(() => {
            buttonRef.current?.focus();
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();

            if (!isOpen) {
                setIsOpen(true);
                return;
            }

            const selectedType = ORGANIZATION_TYPES[activeIndex];

            if (selectedType) {
                selectType(selectedType);
            }

            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (!isOpen) {
                setIsOpen(true);
                return;
            }

            setActiveIndex((current) =>
                Math.min(current + 1, ORGANIZATION_TYPES.length - 1),
            );

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (!isOpen) {
                setIsOpen(true);
                return;
            }

            setActiveIndex((current) => Math.max(current - 1, 0));

            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();

            setIsOpen(false);
            setActiveIndex(0);
        }
    };

    const handleBlur = (event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) {
            setIsOpen(false);
            setActiveIndex(0);
        }
    };

    return (
        <div ref={containerRef} className="relative" onBlur={handleBlur}>
            {/* TRIGGER */}

            <button
                ref={buttonRef}
                id="orgType"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls="organization-type-listbox"
                onClick={() => setIsOpen((current) => !current)}
                onKeyDown={handleKeyDown}
                className={`
                    group
                    relative
                    flex
                    h-[55px]
                    w-full
                    items-center
                    rounded-[10px]
                    border
                    bg-white
                    pl-11.5
                    pr-12
                    text-left
                    outline-none
                    transition-all
                    duration-200

                    ${
                        error
                            ? `
                                border-red-400
                                bg-red-50/20
                                focus:border-red-500
                                focus:ring-4
                                focus:ring-red-100/70
                            `
                            : isOpen
                              ? `
                                    border-primary
                                    ring-4
                                    ring-primary/8
                                `
                              : `
                                    border-[#d5dfdd]
                                    hover:border-[#afc6c2]
                                    focus:border-primary
                                    focus:ring-4
                                    focus:ring-primary/8
                                `
                    }
                `}
            >
                <span
                    className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        left-0
                        flex
                        w-11.5
                        items-center
                        justify-center
                    "
                >
                    <Building2
                        className={`
                            h-4.5
                            w-4.5
                            transition-colors

                            ${isOpen ? 'text-primary' : 'text-[#7d908c]'}
                        `}
                        strokeWidth={1.7}
                    />
                </span>

                <span
                    className={`
                        min-w-0
                        flex-1
                        truncate
                        font-['Noto_Sans_Bengali']
                        text-[15px]

                        ${
                            selectedLabel
                                ? 'font-medium! text-[#172a27]'
                                : 'font-normal text-[#96a4a1]'
                        }
                    `}
                >
                    {selectedLabel || 'সংস্থার ধরন নির্বাচন করুন'}
                </span>

                <span
                    className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        right-0
                        flex
                        w-11
                        items-center
                        justify-center
                    "
                >
                    <ChevronDown
                        className={`
                            h-4.5
                            w-4.5
                            text-[#71837f]
                            transition-transform
                            duration-200

                            ${isOpen ? 'rotate-180 text-primary' : ''}
                        `}
                        strokeWidth={1.8}
                    />
                </span>
            </button>

            {/* OPTIONS */}

            {isOpen && (
                <div
                    id="organization-type-listbox"
                    role="listbox"
                    className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+7px)]
                        z-50
                        overflow-hidden
                        rounded-[11px]
                        border
                        border-[#d8e2df]
                        bg-white
                        shadow-[0_14px_38px_rgba(15,23,42,0.10)]
                    "
                >
                    <div
                        className="
                            flex
                            min-h-11
                            items-center
                            gap-2.5
                            border-b
                            border-[#e5ebe9]
                            bg-[#fafcfb]
                            px-3.5
                        "
                    >
                        <Building2
                            className="h-4 w-4 shrink-0 text-[#738681]"
                            strokeWidth={1.7}
                        />

                        <span
                            className="
                                font-['Noto_Sans_Bengali']
                                text-[13px]
                                font-medium!
                                text-[#6f807c]
                            "
                        >
                            সংস্থার ধরন নির্বাচন করুন
                        </span>
                    </div>

                    <div className="max-h-62.5 overflow-y-auto p-1.5">
                        {ORGANIZATION_TYPES.map((type, index) => {
                            const selected = type === value;

                            const active = index === activeIndex;

                            return (
                                <button
                                    key={type}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseDown={(event) => {
                                        event.preventDefault();

                                        selectType(type);
                                    }}
                                    className={`
                                            group/option
                                            flex
                                            min-h-[48px]
                                            w-full
                                            items-center
                                            gap-3
                                            rounded-lg
                                            px-3
                                            py-2
                                            text-left
                                            outline-none
                                            transition-colors

                                            ${
                                                selected
                                                    ? 'bg-background-teal'
                                                    : active
                                                      ? 'bg-[#f3f7f6]'
                                                      : 'bg-white hover:bg-[#f5f8f7]'
                                            }
                                        `}
                                >
                                    <span
                                        className={`
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg

                                                ${
                                                    selected
                                                        ? 'bg-[#d8ece8] text-primary'
                                                        : 'bg-[#f0f4f3] text-[#7c8d89]'
                                                }
                                            `}
                                    >
                                        <Building2
                                            className="h-4 w-4"
                                            strokeWidth={1.7}
                                        />
                                    </span>

                                    <span
                                        className={`
                                                min-w-0
                                                flex-1
                                                font-['Noto_Sans_Bengali']
                                                text-[14px]
                                                font-semibold
                                                leading-6

                                                ${
                                                    selected
                                                        ? 'text-primary'
                                                        : 'text-[#293d39]'
                                                }
                                            `}
                                    >
                                        {getOrganizationTypeLabel(type)}
                                    </span>

                                    {selected && (
                                        <span
                                            className="
                                                    flex
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-primary
                                                    text-white
                                                "
                                        >
                                            <Check
                                                className="h-3 w-3"
                                                strokeWidth={2.7}
                                            />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

/* =========================================================
   DISTRICT COMBOBOX
========================================================= */

const DistrictCombobox = ({ value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);

    /*
     * null = use selected district's Bangla label.
     * string = user is actively searching.
     */
    const [query, setQuery] = useState(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const inputRef = useRef(null);

    const selectedDistrict = useMemo(
        () =>
            BANGLADESH_DISTRICTS.find((district) => district.value === value) ||
            null,
        [value],
    );

    const displayValue = query !== null ? query : selectedDistrict?.label || '';

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

            if (bangla === search || english === search) {
                priority = 0;
            } else if (
                bangla.startsWith(search) ||
                english.startsWith(search)
            ) {
                priority = 1;
            } else if (bangla.includes(search) || english.includes(search)) {
                priority = 2;
            }

            return {
                ...district,
                priority,
            };
        })
            .filter((district) => district.priority < 99)
            .sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }

                return a.label.localeCompare(b.label, 'bn');
            });
    }, [displayValue]);

    const selectDistrict = (district) => {
        onChange(district.value);

        setQuery(null);
        setIsOpen(false);
        setActiveIndex(0);

        inputRef.current?.blur();
    };

    const handleInputChange = (event) => {
        const nextQuery = event.target.value;

        setQuery(nextQuery);
        setIsOpen(true);
        setActiveIndex(0);

        /*
         * User is replacing the old selection.
         * Clear old stored value to prevent
         * submitting a stale district.
         */
        if (value) {
            onChange('');
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
        setActiveIndex(0);
    };

    const handleBlur = () => {
        window.setTimeout(() => {
            setIsOpen(false);
            setQuery(null);
            setActiveIndex(0);
        }, 120);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (!isOpen) {
                setIsOpen(true);
                return;
            }

            if (!filteredDistricts.length) {
                return;
            }

            setActiveIndex((current) =>
                Math.min(current + 1, filteredDistricts.length - 1),
            );

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (!isOpen) {
                setIsOpen(true);
                return;
            }

            setActiveIndex((current) => Math.max(current - 1, 0));

            return;
        }

        if (event.key === 'Enter' && isOpen) {
            event.preventDefault();

            const district = filteredDistricts[activeIndex];

            if (district) {
                selectDistrict(district);
            }

            return;
        }

        if (event.key === 'Escape') {
            setIsOpen(false);
            setQuery(null);
            setActiveIndex(0);

            inputRef.current?.blur();
        }
    };

    const toggleDropdown = () => {
        setIsOpen((current) => !current);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    return (
        <div className="relative">
            <InputIcon>
                <MapPin
                    className="h-4.5 w-4.5 text-[#7d908c]"
                    strokeWidth={1.7}
                />
            </InputIcon>

            <input
                ref={inputRef}
                id="orgDistrict"
                type="text"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls="org-district-listbox"
                placeholder="জেলা খুঁজুন"
                value={displayValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
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
                onClick={toggleDropdown}
                className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    h-10.5
                    w-10.5
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-[#71837f]
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

            {isOpen && (
                <div
                    id="org-district-listbox"
                    role="listbox"
                    className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+7px)]
                        z-50
                        overflow-hidden
                        rounded-[11px]
                        border
                        border-[#d8e2df]
                        bg-white
                        shadow-[0_14px_38px_rgba(15,23,42,0.10)]
                    "
                >
                    <div
                        className="
                            flex
                            min-h-11
                            items-center
                            gap-2.5
                            border-b
                            border-[#e6ecea]
                            bg-[#fafcfb]
                            px-3.5
                        "
                    >
                        <Search
                            className="h-3.75 w-3.75 shrink-0 text-[#82928e]"
                            strokeWidth={1.8}
                        />

                        <p
                            className="
                                min-w-0
                                flex-1
                                truncate
                                font-['Noto_Sans_Bengali']
                                text-[13px]
                                text-[#74837f]
                            "
                        >
                            {displayValue
                                ? `“${displayValue}” অনুযায়ী জেলা`
                                : 'বাংলাদেশের ৬৪ জেলা'}
                        </p>

                        <span
                            className="
                                shrink-0
                                font-['Noto_Sans_Bengali']
                                text-[12px]
                                font-medium!
                                text-[#93a09d]
                            "
                        >
                            {toBanglaDigits(filteredDistricts.length)}
                        </span>
                    </div>

                    <div className="max-h-62.5 overflow-y-auto p-1.5">
                        {filteredDistricts.length > 0 ? (
                            filteredDistricts.map((district, index) => {
                                const selected = district.value === value;

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
                                                py-2
                                                text-left
                                                transition-colors

                                                ${
                                                    selected
                                                        ? 'bg-background-teal'
                                                        : active
                                                          ? 'bg-[#f3f7f6]'
                                                          : 'bg-white hover:bg-[#f5f8f7]'
                                                }
                                            `}
                                    >
                                        <span
                                            className={`
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg

                                                    ${
                                                        selected
                                                            ? 'bg-[#d8ece8] text-primary'
                                                            : 'bg-[#f0f4f3] text-[#7c8d89]'
                                                    }
                                                `}
                                        >
                                            <MapPin
                                                className="h-4 w-4"
                                                strokeWidth={1.7}
                                            />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span
                                                className={`
                                                        block
                                                        font-['Noto_Sans_Bengali']
                                                        text-[14px]
                                                        font-semibold

                                                        ${
                                                            selected
                                                                ? 'text-primary'
                                                                : 'text-[#293d39]'
                                                        }
                                                    `}
                                            >
                                                {district.label}
                                            </span>

                                            <span
                                                className="
                                                        mt-0.5
                                                        block
                                                        font-['Poppins']
                                                        text-[11px]
                                                        font-normal
                                                        text-[#8a9995]
                                                    "
                                            >
                                                {district.value}
                                            </span>
                                        </span>

                                        {selected && (
                                            <span
                                                className="
                                                        flex
                                                        h-5
                                                        w-5
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-primary
                                                        text-white
                                                    "
                                            >
                                                <Check
                                                    className="h-3 w-3"
                                                    strokeWidth={2.7}
                                                />
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div
                                className="
                                    px-4
                                    py-8
                                    text-center
                                    font-['Noto_Sans_Bengali']
                                "
                            >
                                <MapPin
                                    className="
                                        mx-auto
                                        h-5
                                        w-5
                                        text-[#a0aeaa]
                                    "
                                    strokeWidth={1.6}
                                />

                                <p
                                    className="
                                        mt-2
                                        text-[14px]
                                        font-semibold
                                        text-[#52635f]
                                    "
                                >
                                    কোনো জেলা পাওয়া যায়নি
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[12px]
                                        text-[#8a9995]
                                    "
                                >
                                    বাংলা বা ইংরেজিতে জেলার নাম লিখুন
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
   STEP ORGANIZATION PROFILE
========================================================= */

const StepOrganizationProfile = ({ formData, onChange, errors = {} }) => {
    const fileRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;

        if (!file) return;

        const preview = URL.createObjectURL(file);

        /*
         * Keep these existing state keys.
         * Registration/backend logic stays unchanged.
         */
        onChange('organizationLogo', file);

        onChange('organizationLogoPreview', preview);
    };

    const hasPhoto = Boolean(formData.organizationLogoPreview);

    return (
        <div className="w-full">
            {/* =================================================
                HEADER
            ================================================== */}

            <header className="max-w-170">
                <div className="flex items-center gap-2.5">
                    <span className="h-0.5 w-7 rounded-full bg-primary" />

                    <span
                        className="
                            font-['Noto_Sans_Bengali']
                            text-[14px]
                            font-semibold
                            text-primary
                        "
                    >
                        সংস্থার পরিচিতি
                    </span>
                </div>

                <h1
                    className="
                        mt-3.5
                        font-['Noto_Sans_Bengali']
                        text-[27px]
                        font-semibold
                        leading-[1.45]
                        tracking-[-0.012em]
                        text-text-primary
                        sm:text-[30px]
                    "
                >
                    আপনার সংস্থা সম্পর্কে জানান
                </h1>

                <p
                    className="
                        mt-2.5
                        max-w-145
                        font-['Noto_Sans_Bengali']
                        text-[15px]
                        leading-7
                        text-[#6c7c78]
                    "
                >
                    যোগাযোগ ও পরিচয় যাচাইয়ের জন্য সংস্থার প্রয়োজনীয় তথ্যগুলো
                    দিন।
                </p>
            </header>

            {/* =================================================
                FORM
            ================================================== */}

            <div
                className="
                    mt-7
                    grid
                    gap-x-5
                    gap-y-6
                    sm:grid-cols-2
                "
            >
                {/* PHONE */}

                <Field
                    label="যোগাযোগের মোবাইল নম্বর"
                    htmlFor="orgPhone"
                    error={errors.phone}
                >
                    <div className="relative">
                        <InputIcon>
                            <Phone
                                className="h-4.5 w-4.5 text-[#7d908c]"
                                strokeWidth={1.7}
                            />
                        </InputIcon>

                        <input
                            id="orgPhone"
                            type="tel"
                            autoComplete="tel"
                            inputMode="numeric"
                            placeholder="০১XXXXXXXXX"
                            value={toBanglaDigits(formData.phone || '')}
                            onChange={(event) => {
                                const englishValue = toEnglishDigits(
                                    event.target.value,
                                )
                                    .replace(/\D/g, '')
                                    .slice(0, 11);

                                onChange('phone', englishValue);
                            }}
                            className={inputClass(errors.phone)}
                        />
                    </div>
                </Field>

                {/* ORGANIZATION TYPE */}

                <Field
                    label="সংস্থার ধরন"
                    htmlFor="orgType"
                    error={errors.organizationType}
                >
                    <OrganizationTypeCombobox
                        value={formData.organizationType || ''}
                        onChange={(type) => onChange('organizationType', type)}
                        error={errors.organizationType}
                    />
                </Field>

                {/* DISTRICT */}

                <Field
                    label="জেলা"
                    htmlFor="orgDistrict"
                    error={errors.district}
                >
                    <DistrictCombobox
                        value={formData.district || ''}
                        onChange={(district) => onChange('district', district)}
                        error={errors.district}
                    />
                </Field>

                {/* WEBSITE */}

                <Field
                    label="ওয়েবসাইট"
                    htmlFor="website"
                    error={errors.website}
                    optional
                >
                    <div className="relative">
                        <InputIcon>
                            <Globe2
                                className="h-4.5 w-4.5 text-[#7d908c]"
                                strokeWidth={1.7}
                            />
                        </InputIcon>

                        <input
                            id="website"
                            type="url"
                            inputMode="url"
                            autoComplete="url"
                            placeholder="https://organization.org"
                            value={formData.website || ''}
                            onChange={(event) =>
                                onChange('website', event.target.value)
                            }
                            className={inputClass(errors.website)}
                        />
                    </div>
                </Field>

                {/* ADDRESS */}

                <div className="sm:col-span-2">
                    <Field
                        label="সংস্থার ঠিকানা"
                        htmlFor="orgAddress"
                        error={errors.address}
                    >
                        <div className="relative">
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    left-0
                                    top-0
                                    flex
                                    h-[55px]
                                    w-11.5
                                    items-center
                                    justify-center
                                "
                            >
                                <MapPin
                                    className="h-4.5 w-4.5 text-[#7d908c]"
                                    strokeWidth={1.7}
                                />
                            </span>

                            <textarea
                                id="orgAddress"
                                rows={3}
                                autoComplete="street-address"
                                placeholder="সংস্থার পূর্ণ ঠিকানা লিখুন"
                                value={formData.address || ''}
                                onChange={(event) =>
                                    onChange('address', event.target.value)
                                }
                                className={textareaClass(errors.address)}
                            />
                        </div>
                    </Field>
                </div>

                {/* =================================================
                    ORGANIZATION PHOTO

                    UI intentionally uses "ছবি".
                    Existing state keys remain unchanged.
                ================================================== */}

                <div className="sm:col-span-2">
                    <div className="border-t border-[#e1e8e6] pt-5">
                        <Field
                            label="সংস্থার ছবি"
                            htmlFor="orgPhoto"
                            error={errors.organizationLogo}
                            optional
                        >
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
                                    className="
                                        flex
                                        h-14.5
                                        w-14.5
                                        shrink-0
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-[10px]
                                        border
                                        border-[#dce5e3]
                                        bg-[#edf4f2]
                                    "
                                >
                                    {hasPhoto ? (
                                        <img
                                            src={
                                                formData.organizationLogoPreview
                                            }
                                            alt="সংস্থার ছবির প্রিভিউ"
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    ) : (
                                        <ImagePlus
                                            className="h-5.25 w-5.25 text-[#6f8782]"
                                            strokeWidth={1.7}
                                        />
                                    )}
                                </span>

                                {/* INFO */}

                                <div className="min-w-0 flex-1">
                                    <p
                                        className="
                                            truncate
                                            font-['Noto_Sans_Bengali']
                                            text-[14px]
                                            font-semibold
                                            text-[#263b38]
                                        "
                                    >
                                        {formData.organizationLogo?.name ||
                                            'সংস্থার ছবি যোগ করুন'}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            font-['Noto_Sans_Bengali']
                                            text-[13px]
                                            leading-6
                                            text-[#758480]
                                        "
                                    >
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
                                id="orgPhoto"
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

export default StepOrganizationProfile;
