import { useState } from 'react';

const CampaignStory = ({ story = [] }) => {
    const [expanded, setExpanded] = useState(false);

    const visibleStory = expanded ? story : story.slice(0, 3);

    return (
        <section className="mt-16">
            <h2 className="text-3xl font-semibold text-text-primary mb-8">
                Our Story
            </h2>

            <div className="relative">
                <div
                    className={`space-y-8 overflow-hidden transition-all duration-500 ${
                        expanded ? '' : 'max-h-85'
                    }`}
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

                {!expanded && story.length > 3 && (
                    <div
                        className="
                            absolute
                            bottom-12
                            left-0
                            right-0
                            h-56
                            bg-linear-to-t
                            from-surface
                            to-transparent
                            pointer-events-none
                        "
                    />
                )}

                {story.length > 3 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="
                            mt-6
                            text-primary
                            font-medium
                            hover:text-primary-hover
                            transition-colors
                        "
                    >
                        {expanded ? 'Show Less ←' : 'Continue Reading →'}
                    </button>
                )}
            </div>
        </section>
    );
};

export default CampaignStory;
