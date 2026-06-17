const RequestInput = ({ error, ...props }) => {
    return (
        <div>
            <input
                {...props}
                className={`w-full border rounded-xl px-4 py-3 bg-transparent outline-none ${
                    error ? 'border-red-400' : 'border-border'
                }`}
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default RequestInput;
