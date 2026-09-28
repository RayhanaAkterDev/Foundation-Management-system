import SectionHeading from '@/components/SectionHeading';

const OrganizationImpact = () => {
    return (
        <section className="section-gap container-width">
            <SectionHeading
                gap="md"
                badge={{
                    label: 'প্রতিষ্ঠানগুলোর ভূমিকা',
                    variant: 'primary',
                    size: 'lg',
                }}
                title={
                    <>
                        প্রতিষ্ঠানগুলোর সক্ষমতা,
                        <br className="hidden sm:block" /> মানুষের জন্য বাস্তব
                        সহায়তা
                    </>
                }
                headingSize="sectionHero"
                headingClass="max-w-3xl mx-auto"
                description="স্ট্যান্ড ফর পিপলে যুক্ত প্রতিষ্ঠানগুলো তাদের অভিজ্ঞতা, সম্পদ ও স্থানীয় সক্ষমতা কাজে লাগিয়ে মানবিক উদ্যোগ পরিচালনা এবং মানুষের কাছে সহায়তা পৌঁছে দিতে কাজ করে।"
                descriptionSize="hero"
                descriptionClass="lg:max-w-2xl mx-auto"
            />

            <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 lg:mt-16">
                <ImpactItem
                    number="01"
                    title="উদ্যোগ"
                    description="মানবিক প্রয়োজনকে কেন্দ্র করে কার্যকর ক্যাম্পেইন ও সহায়তা কার্যক্রম পরিচালনা।"
                />

                <ImpactItem
                    number="02"
                    title="সমন্বয়"
                    description="স্বেচ্ছাসেবী ও অন্যান্য সহায়তাকারীদের সঙ্গে সমন্বয় করে মাঠপর্যায়ের কাজ এগিয়ে নেওয়া।"
                />

                <ImpactItem
                    number="03"
                    title="সহায়তা"
                    description="নিজস্ব সক্ষমতা ও স্থানীয় উপস্থিতির মাধ্যমে প্রয়োজনীয় মানুষের কাছে সহায়তা পৌঁছে দেওয়া।"
                />
            </div>
        </section>
    );
};

const ImpactItem = ({ number, title, description }) => {
    return (
        <div
            className="
                rounded-2xl
                border border-border
                bg-surface
                p-5
                sm:p-6
                lg:p-7
            "
        >
            <span className="text-xs font-semibold tracking-[0.14em] text-primary">
                {number}
            </span>

            <h3 className="mt-4 text-lg font-semibold text-text-primary sm:text-xl">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-[15px]">
                {description}
            </p>
        </div>
    );
};

export default OrganizationImpact;
