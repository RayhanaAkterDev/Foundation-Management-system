import { AlertCircle, RotateCcw, X } from 'lucide-react';

const WithdrawalModal = ({
    request,
    reason,
    setReason,
    loading,
    error,
    onClose,
    onSubmit,
}) => {
    if (!request) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-text-primary/55 px-4 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-hidden border border-[#dce5e8] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)]">
                {/* HEADER */}
                <div className="relative overflow-hidden bg-[#fff8f7] px-6 py-6 sm:px-7">
                    <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full border-28 border-[#f9ecea]" />

                    <div className="relative flex items-start justify-between gap-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#f9ecea] text-[#ad554b]">
                                <RotateCcw
                                    className="h-4 w-4"
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#ad554b]">
                                    Case management
                                </p>

                                <h2 className="mt-1.5 text-[18px] font-bold tracking-tight text-[#3d4d53]">
                                    Request withdrawal
                                </h2>

                                <p className="mt-2 max-w-md text-[10px] leading-5 text-[#7c898e]">
                                    Tell administration why your organization
                                    can no longer continue this case.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#dce4e7] bg-white text-[#879399] transition hover:bg-[#f7f9fa] hover:text-[#46565c] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close withdrawal request"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* CASE INFO */}
                <div className="border-b border-[#e4eaec] bg-[#f8fafb] px-6 py-4 sm:px-7">
                    <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#929da2]">
                        Case
                    </p>

                    <p className="mt-1.5 text-[12px] font-bold text-[#43545a]">
                        {request.title || 'Help request'}
                    </p>

                    {request.assignmentId && (
                        <p className="mt-1 text-[9px] text-[#8b989d]">
                            Assignment #{request.assignmentId}
                        </p>
                    )}
                </div>

                {/* FORM */}
                <div className="px-6 py-6 sm:px-7">
                    <label
                        htmlFor="withdrawal-reason"
                        className="mb-2.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-[#65767b]"
                    >
                        Reason for withdrawal
                    </label>

                    <textarea
                        id="withdrawal-reason"
                        value={reason ?? ''}
                        onChange={(event) => {
                            setReason(event.target.value);
                        }}
                        disabled={loading}
                        rows={7}
                        maxLength={2000}
                        placeholder="Please explain why your organization needs to withdraw from this case..."
                        className="w-full resize-none border border-[#d7e2e5] bg-white px-4 py-3.5 text-[11px] leading-6 text-[#43545a] outline-none transition placeholder:text-[#aab4b8] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-[#f4f7f7]"
                    />

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-[9px] text-[#929da2]">
                            Minimum 10 characters
                        </p>

                        <p className="text-[9px] text-[#929da2]">
                            {(reason ?? '').length}/2000
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 flex items-start gap-3 border border-[#ead3d0] bg-[#fff7f6] px-4 py-3.5">
                            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ad554b]" />

                            <p className="text-[10px] leading-5 text-[#9a5b53]">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="mt-6 border border-[#e8dddd] bg-[#fffafa] px-4 py-3.5">
                        <p className="text-[10px] leading-5 text-[#806b68]">
                            Your withdrawal request will be sent to
                            administration for review. The case will remain
                            assigned to your organization until the
                            administrator makes a decision.
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-end gap-2.5 border-t border-[#e0e7e9] bg-white px-6 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="border border-[#d8e1e4] bg-white px-4 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading || (reason ?? '').trim().length < 10}
                        className="inline-flex items-center gap-2 bg-[#ad554b] px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_5px_14px_rgba(173,85,75,0.14)] transition hover:bg-[#98483f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />

                        {loading
                            ? 'Submitting...'
                            : 'Submit withdrawal request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalModal;
