const steps = [
    'Submit Application',
    'Review Process',
    'Verification',
    'Orientation',
    'Volunteer Assignment',
];

const VolunteerJourney = () => {
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-12">How It Works</h2>

            <div className="relative border-l border-border pl-8 space-y-10">
                {steps.map((step, index) => (
                    <div key={step} className="relative">
                        <div className="absolute -left-11 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                        </div>

                        <h4 className="font-medium">{step}</h4>
                        <p className="text-sm text-text-secondary mt-1">
                            Step {index + 1} in your volunteer journey
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default VolunteerJourney;
