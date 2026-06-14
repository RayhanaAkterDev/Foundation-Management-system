import React from 'react';
import ProcessScene from './ProcessScene';
import scenes from './data/scenes';

const ProcessScenes = () => {
    return (
        <section className="relative py-14 md:py-18 lg:py-24 overflow-hidden">
            {/* Timeline line (desktop only) */}
            <div
                className="
                    absolute
                    left-1/2
                    top-0
                    bottom-0

                    hidden
                    md:block

                    w-px
                    bg-border/40
                    -translate-x-1/2
                "
            />

            <div className="space-y-16 md:space-y-20 lg:space-y-24">
                {scenes.map((scene, index) => (
                    <div key={scene.step} className="relative">
                        {/* connector spacing hint */}
                        {index !== scenes.length - 1 && (
                            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-12 w-px h-10 bg-border/30" />
                        )}

                        <ProcessScene {...scene} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProcessScenes;
