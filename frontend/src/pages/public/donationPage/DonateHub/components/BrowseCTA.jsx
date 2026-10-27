import React from 'react';
import { Link } from 'react-router-dom';
import { TbArrowUpRight, TbArrowRight, TbHeartHandshake } from 'react-icons/tb';

const BrowseCTA = () => {
    return (
        <section className="relative overflow-hidden bg-[#f7f9f7]">
            <div className="container-width">
                <div className="relative border-t border-[#dce7e0] py-14 sm:py-16 lg:py-20">
                    <div className="mb-7 flex items-center gap-3 font-bengali text-[12px] font-medium text-[#61766a]">
                        <TbHeartHandshake size={20} className="text-primary" />
                        <span>আপনার অংশগ্রহণই পরিবর্তনের শুরু</span>
                    </div>

                    <div className="grid items-end gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.46fr)] lg:gap-16">
                        {/* Left: Main message */}
                        <div className="max-w-[690px]">
                            <h2 className="font-bengali text-[clamp(1.85rem,3vw,2.7rem)] font-semibold leading-[1.5] tracking-[-0.025em] text-[#152b28]">
                                আজই কারও পাশে দাঁড়ান।
                            </h2>

                            <p className="mt-5 max-w-[530px] font-bengali text-[13px] leading-[1.95] text-[#64766d] sm:text-[14px]">
                                আপনার সামান্য সহযোগিতাও কারও জীবনে বড়
                                পরিবর্তনের সূচনা করতে পারে। যাচাইকৃত উদ্যোগগুলো
                                ঘুরে দেখুন, নিজের মতো করে পাশে দাঁড়ান।
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col items-start gap-5 lg:items-start lg:pb-2">
                            <Link
                                to="/campaigns"
                                className="group inline-flex min-h-[48px] items-center justify-center gap-5 bg-primary px-6 py-3 font-bengali text-[13px] font-semibold !text-white transition-colors hover:bg-[#115e59] sm:px-7"
                            >
                                সকল ক্যাম্পেইন দেখুন
                                <TbArrowUpRight
                                    size={19}
                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </Link>

                            <Link
                                to="/campaigns?filter=urgent"
                                className="group inline-flex items-center gap-2 border-b border-[#b8cec2] pb-1.5 font-bengali text-[12px] font-semibold text-primary transition-colors hover:border-primary"
                            >
                                জরুরি সহায়তার আবেদন দেখুন
                                <TbArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Bottom closing line */}
                    <div className="mt-11 flex flex-col gap-4 border-t border-[#dce7e0] pt-5 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2.5">
                            <TbHeartHandshake
                                size={19}
                                stroke={1.5}
                                className="text-primary"
                            />

                            <p className="font-bengali text-[12px] text-[#61766a]">
                                সহমর্মিতা থেকেই শুরু হয় পরিবর্তন।
                            </p>
                        </div>

                        <span className="font-bengali text-[11px] font-medium text-[#81958a]">
                            একসঙ্গে আরও মানুষের পাশে
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrowseCTA;
