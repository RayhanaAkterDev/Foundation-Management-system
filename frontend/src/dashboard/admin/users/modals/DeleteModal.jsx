import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

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

                bg-[#080A0D]/78
                p-4

                backdrop-blur-[3px]

                sm:p-6
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            aria-describedby="delete-user-description"
        >
            <div
                className="
                    relative

                    w-full
                    max-w-[440px]

                    overflow-hidden

                    border
                    border-[#3A4048]

                    bg-[#202429]

                    shadow-[0_30px_90px_rgba(0,0,0,0.5)]
                "
            >
                {/* =================================================
                    CLOSE
                ================================================== */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close"
                    className="
                        absolute
                        top-4
                        right-4
                        z-10

                        flex
                        h-8
                        w-8
                        items-center
                        justify-center

                        text-[#66717B]

                        transition-colors

                        hover:bg-[#292E34]
                        hover:text-[#DDE0E2]

                        disabled:pointer-events-none
                        disabled:opacity-40

                        focus:outline-none
                        focus:ring-0
                    "
                >
                    <X size={16} strokeWidth={1.8} />
                </button>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div
                    className="
                        px-6
                        pt-7
                        pb-7

                        sm:px-8
                        sm:pt-8
                        sm:pb-8
                    "
                >
                    {/* =================================================
                        DESTRUCTIVE ICON
                    ================================================== */}

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            border
                            border-[#57373C]

                            bg-[#302326]

                            text-[#D06B74]
                        "
                    >
                        <Trash2 size={18} strokeWidth={1.8} />
                    </div>

                    {/* =================================================
                        TITLE
                    ================================================== */}

                    <div className="mt-5">
                        <p
                            className="
                                text-[11px]
                                font-semibold!
                                uppercase
                                tracking-[0.16em]

                                text-[#A15C63]
                            "
                        >
                            Delete account
                        </p>

                        <h2
                            id="delete-user-title"
                            className="
                                mt-2

                                pr-8

                                text-[20px]
                                font-semibold!
                                leading-[1.3]
                                tracking-[-0.025em]

                                text-[#F0F1F2]!

                                sm:text-[21px]
                            "
                        >
                            Permanently delete this user?
                        </h2>

                        <p
                            id="delete-user-description"
                            className="
                                mt-2

                                max-w-[340px]

                                text-[13px]
                                leading-[1.7]

                                text-[#7B858E]
                            "
                        >
                            This account will be removed from Stand For People
                            and cannot be recovered.
                        </p>
                    </div>

                    {/* =================================================
                        USER
                    ================================================== */}

                    <div
                        className="
                            mt-7

                            flex
                            min-w-0
                            items-center
                            gap-3.5

                            border-y
                            border-[#343A42]

                            py-4
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

                                bg-[#292E33]

                                text-[13px]
                                font-semibold!
                                tracking-[-0.01em]

                                text-[#C8CDD1]
                            "
                        >
                            {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-2.5
                                "
                            >
                                <p
                                    className="
                                        min-w-0
                                        truncate

                                        text-[13px]
                                        font-semibold!

                                        text-[#E1E4E6]
                                    "
                                >
                                    {user.name}
                                </p>

                                <span
                                    className="
                                        shrink-0

                                        text-[11px]
                                        font-medium!!

                                        text-[#77818A]
                                    "
                                >
                                    {roleLabel}
                                </span>
                            </div>

                            <p
                                className="
                                    mt-1
                                    truncate

                                    text-[12px]

                                    text-[#747E88]
                                "
                            >
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        CONSEQUENCE
                    ================================================== */}

                    <div
                        className="
                            mt-5

                            flex
                            items-start
                            gap-2.5
                        "
                    >
                        <AlertTriangle
                            size={15}
                            strokeWidth={1.8}
                            className="
                                mt-[2px]
                                shrink-0

                                text-[#A96A70]
                            "
                        />

                        <p
                            className="
                                text-[12px]
                                leading-[1.65]

                                text-[#7B858E]
                            "
                        >
                            The user will lose platform access immediately. This
                            action cannot be undone.
                        </p>
                    </div>

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            role="alert"
                            className="
                                mt-5

                                border-l-2
                                border-[#B84F59]

                                bg-[#2A2023]

                                px-3.5
                                py-2.5
                            "
                        >
                            <p
                                className="
                                    text-[12px]
                                    font-medium!!
                                    leading-5

                                    text-[#D78C93]
                                "
                            >
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                {/* =================================================
                    ACTIONS
                ================================================== */}

                <footer
                    className="
                        flex
                        flex-col-reverse
                        gap-2.5

                        border-t
                        border-[#343A42]

                        bg-[#1C2024]

                        px-6
                        py-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-end
                        sm:px-8
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            h-10
                            w-full

                            px-5

                            text-[12px]
                            font-semibold!

                            text-[#A3ABB2]

                            transition-colors

                            hover:bg-[#262B30]
                            hover:text-[#E1E4E6]

                            disabled:pointer-events-none
                            disabled:opacity-50

                            focus:outline-none
                            focus:ring-0

                            sm:w-auto
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

                            bg-[#A8444D]

                            px-5

                            text-[12px]
                            font-semibold!

                            text-white!

                            transition-colors

                            hover:bg-[#B84C56]

                            disabled:pointer-events-none
                            disabled:opacity-55

                            focus:outline-none
                            focus:ring-0

                            sm:min-w-[142px]
                            sm:w-auto
                        "
                    >
                        {loading ? (
                            <>
                                <span
                                    className="
                                        h-3.5
                                        w-3.5

                                        animate-spin

                                        rounded-full

                                        border-2
                                        border-white/30
                                        border-t-white
                                    "
                                />

                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 size={14} strokeWidth={1.9} />

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
