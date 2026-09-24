import { RefreshCcw } from 'lucide-react';

const ErrorBanner = ({
    error,
    loading,
    onRetry,
}) => {
    if (!error) {
        return null;
    }

    return (
        <div className="border-b border-red-200 bg-red-50 px-6 py-4 sm:px-9 lg:px-11">
            <div className="flex items-start justify-between gap-5">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-700">
                        Unable to complete request
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-red-600">
                        {error}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRetry}
                    disabled={loading}
                    className="inline-flex shrink-0 items-center gap-2 border border-red-200 bg-white px-3 py-2 text-[9px] font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCcw
                        className={`h-3.5 w-3.5 ${
                            loading ? 'animate-spin' : ''
                        }`}
                    />

                    Retry
                </button>
            </div>
        </div>
    );
};

export default ErrorBanner;