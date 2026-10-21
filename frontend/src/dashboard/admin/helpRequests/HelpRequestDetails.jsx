import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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

    if (loading) {
        return (
            <LoadingUI
                variant="page"
                title="Loading help request..."
                description="Please wait while we retrieve the request details."
            />
        );
    }

    if (error || !request) {
        return (
            <div className="space-y-4 py-5">
                <LoadingError
                    title="Unable to load help request"
                    message={error || 'Help request not found.'}
                    onRetry={handleRetry}
                />

                <button
                    type="button"
                    onClick={() => navigate(BASE)}
                    className="text-sm text-[#AEB7C3] transition-colors hover:text-[#EEF1F5]"
                >
                    Back to all help requests
                </button>
            </div>
        );
    }

    return (
        <>
            {isEditing ? (
                <HelpRequestEditView
                    key={request.id}
                    request={request}
                    saving={saving}
                    error={saveError}
                    onSave={handleSave}
                    onCancel={() => navigate(`${BASE}/${requestId}`)}
                />
            ) : (
                <HelpRequestDetailsView
                    request={request}
                    onEdit={() => navigate(`${BASE}/${requestId}/edit`)}
                    onBack={() => navigate(BASE)}
                />
            )}

            <SuccessDialog
                open={successOpen}
                title="Help request updated"
                message="The help request has been updated successfully."
                onClose={handleSuccessClose}
            />
        </>
    );
}

export default HelpRequestDetails;
