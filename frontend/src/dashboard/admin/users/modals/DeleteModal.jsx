import React from 'react';

import { AlertTriangle, X, Trash2 } from 'lucide-react';

const DeleteModal = ({ user, loading, error, onClose, onConfirm }) => {
    if (!user) {
        return null;
    }

    const initials =
        user.name
            ?.split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'U';

    const roleLabel =
        user.role === 'organization'
            ? 'Organization'
            : user.role === 'admin'
              ? 'Administrator'
              : 'Individual';

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/50
                p-3
                backdrop-blur-xs
                sm:p-5
                lg:p-6
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            aria-describedby="delete-user-description"
        >
            <div
                className="
                    flex
                    w-full
                    max-w-125
                    max-h-[calc(100dvh-1.5rem)]
                    flex-col
                    overflow-hidden
                    border
                    border-border
                    bg-surface
                    shadow-[0_28px_80px_rgba(15,23,42,0.18)]
                    sm:max-h-[calc(100dvh-2.5rem)]
                    lg:max-h-[calc(100dvh-3rem)]
                "
            >
                {/* HEADER */}
                <header
                    className="
                        shrink-0
                        px-5
                        pt-5
                        sm:px-7
                        sm:pt-7
                    "
                >
                    <div className="flex items-start justify-between gap-4 sm:gap-5">
                        <div className="min-w-0 flex-1">
                            <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
                                <span className="h-1.5 w-1.5 shrink-0 bg-red-500" />

                                <span
                                    className="
                                        font-jost
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.15em]
                                        text-red-600
                                        sm:text-[10px]
                                        sm:tracking-[0.16em]
                                    "
                                >
                                    Delete account
                                </span>
                            </div>

                            <h2
                                id="delete-user-title"
                                className="
                                    font-fraunces
                                    text-[25px]
                                    font-medium
                                    leading-[1.1]
                                    tracking-tight
                                    text-text-primary
                                    min-[380px]:text-[27px]
                                    sm:text-[30px]
                                "
                            >
                                Delete this account?
                            </h2>

                            <p
                                id="delete-user-description"
                                className="
                                    mt-2
                                    max-w-105
                                    font-jost
                                    text-[11.5px]
                                    leading-[1.6]
                                    text-text-secondary
                                    sm:mt-2.5
                                    sm:text-[12px]
                                    sm:leading-[1.65]
                                "
                            >
                                The account and its platform access will be
                                permanently removed.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="Close"
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                text-text-secondary
                                transition-colors
                                hover:bg-background-alt
                                hover:text-text-primary
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:h-9
                                sm:w-9
                            "
                        >
                            <X size={18} strokeWidth={1.7} />
                        </button>
                    </div>
                </header>

                {/* ACCOUNT */}
                <section
                    className="
                        shrink-0
                        px-5
                        pt-5
                        sm:px-7
                        sm:pt-6
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                            border-y
                            border-border
                            py-3.5
                            sm:gap-3.5
                            sm:py-4
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                bg-primary
                                font-fraunces
                                text-[14px]
                                font-medium
                                text-white
                                sm:h-11
                                sm:w-11
                                sm:text-[15px]
                            "
                        >
                            {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    truncate
                                    font-jost
                                    text-[13px]
                                    font-semibold
                                    text-text-primary
                                    sm:text-[14px]
                                "
                            >
                                {user.name}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    font-jost
                                    text-[10.5px]
                                    text-text-secondary
                                    sm:text-[11.5px]
                                "
                            >
                                {user.email}
                            </p>
                        </div>

                        <div
                            className="
                                hidden
                                shrink-0
                                text-right
                                min-[430px]:block
                            "
                        >
                            <p
                                className="
                                    font-jost
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.13em]
                                    text-text-secondary
                                    sm:text-[9px]
                                "
                            >
                                Role
                            </p>

                            <p
                                className="
                                    mt-1
                                    font-jost
                                    text-[10.5px]
                                    font-semibold
                                    text-text-primary
                                    sm:text-[11.5px]
                                "
                            >
                                {roleLabel}
                            </p>
                        </div>
                    </div>

                    {/* Compact role on very narrow screens */}
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-border
                            py-2.5
                            min-[430px]:hidden
                        "
                    >
                        <span
                            className="
                                font-jost
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.13em]
                                text-text-secondary
                            "
                        >
                            Role
                        </span>

                        <span
                            className="
                                font-jost
                                text-[10.5px]
                                font-semibold
                                text-text-primary
                            "
                        >
                            {roleLabel}
                        </span>
                    </div>
                </section>

                {/* WARNING */}
                <section
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-5
                        py-4.5
                        sm:px-7
                        sm:py-6
                    "
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle
                            size={16}
                            strokeWidth={1.8}
                            className="
                                mt-0.5
                                shrink-0
                                text-accent
                            "
                        />

                        <div className="min-w-0">
                            <p
                                className="
                                    font-jost
                                    text-[11.5px]
                                    font-semibold
                                    text-text-primary
                                    sm:text-[12px]
                                "
                            >
                                This action cannot be undone
                            </p>

                            <p
                                className="
                                    mt-1
                                    max-w-105
                                    font-jost
                                    text-[10.5px]
                                    leading-[1.65]
                                    text-text-secondary
                                    sm:text-[11px]
                                "
                            >
                                The user will lose access immediately and the
                                account will no longer be available through the
                                platform.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="
                                mt-4
                                border-l-2
                                border-red-500
                                bg-red-50
                                px-3
                                py-2.5
                                sm:mt-5
                                sm:px-3.5
                                sm:py-3
                            "
                            role="alert"
                        >
                            <p
                                className="
                                    wrap-break-words
                                    font-jost
                                    text-[10.5px]
                                    font-medium
                                    leading-5
                                    text-red-700
                                    sm:text-[11px]
                                "
                            >
                                {error}
                            </p>
                        </div>
                    )}
                </section>

                {/* FOOTER */}
                <footer
                    className="
                        shrink-0
                        flex
                        flex-col
                        gap-2.5
                        border-t
                        border-border
                        bg-background-alt/35
                        px-5
                        py-3.5
                        sm:flex-row
                        sm:items-center
                        sm:justify-end
                        sm:px-7
                        sm:py-4
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            h-10
                            w-full
                            border
                            border-border
                            bg-surface
                            px-5
                            font-jost
                            text-[11.5px]
                            font-semibold
                            text-text-primary
                            transition-colors
                            hover:bg-background-alt
                            disabled:pointer-events-none
                            disabled:opacity-50
                            sm:w-auto
                            sm:text-[12px]
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            inline-flex
                            h-10
                            w-full
                            items-center
                            justify-center
                            gap-2
                            bg-red-600
                            px-5
                            font-jost
                            text-[11.5px]
                            font-semibold
                            text-white
                            transition-colors
                            hover:bg-red-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-500/20
                            disabled:pointer-events-none
                            disabled:opacity-60
                            sm:w-auto
                            sm:min-w-35
                            sm:text-[12px]
                        "
                    >
                        {loading ? (
                            <>
                                <span
                                    className="
                                        h-3.5
                                        w-3.5
                                        animate-spin
                                        border-2
                                        border-white/35
                                        border-t-white
                                    "
                                />

                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 size={15} strokeWidth={1.9} />

                                <span>Delete account</span>
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default DeleteModal;
