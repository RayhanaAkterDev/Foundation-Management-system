const UrgencyBadge = ({ urgency, dark = false }) => {
    const lightStyles = {
        High: 'bg-[#fff0ed] text-[#ad5145]',
        Medium: 'bg-[#fff3d4] text-[#9a6908]',
        Low: 'bg-[#edf1f1] text-[#637379]',
        Critical: 'bg-[#fff0ed] text-[#ad5145]',
        Normal: 'bg-[#fff3d4] text-[#9a6908]',
    };

    const darkStyles = {
        High: 'bg-[#ffffff]/10 text-[#ffd3c9]',
        Medium: 'bg-[#ffffff]/10 text-[#ffe0a0]',
        Low: 'bg-[#ffffff]/10 text-white/65',
        Critical: 'bg-[#ffffff]/10 text-[#ffd3c9]',
        Normal: 'bg-[#ffffff]/10 text-[#ffe0a0]',
    };

    return (
        <span
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-[9px] font-bold ${
                dark
                    ? darkStyles[urgency] || darkStyles.Normal
                    : lightStyles[urgency] || lightStyles.Normal
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {urgency} priority
        </span>
    );
};

export default UrgencyBadge;
