import PageHeader from '@/components/dashboard/PageHeader';

const HelpRequestLoadingState = () => (
    <div className="min-h-full">
        <div className="mx-auto w-full max-w-400 px-4 sm:px-6 lg:px-0">
            <PageHeader
                title="My Help Requests"
                subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
            />

            <div className="mt-10 flex min-h-105 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white px-5 py-8">
                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/15 bg-primary/5">
                        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary" />
                    </div>

                    <p className="text-sm font-bold text-text-primary">
                        Loading your help requests
                    </p>

                    <p className="mt-2 text-sm text-text-secondary">
                        Retrieving your latest request activity.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default HelpRequestLoadingState;
