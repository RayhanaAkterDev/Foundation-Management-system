import React from 'react';
import DeleteConfirmDialog from '@/components/dashboard/DeleteConfirmDialog';

const HelpRequestDeleteModal = ({
    isOpen,
    request,
    deleting = false,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !request) return null;

    return (
        <DeleteConfirmDialog
            open={Boolean(isOpen && request)}
            item={request}
            entityLabel="help request"
            name={request.title || 'Untitled help request'}
            detail={
                request.status
                    ? `Status: ${String(request.status)
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}`
                    : 'Submitted help request'
            }
            image=""
            title="Delete help request?"
            description="This help request will be permanently removed from Stand For People. This action cannot be undone."
            confirmLabel="Delete request"
            loading={deleting}
            error={null}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
};

export default HelpRequestDeleteModal;
