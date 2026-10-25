
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { TbWorld } from 'react-icons/tb';
import SectionHeading from '@/components/SectionHeading';

const BrowseCTA = () => {
    return (
        <section className="relative section-gap overflow-hidden">
            {/* subtle directional background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute -bottom-32 -right-25 w-100 h-100 bg-primary/10 blur-3xl rounded-full" />
            </div>

            <div className="container-width relative z-10">
                {/* centered minimal header */}
                <div className="text-center max-w-2xl mx-auto">
                    <TbWorld className="mx-auto text-4xl text-primary mb-5 opacity-90" />

                    <SectionHeading
                        title="সকল যাচাইকৃত ক্যাম্পেইন দেখুন"
                        headingSize="sectionHero"
                        description="অনুসন্ধান ও ফিল্টারের মাধ্যমে প্রকৃত সহায়তার প্রয়োজনগুলো খুঁজে নিন — স্বচ্ছতা ও বিশ্বাসযোগ্যতার ভিত্তিতে সাজানো প্রতিটি ক্যাম্পেইন।"
                        descriptionSize="hero"
                    />
                </div>

                {/* split CTA row (different feel than cards) */}
                <div className="mt-14 flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link to="/campaigns">
                        <Button className="px-10 py-3 text-base">
                            ক্যাম্পেইনগুলো ঘুরে দেখুন
                        </Button>
                    </Link>

                    <Link to="/campaigns?filter=urgent">
                        <button className="text-sm text-muted hover:text-primary transition">
                            জরুরি সহায়তার আবেদন দেখুন →
                        </button>
                    </Link>
                </div>

                {/* subtle trust line */}
                <p className="text-center text-xs text-muted mt-6">
                    স্বচ্ছ তথ্য • যাচাইকৃত আবেদন • তাৎক্ষণিক আপডেট
                </p>
            </div>
        </section>
    );
};

export default BrowseCTA;
