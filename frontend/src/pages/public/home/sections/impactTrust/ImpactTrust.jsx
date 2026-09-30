import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import StoriesPreview from './StoriesPreview';
import FinalCTA from './FinalCTA';

const ImpactTrust = () => {
    return (
        <section className="section-gap bg-background-teal">
            <div className="container-width">
                {/* Heading */}
                <Motion variant="fadeUp">
                    <SectionHeading
                        align="left"
                        title={
                            <>
                                প্রতিটি প্রভাব বাস্তব।
                                <span className="block text-primary">
                                    প্রতিটি উদ্যোগ যাচাইকৃত।
                                </span>
                            </>
                        }
                        headingSize="sectionHero"
                        headingClass="leading-18!"
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
