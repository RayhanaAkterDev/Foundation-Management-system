import { useState } from 'react';

const CampaignStory = ({ story = [] }) => {
    const [expanded, setExpanded] = useState(false);

    const visibleStory = expanded ? story : story.slice(0, 3);

    return (
        <section className="">
            {/* SECTION TITLE */}
            <h2 className="text-3xl font-semibold text-text-primary py-6">
                The Story
            </h2>

            <div className="relative">
                <div
                    className={`space-y-8 ${expanded ? '' : 'max-h-55 overflow-hidden'}`}
                >
                    {visibleStory.map((paragraph, index) => (
                        <p
                            key={index}
                            className="text-lg leading-9 text-text-secondary"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-right">
                    {story.length > 3 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="
                                mt-8
                                text-primary
                                font-medium
                                hover:text-primary-hover
                                transition-all duration-200 border-b border-transparent hover:border-primary/60
                            "
                        >
                            {expanded ? 'Show Less ←' : 'Continue Reading →'}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CampaignStory;
