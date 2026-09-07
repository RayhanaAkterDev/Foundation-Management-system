import HelpRequestDetailsModal from './HelpRequestDetailsModal';
import HelpRequestEditModal from './HelpRequestEditModal';
import HelpRequestModal from './HelpRequestModal';
import HelpRequestDeleteModal from './HelpRequestDeleteModal';
import OrganizationInfoDrawer from './OrganizationInfoDrawer';

const HelpRequestModals = ({
    showModal,
    handleCloseModal,
    handleRequestCreated,
    selectedRequest,
    handleCloseDetails,
    editingRequest,
    showEditModal,
    handleCloseEditModal,
    handleRequestUpdated,
    deleteRequestItem,
    deleteLoading,
    deleteError,
    handleCloseDeleteModal,
    handleDeleteConfirm,
    selectedOrganization,
    handleCloseOrganization,
}) => (
    <>
        <HelpRequestModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSuccess={handleRequestCreated}
        />

        {selectedRequest && (
            <HelpRequestDetailsModal
                isOpen={Boolean(selectedRequest)}
                request={selectedRequest}
                onClose={handleCloseDetails}
            />
        )}

        <HelpRequestEditModal
            key={editingRequest?.id || 'edit-help-request'}
            isOpen={showEditModal}
            request={editingRequest}
            onClose={handleCloseEditModal}
            onSuccess={handleRequestUpdated}
        />

        {deleteRequestItem && (
            <HelpRequestDeleteModal
                isOpen={Boolean(deleteRequestItem)}
                request={deleteRequestItem}
                loading={deleteLoading}
                deleting={deleteLoading}
                error={deleteError}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteConfirm}
            />
        )}

        <OrganizationInfoDrawer
            isOpen={Boolean(selectedOrganization)}
            organization={selectedOrganization?.organization}
            currentAssignment={selectedOrganization?.currentAssignment}
            assignments={selectedOrganization?.assignments || []}
            onClose={handleCloseOrganization}
        />
    </>
);

export default HelpRequestModals;
