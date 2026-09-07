import PageHeader from '@/components/dashboard/PageHeader';

const HelpRequestErrorState = ({ error }) => (
    <div className="min-h-full bg-background">
        <div className="mx-auto w-full max-w-400 px-4 py-7 sm:px-6 lg:px-8">
            <PageHeader
                title="My Help Requests"
                subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
            />

            <div className="mt-10 overflow-hidden rounded-2xl border border-red-200 bg-white">
                <div className="border-l-4 border-red-500 bg-red-50 px-5 py-5 sm:px-6">
                    <p className="text-sm font-bold text-red-800">
                        Unable to load your requests
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-red-600">
                        {error}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default HelpRequestErrorState;
