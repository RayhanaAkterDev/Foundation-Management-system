// src/layouts/AuthLayout/AuthLayout.jsx

import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <main className="min-h-screen bg-background text-text-primary">
            <Outlet />
        </main>
    );
};

export default AuthLayout;
