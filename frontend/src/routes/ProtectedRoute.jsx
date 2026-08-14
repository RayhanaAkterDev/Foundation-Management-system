import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const location = useLocation();

    const token =
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token');

    const userStorage =
        localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!token || !userStorage) {
        return (
            <Navigate to="/account/login" replace state={{ from: location }} />
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

        return <Navigate to="/account/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === 'individual') {
            return <Navigate to="/dashboard/individual" replace />;
        }

        if (user.role === 'organization') {
            return <Navigate to="/dashboard/organization" replace />;
        }

        if (user.role === 'admin') {
            return <Navigate to="/dashboard/admin" replace />;
        }

        return <Navigate to="/account/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
