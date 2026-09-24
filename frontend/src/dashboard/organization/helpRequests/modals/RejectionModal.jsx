import { RefreshCcw, X } from 'lucide-react';

const RejectionModal = ({
    request,
    note,
    setNote,
    error,
    setError,
    loading,
    onClose,
    onSubmit,
}) => {
    if (!request) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-lg overflow-hidden bg-white shadow-2xl">
                <div className="border-b border-[#e1e8ea] bg-[#f7f9fa] px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9aa6aa]">
                                Reject assignment
                            </p>

                            <h3 className="mt-2 text-[20px] font-semibold tracking-tight text-[#263940]">
                                Why can’t your organization take this case?
                            </h3>

                            <p className="mt-2 text-[12px] leading-5 text-[#7d8b90]">
                                Please provide a reason. This message will be
                                sent to the admin who assigned this case.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#8c999d] transition hover:bg-[#eaf0f1] hover:text-[#263940] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close rejection modal"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="mb-4 border border-[#e1e8ea] bg-[#fafcfc] px-4 py-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa6aa]">
                            Help request
                        </p>

                        <p className="mt-1 text-[13px] font-semibold text-[#34484f]">
                            {request.title}
                        </p>
                    </div>

                    <label
                        htmlFor="rejection-note"
                        className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#66777d]"
                    >
                        Rejection reason
                    </label>

                    <textarea
                        id="rejection-note"
                        value={note}
                        onChange={(event) => {
                            setNote(event.target.value);

                            if (error) {
                                setError('');
                            }
                        }}
                        disabled={loading}
                        rows={6}
                        maxLength={2000}
                        placeholder="Explain why your organization cannot take this help request..."
                        className="mt-2 w-full resize-none border border-[#d5e0e3] bg-white px-4 py-3 text-[13px] leading-6 text-[#34484f] outline-none transition placeholder:text-[#a4afb3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#f5f7f7]"
                    />

                    <div className="mt-2 flex items-center justify-between">
                        {error ? (
                            <p className="text-[11px] font-medium text-red-600">
                                {error}
                            </p>
                        ) : (
                            <span />
                        )}

                        <span className="text-[10px] text-[#9aa6aa]">
                            {note.length}/2000
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#e1e8ea] bg-[#fafbfb] px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="border border-[#d5e0e3] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#66777d] transition hover:bg-[#eef3f4] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-[#b43d3d] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#983333] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                                Rejecting...
                            </>
                        ) : (
                            <>
                                <X className="h-3.5 w-3.5" />
                                Reject assignment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
