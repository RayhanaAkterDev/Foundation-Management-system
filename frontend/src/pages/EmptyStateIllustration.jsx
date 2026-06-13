import React from "react";

const FloatingDot = ({ cx, cy, r, opacity = 0.2 }) => (
    <circle cx={cx} cy={cy} r={r} fill="currentColor" opacity={opacity} />
);

const Card = ({ x, y, w, h, opacity = 0.3 }) => (
    <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity={opacity}
    />
);

const EmptyStateIllustration = ({ type = "404" }) => {
    return (
        <svg
            viewBox="0 0 400 260"
            className="w-full max-w-sm text-primary"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* soft background shape */}
            <circle cx="200" cy="130" r="90" fill="currentColor" opacity="0.05" />

            {/* floating dots */}
            <FloatingDot cx={90} cy={70} r={3} />
            <FloatingDot cx={310} cy={60} r={4} opacity={0.15} />
            <FloatingDot cx={320} cy={190} r={5} opacity={0.1} />

            {/* stacked cards */}
            <Card x={150} y={80} w={120} h={130} opacity={0.35} />
            <Card x={165} y={95} w={120} h={130} opacity={0.2} />

            {/* 404 STATE */}
            {type === "404" && (
                <>
                    <text
                        x="200"
                        y="145"
                        textAnchor="middle"
                        fontSize="44"
                        fontWeight="600"
                        fill="currentColor"
                    >
                        404
                    </text>

                    <path
                        d="M120 170 C160 120, 240 220, 280 170"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        opacity="0.6"
                        fill="none"
                    />
                </>
            )}

            {/* EMPTY STATE */}
            {type === "empty" && (
                <text
                    x="200"
                    y="140"
                    textAnchor="middle"
                    fontSize="18"
                    fill="currentColor"
                    opacity="0.7"
                >
                    Nothing here yet
                </text>
            )}
        </svg>
    );
};

export default EmptyStateIllustration;