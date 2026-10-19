import React, { useEffect } from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';
import LoadingUI from '@/components/dashboard/LoadingUI';

const DeleteModal = ({ user, loading = false, error, onClose, onConfirm }) => {
    useEffect(() => {
        if (!user) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !loading) onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [user, loading, onClose]);

    if (!user) return null;

    const initials = (user.name || 'User')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const roleLabel =
        user.role === 'organization'
            ? 'Organization'
            : user.role === 'admin'
              ? 'Administrator'
              : 'Individual';

    return (
        <div
            role="presentation"
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#05070A]/75 p-4 backdrop-blur-[2px] sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading)
                    onClose?.();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-user-title"
                aria-describedby="delete-user-description"
                className="w-full max-w-[450px] overflow-hidden rounded-[10px] border border-[#343B46] bg-[#191E26] shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
            >
                <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#603A43] bg-[#302329] text-[#E29AA1]">
                            <Trash2 size={18} strokeWidth={1.8} />
                        </div>
                        <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={onClose}
                            disabled={loading}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#8792A1] transition-colors hover:bg-[#252C36] hover:text-[#F1F2F4] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <X size={17} strokeWidth={1.7} />
                        </button>
                    </div>

                    <h2
                        id="delete-user-title"
                        className="mt-5 font-sans! text-[21px] font-semibold! leading-[1.4] text-[#F1F2F4]!"
                    >
                        Delete this user?
                    </h2>
                    <p
                        id="delete-user-description"
                        className="mt-2 font-sans! text-[13px] leading-[1.7] text-[#9BA5B3]!"
                    >
                        You're about to permanently delete this account. This
                        action cannot be undone.
                    </p>

                    <div className="mt-6 flex min-w-0 items-center gap-3.5 rounded-lg border border-[#333C48] bg-[#1F2630] px-3.5 py-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#303A47] font-sans! text-[12px] font-semibold! text-[#D4DAE2]!">
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <p className="min-w-0 break-words font-sans! text-[13px] font-semibold! text-[#EDF0F4]!">
                                    {user.name || 'Unnamed user'}
                                </p>
                                <span className="font-sans! text-[11px] text-[#8591A1]!">
                                    {roleLabel}
                                </span>
                            </div>
                            <p className="mt-1 break-all font-sans! text-[12px] leading-5 text-[#98A3B2]!">
                                {user.email || 'No email address'}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mt-4 flex items-start gap-2.5 rounded-md border border-[#654047] bg-[#302329] px-3.5 py-3 text-[#E2A0A6]"
                        >
                            <AlertCircle
                                size={15}
                                className="mt-0.5 shrink-0"
                            />
                            <p className="font-sans! text-[12px] leading-5">
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                <footer className="flex flex-col-reverse gap-2.5 border-t border-[#303844] px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-10 rounded-md border border-[#3A4452] bg-transparent px-5 font-sans! text-[13px] font-medium! text-[#C7CFD9]! transition-colors hover:border-[#536071] hover:bg-[#252D38] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#B4515B] bg-[#A54450] px-5 font-sans! text-[13px] font-semibold! text-white! transition-colors hover:bg-[#B34C58] disabled:cursor-not-allowed disabled:opacity-55 sm:min-w-[142px]"
                    >
                        {loading ? (
                            <LoadingUI variant="button" title="Deleting..." />
                        ) : (
                            <>
                                <Trash2 size={14} strokeWidth={1.8} />
                                Delete user
                            </>
                        )}
                    </button>
                </footer>
            </section>
        </div>
    );
};

export default DeleteModal;
