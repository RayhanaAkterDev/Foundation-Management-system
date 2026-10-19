import React from 'react';
import {
    Check,
    Building2,
    ChevronDown,
    ShieldCheck,
    MailCheck,
} from 'lucide-react';
import { ORGANIZATION_TYPES } from '../data/organizationTypes';

const DropdownFilter = ({ label, icon: Icon, value, onChange, options }) => (
    <section className="border-t border-[#252D38] px-4 py-4">
        <label className="mb-3 flex items-center gap-2 px-1 text-[10px] font-semibold! uppercase text-[#697586]!">
            <Icon size={13} strokeWidth={1.7} />
            {label}
        </label>
        <div className="relative">
            <select
                aria-label={label}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-10 w-full appearance-none border border-[#29323E] bg-[#151B24] px-3 pr-9 text-[12px] font-medium! text-[#B8C0CA] outline-none transition-colors hover:border-[#394555] focus:border-[#586679] focus:ring-0"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={15}
                strokeWidth={1.8}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8792A1]"
            />
        </div>
    </section>
);

const Filters = ({
    typeFilter,
    onTypeChange,
    accountStatusFilter,
    onAccountStatusChange,
    emailVerificationFilter,
    onEmailVerificationChange,
}) => {
    const organizationTypes = [
        { value: 'all', label: 'All organization types' },
        ...ORGANIZATION_TYPES.map((type) => ({ value: type, label: type })),
    ];

    return (
        <div className="w-full bg-[#0E1219]">
            <section className="border-t border-[#252D38] px-4 py-4">
                <h4 className="mb-3 px-1 text-[10px] font-semibold! uppercase tracking-normal text-[#697586]!">
                    Organization type
                </h4>
                <div className="space-y-0.5">
                    {organizationTypes.map((type) => {
                        const active = typeFilter === type.value;
                        return (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => onTypeChange(type.value)}
                                aria-pressed={active}
                                className={`group flex min-h-9.5 w-full items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#697586] ${active ? 'bg-[#1A222D]' : 'bg-transparent hover:bg-[#151B24]'}`}
                            >
                                <Building2
                                    size={14}
                                    strokeWidth={1.75}
                                    className={`shrink-0 transition-colors duration-150 ${active ? 'text-[#C2CBD6]' : 'text-[#697586] group-hover:text-[#AEB7C3]'}`}
                                />
                                <span
                                    className={`min-w-0 flex-1 truncate text-[11px] leading-5 ${active ? 'font-semibold! text-[#EEF1F5]' : 'font-medium! text-[#8792A1] group-hover:text-[#B8C0CA]'}`}
                                >
                                    {type.label}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${active ? 'border-[#8493A6] bg-[#8493A6]' : 'border-[#455160] bg-transparent group-hover:border-[#697586]'}`}
                                >
                                    {active && (
                                        <Check
                                            size={9}
                                            strokeWidth={2.5}
                                            className="text-[#0E1219]"
                                        />
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>
            <DropdownFilter
                label="Account status"
                icon={ShieldCheck}
                value={accountStatusFilter}
                onChange={onAccountStatusChange}
                options={[
                    { value: 'all', label: 'All account statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'suspended', label: 'Suspended' },
                ]}
            />
            <DropdownFilter
                label="Email verification"
                icon={MailCheck}
                value={emailVerificationFilter}
                onChange={onEmailVerificationChange}
                options={[
                    { value: 'all', label: 'All email statuses' },
                    { value: 'verified', label: 'Verified' },
                    { value: 'unverified', label: 'Unverified' },
                ]}
            />
        </div>
    );
};

export default Filters;
