import React, { forwardRef } from 'react';

const DashboardInput = forwardRef(function DashboardInput(
    {
        id,
        name,
        label,
        type = 'text',
        as = 'input',
        variant = 'default',
        leftIcon: LeftIcon,
        rightElement,
        wrapperClassName = '',
        className = '',
        requiredMark = false,
        invalid = false,
        disabled = false,
        readOnly = false,
        rows = 4,
        ...props
    },
    ref,
) {
    const isBare = variant === 'bare';
    const isTextarea = as === 'textarea';

    const hasError =
        invalid ||
        props['aria-invalid'] === true ||
        props['aria-invalid'] === 'true';

    const inputId = id || name;

    const commonClasses = `
        block w-full min-w-0
        appearance-none rounded-none

        border-0! bg-transparent!
        shadow-none! outline-none! ring-0!

        font-sans! text-[14px] font-normal!
        tracking-normal text-[#D8DEE7]!
        caret-[#AAB7C8]

        placeholder:text-[#778393]!
        placeholder:font-normal!

        focus:border-0!
        focus:outline-none!
        focus:ring-0!

        disabled:cursor-not-allowed

        ${isBare ? 'px-3.5' : LeftIcon ? 'pl-10 pr-3.5' : 'px-3.5'}

        ${!isBare && rightElement ? 'pr-11' : ''}

        ${className}
    `;

    const input = isTextarea ? (
        <textarea
            {...props}
            id={inputId}
            name={name}
            ref={ref}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={hasError || undefined}
            className={`
                ${commonClasses}
                min-h-24 resize-y
                py-3 leading-6
            `}
        />
    ) : (
        <input
            {...props}
            id={inputId}
            name={name}
            type={type}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={hasError || undefined}
            className={`
                ${commonClasses}
                h-11
            `}
        />
    );

    if (isBare) return input;

    return (
        <div
            className={`
                group w-full min-w-0
                ${wrapperClassName}
            `}
        >
            {label && (
                <label
                    htmlFor={inputId}
                    className={`
                        mb-[7px] block font-sans!
                        text-[13px] font-medium!
                        leading-5

                        ${hasError ? 'text-[#C99AA2]!' : 'text-[#9BA7B6]!'}
                    `}
                >
                    {label}

                    {requiredMark && (
                        <span
                            aria-hidden="true"
                            className="ml-1 text-[#8793A2]!"
                        >
                            *
                        </span>
                    )}
                </label>
            )}

            <div
                className={`
                    relative flex w-full min-w-0
                    overflow-hidden

                    ${isTextarea ? 'items-stretch' : 'items-center'}

                    rounded-[4px]
                    border

                    transition-[background-color,border-color,box-shadow]
                    duration-150

                    ${
                        hasError
                            ? `
                                border-[#86545E]
                                bg-[#211E25]
                            `
                            : `
                                border-[#29313D]
                                bg-[#151B23]

                                shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]

                                hover:border-[#3C4654]
                                hover:bg-[#171E27]

                                focus-within:border-[#637489]
                                focus-within:bg-[#1A222D]
                                focus-within:shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]
                            `
                    }

                    ${disabled ? 'opacity-50' : ''}
                `}
            >
                {LeftIcon && (
                    <LeftIcon
                        size={16}
                        strokeWidth={1.7}
                        aria-hidden="true"
                        className={`
                            pointer-events-none
                            absolute left-3.5

                            ${isTextarea ? 'top-4' : 'top-1/2 -translate-y-1/2'}

                            text-[#8290A1]

                            transition-colors duration-150

                            group-focus-within:text-[#A9B7C8]
                        `}
                    />
                )}

                {input}

                {rightElement && (
                    <div
                        className={`
                            absolute right-2 z-10
                            flex items-center justify-center

                            ${isTextarea ? 'top-3' : 'top-1/2 -translate-y-1/2'}
                        `}
                    >
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
});

DashboardInput.displayName = 'DashboardInput';

export default DashboardInput;
