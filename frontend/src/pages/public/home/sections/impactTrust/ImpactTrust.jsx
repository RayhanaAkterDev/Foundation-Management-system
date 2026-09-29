import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import StoriesPreview from './StoriesPreview';
import FinalCTA from './FinalCTA';

const ImpactTrust = () => {
    return (
        <section className="section-gap border-t border-border">
            <div className="container-width">
                {/* Heading */}
                <Motion variant="fadeUp">
                    <SectionHeading
                        align="left"
                        badge={{
                            label: 'স্বচ্ছতা ও আস্থা',
                            variant: 'primary',
                            tone: 'solid',
                            size: 'lg',
                        }}
                        title={
                            <>
                                প্রতিটি প্রভাব বাস্তব।
                                <span className="block pt-1 text-primary">
                                    প্রতিটি উদ্যোগ যাচাইকৃত।
                                </span>
                            </>
                        }
                        headingSize="sectionHero"
                        description="বাস্তব পরিস্থিতিতে যাচাইকৃত সহায়তার অনুরোধের মাধ্যমে প্রয়োজনীয় মানুষের কাছে সহায়তা পৌঁছায়।"
                        descriptionSize="sectionHero"
                    />
                </Motion>

                {/* Content Stack */}
                <div className="mt-8 space-y-10 sm:mt-12 sm:space-y-12">
                    {/* Real Community Testimonial */}
                    <Motion variant="softLift">
                        <StoriesPreview />
                    </Motion>

                    {/* Final CTA */}
                    <Motion variant="softLift">
                        <FinalCTA />
                    </Motion>
                </div>
            </div>
        </section>
    );
};

export default ImpactTrust;
