import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

const WithdrawalModal = ({
    request,
    loading = false,
    error = '',
    onClose,
    onSubmit,
}) => {
    const [reason, setReason] = useState('');

    if (!request) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedReason = reason.trim();

        if (!trimmedReason) {
            return;
        }

        onSubmit(trimmedReason);
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        setReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md">
            <button
                type="button"
                aria-label="Close withdrawal request"
                onClick={handleClose}
                disabled={loading}
                className="absolute inset-0 cursor-default disabled:cursor-not-allowed"
            />

            <div className="relative z-10 w-full max-w-xl overflow-hidden border border-[#dce5e8] bg-white shadow-[0_35px_100px_rgba(15,23,42,0.25)]">
                {/* Header */}
                <div className="border-b border-[#e2e8ea] bg-[#fbfcfc] px-6 py-5">
                    <div className="flex items-start justify-between gap-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#f9ecea] text-[#ad554b]">
                                <RotateCcw
                                    className="h-4.5 w-4.5"
                                    strokeWidth={1.7}
                                />
                            </div>

                            <div>
                                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#9a7772]">
                                    Case management
                                </p>

                                <h2 className="mt-1.5 text-[17px] font-bold tracking-tight text-[#34484e]">
                                    Request withdrawal
                                </h2>

                                <p className="mt-2 max-w-md text-[10px] leading-5 text-[#89969b]">
                                    Tell administration why your organization
                                    can no longer continue this help request.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#8b989d] transition hover:bg-[#f0f3f4] hover:text-[#526269] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Case context */}
                    <div className="border-b border-[#e2e8ea] px-6 py-5">
                        <div className="border border-[#e0e7e9] bg-[#f8fafb] px-4 py-4">
                            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#929da2]">
                                Help request
                            </p>

                            <p className="mt-1.5 text-[12px] font-bold text-[#40535a]">
                                {request.title || 'Help request'}
                            </p>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="px-6 pt-5">
                        <div className="flex items-start gap-3 border border-[#eadcc0] bg-[#fffaf0] px-4 py-4">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#ad7508]" />

                            <p className="text-[10px] leading-5 text-[#78643c]">
                                Your request will be reviewed by administration.
                                The assignment will remain active until an
                                administrator makes a decision.
                            </p>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="px-6 py-5">
                        <label
                            htmlFor="withdrawal-reason"
                            className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#71857f]"
                        >
                            Reason for withdrawal
                        </label>

                        <textarea
                            id="withdrawal-reason"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            disabled={loading}
                            rows={6}
                            minLength={10}
                            maxLength={2000}
                            placeholder="Please explain why your organization can no longer continue this case..."
                            className="mt-2.5 w-full resize-none border border-[#d8e2e5] bg-white px-4 py-3 text-[11px] leading-6 text-[#40535a] outline-none transition placeholder:text-[#a1abad] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-[#f7f9fa]"
                        />

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-[9px] text-[#9aa5a9]">
                                Minimum 10 characters.
                            </p>

                            <p className="text-[9px] text-[#9aa5a9]">
                                {reason.length}/2000
                            </p>
                        </div>

                        {error && (
                            <div className="mt-4 border border-[#ead3d0] bg-[#fff7f6] px-4 py-3">
                                <p className="text-[10px] leading-5 text-[#9a5b53]">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2.5 border-t border-[#dce5e8] bg-white px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="border border-[#d8e1e4] bg-white px-4 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || reason.trim().length < 10}
                            className="inline-flex items-center gap-2 bg-[#a9554c] px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#91483f] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />

                            {loading
                                ? 'Submitting...'
                                : 'Submit withdrawal request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawalModal;
