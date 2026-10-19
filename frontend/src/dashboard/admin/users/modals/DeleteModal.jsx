import React from 'react';
import DeleteConfirmDialog from '@/components/dashboard/DeleteConfirmDialog';

export default function DeleteModal({
    user,
    loading = false,
    error,
    onClose,
    onConfirm,
}) {
    return (
        <DeleteConfirmDialog
            open={Boolean(user)}
            item={user}
            entityLabel="user"
            title="Delete user account?"
            description="This account will be permanently removed. This action cannot be undone."
            confirmLabel="Delete user"
            loading={loading}
            error={error}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
