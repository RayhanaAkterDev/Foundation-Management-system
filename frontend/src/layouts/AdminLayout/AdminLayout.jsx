import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    return (
        <>
            <h1>AdminLayout</h1>
            <div>
                <Sidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default AdminLayout;
