import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import { fetchHelpRequests, updateHelpRequest } from './api/helpRequestAPI';

import HelpRequestDetailsView from './components/HelpRequestDetailsView';
import HelpRequestEditView from './components/HelpRequestEditView';

const BASE = '/admin/dashboard/help-requests';

function HelpRequestDetails() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isEditing = location.pathname.endsWith('/edit');

    const [requestState, setRequestState] = useState({
        requestId: null,
        request: null,
        loading: true,
        error: '',
        reloadKey: 0,
    });

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);

    const { request, error } = requestState;

    const loading =
        requestState.loading || requestState.requestId !== requestId;

    useEffect(() => {
        let cancelled = false;

        async function loadRequest() {
            try {
                const response = await fetchHelpRequests();

                const requests = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.helpRequests)
                      ? response.helpRequests
                      : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.data?.data)
                          ? response.data.data
                          : [];

                const selected = requests.find(
                    (item) => String(item.id) === String(requestId),
                );

                if (!selected) {
                    throw new Error('Help request not found.');
                }

                if (!cancelled) {
                    setRequestState((current) => ({
                        ...current,
                        requestId,
                        request: selected,
                        loading: false,
                        error: '',
                    }));
                }
            } catch (err) {
                if (!cancelled) {
                    setRequestState((current) => ({
                        ...current,
                        requestId,
                        request: null,
                        loading: false,
                        error: err?.message || 'Unable to load help request.',
                    }));
                }
            }
        }

        loadRequest();

        return () => {
            cancelled = true;
        };
    }, [requestId, requestState.reloadKey]);

    const handleRetry = () => {
        setRequestState((current) => ({
            ...current,
            requestId: null,
            request: null,
            loading: true,
            error: '',
            reloadKey: current.reloadKey + 1,
        }));
    };

    const handleSave = async (payload) => {
        if (saving || !request) return;

        setSaving(true);
        setSaveError('');

        try {
            await updateHelpRequest(request.id, payload);

            setRequestState((current) => ({
                ...current,
                request: current.request
                    ? {
                          ...current.request,
                          ...payload,
                      }
                    : null,
            }));

            setSuccessOpen(true);
        } catch (err) {
            setSaveError(err?.message || 'Unable to update help request.');
        } finally {
            setSaving(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccessOpen(false);

        navigate(`${BASE}/${requestId}`, {
            replace: true,
        });
    };

    const handleBack = () => {
        navigate(BASE);
    };

    const handleCancelEdit = () => {
        navigate(`${BASE}/${requestId}`);
    };

    const header = (
        <PageHeader
            title={isEditing ? 'Edit help request' : 'Help request details'}
            subtitle={
                isEditing
                    ? 'Update the information associated with this request.'
                    : 'Review request information, verification and assignments.'
            }
            action={
                <button
                    type="button"
                    onClick={isEditing ? handleCancelEdit : handleBack}
                    className="
                        inline-flex min-h-10 items-center
                        justify-center gap-2
                        border border-[#343E4B]
                        bg-[#151C25] px-4
                        text-[13px] font-medium text-[#C4CDD8]
                        transition-colors
                        hover:bg-[#202A35]
                        hover:text-[#EEF1F5]
                    "
                >
                    <ArrowLeft size={15} strokeWidth={1.8} />
                    {isEditing ? 'Back to details' : 'All help requests'}
                </button>
            }
        />
    );

    if (loading) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingUI
                    variant="page"
                    title={
                        isEditing
                            ? 'Loading request for editing...'
                            : 'Loading help request...'
                    }
                    description="Retrieving help request information."
                />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingError
                    title="Unable to load help request"
                    message={error || 'Help request not found.'}
                    onRetry={handleRetry}
                />
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans">
            {header}

            {isEditing ? (
                <HelpRequestEditView
                    key={request.id}
                    request={request}
                    saving={saving}
                    error={saveError}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <HelpRequestDetailsView
                    request={request}
                    onEdit={() => navigate(`${BASE}/${requestId}/edit`)}
                    onBack={handleBack}
                />
            )}

            <SuccessDialog
                open={successOpen}
                title="Help request updated"
                message="The help request has been updated successfully."
                onClose={handleSuccessClose}
            />
        </div>
    );
}

export default HelpRequestDetails;
