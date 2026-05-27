import { useEffect, useState } from 'react';

const StatValue = ({ value, className }) => {
    const raw = value?.toString() || '';

    const match = raw.match(/[\d,.]+/);
    const number = match ? Number(match[0].replace(/,/g, '')) : null;

    const suffix = raw.replace(/[\d,.]/g, '');

    // ✅ hooks MUST be here (top level)
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!number) return;

        let start = 0;
        const duration = 2000;
        const step = number / (duration / 16);

        const timer = setInterval(() => {
            start += step;

            if (start >= number) {
                setCount(number);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [number]);

    // ✅ AFTER hooks only return UI
    if (!number) {
        return <h3 className={className}>{value}</h3>;
    }

    return (
        <h3 className={className}>
            {count.toLocaleString()}
            {suffix}
        </h3>
    );
};

export default StatValue;
