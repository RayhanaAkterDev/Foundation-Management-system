/* =========================================================
   DATA FORMATTERS
========================================================= */

export const formatDate = (value) => {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString('en-BD', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatTime = (value) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleTimeString('en-BD', {
        hour: 'numeric',
        minute: '2-digit',
    });
};

export const formatAge = (value) => {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    const diffMs = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) {
        return 'just now';
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days === 1 ? '' : 's'} ago`;
};

export const formatUrgency = (urgency) => {
    const value = String(urgency || '').toLowerCase();

    if (value === 'critical') {
        return 'Critical';
    }

    if (value === 'high') {
        return 'High';
    }

    if (value === 'normal' || value === 'medium') {
        return 'Medium';
    }

    if (value === 'low') {
        return 'Low';
    }

    return 'Normal';
};

export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') {
        return 'Not provided';
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
        return String(amount);
    }

    return `৳${numericAmount.toLocaleString('en-BD')}`;
};

/* =========================================================
   ASSIGNMENT STATUS
========================================================= */

export const mapAssignmentStatus = (status) => {
    switch (String(status || '').toLowerCase()) {
        case 'pending':
            return 'pending';

        case 'accepted':
            return 'assigned';

        case 'in_progress':
        case 'in-progress':
            return 'active';

        case 'completed':
            return 'completed';

        case 'rejected':
            return 'rejected';

        /*
         * Keep support for the legacy volunteer-style
         * assignment status if it ever appears here.
         */
        case 'assigned':
            return 'assigned';

        default:
            return 'pending';
    }
};

/* =========================================================
   BACKEND ASSIGNMENT -> UI REQUEST
========================================================= */

export const normalizeAssignment = (assignment) => {
    /*
     * Laravel serializes the HelpRequest relationship as
     * "help_request" because the relationship method is
     * called helpRequest().
     *
     * Support both names to make this component resilient.
     */
    const helpRequest =
        assignment?.help_request || assignment?.helpRequest || {};

    const requester =
        helpRequest?.user ||
        helpRequest?.requester ||
        assignment?.requester ||
        null;

    const createdAt = helpRequest?.created_at || helpRequest?.createdAt;

    const assignedAt = assignment?.assigned_at || assignment?.assignedAt;

    const status = mapAssignmentStatus(assignment?.status);

    /*
     * OrganizationController currently loads:
     *
     * 'helpRequest'
     *
     * but does NOT currently load:
     *
     * 'helpRequest.user'
     *
     * Therefore, for now we use user_id as a truthful
     * fallback instead of showing fake requester data.
     */
    const requesterName =
        requester?.name ||
        (helpRequest?.user_id
            ? `Requester #${helpRequest.user_id}`
            : 'Requester unavailable');

    const location =
        helpRequest?.address ||
        helpRequest?.district ||
        'Location unavailable';

    return {
        /*
         * Assignment ID is the ID that must be sent to
         * /organization/assignments/{id}/accept|reject
         */
        id: assignment?.id,
        assignmentId: assignment?.id,

        /*
         * Actual Help Request ID
         */
        helpRequestId:
            helpRequest?.id || assignment?.help_request_id,

        /*
         * Help Request data
         */
        title: helpRequest?.title || 'No title provided',

        description:
            helpRequest?.description || 'No description provided.',

        category: helpRequest?.category || 'Not specified',

        district: helpRequest?.district || 'Not specified',

        /*
         * These fields are not currently present in the
         * HelpRequest model, so they remain null instead
         * of using mock values.
         */
        peopleAffected:
            helpRequest?.people_affected ??
            helpRequest?.peopleAffected ??
            null,

        amountNeeded:
            helpRequest?.amount_needed ??
            helpRequest?.amountNeeded ??
            null,

        urgency: formatUrgency(helpRequest?.urgency),

        /*
         * Assignment status is mapped to the original UI's
         * status names.
         */
        status,

        /*
         * Dates
         */
        submitted: formatDate(createdAt),

        submittedTime: formatTime(createdAt),

        assignmentAge: formatAge(assignedAt),

        /*
         * Requester
         */
        individual: requesterName,

        requesterId:
            helpRequest?.user_id ||
            requester?.id ||
            null,

        /*
         * Location
         */
        location,

        address: helpRequest?.address || null,

        /*
         * Assignment information
         */
        assignmentNote:
            assignment?.assignment_note ||
            assignment?.assignmentNote ||
            'No assignment note was provided.',

        rejectionNote:
            assignment?.rejection_note ||
            assignment?.rejectionNote ||
            null,

        /*
         * The current backend does not have a dedicated
         * support_type field, so category is the truthful
         * fallback.
         */
        supportType:
            helpRequest?.support_type ||
            helpRequest?.supportType ||
            helpRequest?.category ||
            'Not specified',

        /*
         * There is currently no progress field in the
         * HelpRequest model, so don't invent progress.
         */
        progress:
            helpRequest?.progress ??
            assignment?.progress ??
            null,

        lastUpdate: assignment?.updated_at
            ? `Assignment updated · ${formatDate(
                  assignment.updated_at,
              )}`
            : null,

        /*
         * Keep the original backend objects available
         * for future actions/debugging.
         */
        rawAssignment: assignment,

        rawHelpRequest: helpRequest,
    };
};