import React from 'react';
import DeleteConfirmDialog from '@/components/dashboard/DeleteConfirmDialog';

/**
 * Organization-specific adapter for the shared confirmation dialog.
 * Keeps the existing Organizations page props and deletion handlers intact.
 */
const DeleteModal = ({
    organization,
    loading = false,
    error,
    onClose,
    onConfirm,
}) => {
    if (!organization) return null;

    const typeLabel = organization.organization_type
        ? String(organization.organization_type)
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())
        : 'Organization';

    const email =
        organization.user?.email || organization.email || 'No email available';

    return (
        <DeleteConfirmDialog
            open={Boolean(organization)}
            item={organization}
            entityLabel="organization"
            name={organization.name || 'Unnamed organization'}
            detail={`${typeLabel} · ${email}`}
            image={organization.user?.photo || organization.photo || ''}
            title="Delete organization?"
            description="This organization will be permanently removed from Stand For People. This action cannot be undone."
            confirmLabel="Delete organization"
            loading={loading}
            error={error}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
};

export default DeleteModal;
