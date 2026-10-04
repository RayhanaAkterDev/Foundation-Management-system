import React from 'react';

const cases = [
    {
        rank: '০১',
        title: 'জরুরি চিকিৎসা',
        level: 'তাৎক্ষণিক ব্যবস্থা',
        score: '৯৮',
        width: '98%',
        tone: 'bg-[#c86f63]',
        text: 'text-[#b65f54]',
    },
    {
        rank: '০২',
        title: 'খাদ্য সহায়তা',
        level: 'উচ্চ অগ্রাধিকার',
        score: '৯২',
        width: '92%',
        tone: 'bg-accent',
        text: 'text-[#b97918]',
    },
    {
        rank: '০৩',
        title: 'আশ্রয় সহায়তা',
        level: 'সাধারণ অগ্রাধিকার',
        score: '৮৪',
        width: '84%',
        tone: 'bg-primary',
        text: 'text-primary',
    },
];

const PriorityDiagram = () => {
    return (
        <div className="mx-auto w-full max-w-[590px] font-bengali">
            <div
                className="
                    flex
                    items-end
                    justify-between
                    gap-6
                    border-b
                    border-black/10
                    pb-5
                "
            >
                <div>
                    <span
                        className="
                            text-[0.72rem]
                            text-text-muted
                        "
                    >
                        অগ্রাধিকার বিশ্লেষণ
                    </span>

                    <h4
                        className="
                            mt-1
                            text-[1.05rem]
                            font-semibold
                        "
                    >
                        কোন প্রয়োজন আগে মনোযোগ পাবে?
                    </h4>
                </div>

                <span
                    className="
                        text-[0.72rem]
                        text-text-muted
                    "
                >
                    AI সহায়ক মূল্যায়ন
                </span>
            </div>

            <div>
                {cases.map((item) => (
                    <div
                        key={item.rank}
                        className="
                            grid
                            grid-cols-[38px_1fr_58px]
                            gap-4
                            border-b
                            border-black/[0.08]
                            py-6

                            sm:grid-cols-[45px_1fr_72px]
                        "
                    >
                        <span
                            className="
                                pt-1
                                text-[0.72rem]
                                font-semibold
                                text-text-muted
                            "
                        >
                            {item.rank}
                        </span>

                        <div>
                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <h5
                                    className="
                                        text-[0.95rem]
                                        font-semibold
                                    "
                                >
                                    {item.title}
                                </h5>

                                <span
                                    className={`
                                        text-[0.7rem]
                                        font-medium!
                                        ${item.text}
                                    `}
                                >
                                    {item.level}
                                </span>
                            </div>

                            <div
                                className="
                                    mt-4
                                    h-1.5
                                    overflow-hidden
                                    bg-[#e8e9e6]
                                "
                            >
                                <div
                                    className={`h-full ${item.tone}`}
                                    style={{
                                        width: item.width,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="text-right">
                            <strong
                                className={`
                                    text-[2rem]
                                    font-medium!
                                    leading-none

                                    sm:text-[2.3rem]

                                    ${item.text}
                                `}
                            >
                                {item.score}
                            </strong>

                            <span
                                className="
                                    mt-1
                                    block
                                    text-[0.62rem]
                                    text-text-muted
                                "
                            >
                                স্কোর
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="
                    mt-5
                    flex
                    items-start
                    gap-3
                "
            >
                <span
                    className="
                        mt-2
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-primary
                    "
                />

                <p
                    className="
                        text-[0.72rem]
                        leading-[1.7]
                        text-text-muted
                    "
                >
                    জরুরিতা, সম্ভাব্য প্রভাব, পরিস্থিতি এবং উপলভ্য সম্পদের মতো
                    সংকেত অগ্রাধিকার নির্ধারণে বিবেচিত হয়।
                </p>
            </div>
        </div>
    );
};

export default PriorityDiagram;
