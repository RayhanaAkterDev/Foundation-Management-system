export const getIndividualDashboard = async () => {
    const token =
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token');

    if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await fetch('/api/individual/dashboard', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to load dashboard. Server returned ${response.status}.`);
    }

    return response.json();
};