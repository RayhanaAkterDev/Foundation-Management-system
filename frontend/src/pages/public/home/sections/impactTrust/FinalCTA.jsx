import React from 'react';

import Button from '@/components/Button';

import SectionHeading from '@/components/SectionHeading';

const FinalCTA = () => {
    return (
        <div className="grid grid-cols-1 items-end gap-8 pt-8 md:grid-cols-12 md:gap-10 md:pt-10 lg:gap-12 lg:pt-12">
            {/* Left content */}
            <div className="md:col-span-7">
                <p className="mb-3 text-sm text-text-secondary">
                    সহায়তা পৌঁছানোর আগে প্রতিটি অনুরোধ যাচাই করা হয়
                </p>

                <SectionHeading
                    align="left"
                    gap="sm"
                    title="আজই কি বাস্তব কোনো মানুষের পাশে দাঁড়াতে চান?"
                    headingClass="text-primary"
                    description="আপনার সহায়তা যাচাইকৃত ব্যক্তি ও প্রয়োজনমতো সহায়তা প্রয়োজন এমন কমিউনিটির কাছে পৌঁছাতে পারে।"
                />
            </div>

            {/* Right actions */}
            <div className="flex md:col-span-5 md:justify-end">
                <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto md:flex-col">
                    <Button size="lg" className="w-full md:w-auto">
                        সহায়তার উদ্যোগ দেখুন
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full md:w-auto"
                    >
                        অনুদান দিন
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FinalCTA;
