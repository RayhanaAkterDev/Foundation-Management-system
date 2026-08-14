export const logout = (navigate) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');

    navigate('/account', { replace: true });
};