// ============================================================
// ADMIN DASHBOARD HELPERS
// ============================================================

export const formatNumber = (value) =>
    new Intl.NumberFormat('en-US').format(Number(value || 0));

export const formatCurrency = (value) =>
    `৳${new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(Number(value || 0))}`;

export const getRequestTitle = (request) =>
    request?.title ||
    request?.subject ||
    request?.name ||
    'Help request';

export const getRequestLocation = (request) =>
    request?.location ||
    request?.district ||
    request?.address ||
    'Location not specified';

export const getRequestUrgency = (request) =>
    String(
        request?.urgency ||
            request?.priority ||
            'normal',
    ).toLowerCase();

export const getVerificationName = (item) =>
    item?.name ||
    item?.organization_name ||
    item?.organization?.name ||
    'Organization';

export const loadingSafeCount = (value) => value;