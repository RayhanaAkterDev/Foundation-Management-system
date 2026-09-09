import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const location = useLocation();

    const token =
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token');

    const userStorage =
        localStorage.getItem('user') || sessionStorage.getItem('user');

    /*
     * No authentication data
     * -----------------------
     * Public users should choose their account type first.
     * Admin authentication has its own separate login page.
     */

    if (!token || !userStorage) {
        const isAdminRoute = allowedRoles.includes('admin');

        return (
            <Navigate
                to={isAdminRoute ? '/admin/login' : '/account'}
                replace
                state={{ from: location }}
            />
        );
    }

    let user;

    try {
        user = JSON.parse(userStorage);
    } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');

        const isAdminRoute = allowedRoles.includes('admin');

        return (
            <Navigate to={isAdminRoute ? '/admin/login' : '/account'} replace />
        );
    }

    /*
     * Role protection
     * ---------------
     * Users who are already authenticated but try to access
     * another role's dashboard are returned to their own dashboard.
     */

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === 'individual') {
            return <Navigate to="/individual/dashboard" replace />;
        }

        if (user.role === 'organization') {
            return <Navigate to="/organization/dashboard" replace />;
        }

        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }

        // Unknown/invalid role
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');

        return <Navigate to="/account" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
