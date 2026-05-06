import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <>
            <h1>AdminLayout</h1>
            <div>
                <AdminSidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default AdminLayout;
