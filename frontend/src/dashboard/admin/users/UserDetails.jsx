// src/dashboard/admin/users/UserDetails.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CircleAlert, Pencil, X } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import EditUserView from './components/EditUserView';
import UserDetailsView from './components/UserDetailsView';

import { fetchUser, updateUserAndRefresh } from './api/userApi';

const UserDetails = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    /* =========================================================
       LOAD USER
    ========================================================== */

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            setLoading(true);
            setLoadError('');

            try {
                const data = await fetchUser(userId);

                if (!cancelled) {
                    setUser(data.user);
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(error?.message || 'Unable to load user.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    /* =========================================================
       NAVIGATION
    ========================================================== */

    const handleBack = () => {
        if (saving) return;

        navigate('/admin/dashboard/users');
    };

    /* =========================================================
       EDIT MODE
    ========================================================== */

    const handleStartEdit = () => {
        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        if (saving) return;

        setIsEditing(false);
        setSaveError('');
        setFieldErrors({});
    };

    /* =========================================================
       UPDATE USER
    ========================================================== */

    const handleUpdateUser = async (formData) => {
        if (!user) return;

        setSaving(true);
        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');

        try {
            const refreshed = await updateUserAndRefresh(user.id, formData);

            setUser(refreshed.user);
            setIsEditing(false);

            setSuccessMessage('User updated successfully.');
        } catch (error) {
            if (error?.status === 422 && error?.errors) {
                setFieldErrors(error.errors);
            }

            setSaveError(error?.message || 'Unable to update user.');
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       LOADING
    ========================================================== */

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="User Details"
                    subtitle="Loading account information..."
                />

                <div
                    className="
                        flex
                        min-h-[480px]
                        items-center
                        justify-center
                        border
                        border-[#343944]
                        bg-[#202329]
                    "
                >
                    <div className="text-center">
                        <div
                            className="
                                mx-auto
                                h-8
                                w-8
                                animate-spin
                                rounded-full
                                border-2
                                border-[#3A4048]
                                border-t-[#6E9B91]
                            "
                        />

                        <p
                            className="
                                mt-4
                                text-[13px]
                                font-semibold!
                                text-[#E8EAEC]
                            "
                        >
                            Loading user details
                        </p>

                        <p
                            className="
                                mt-1
                                text-[12px]
                                text-[#747E88]
                            "
                        >
                            Retrieving account information.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================
       LOAD ERROR
    ========================================================== */

    if (loadError || !user) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="User Details"
                    subtitle="The requested account could not be loaded."
                    action={
                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                                inline-flex
                                h-10
                                items-center
                                gap-2
                                border
                                border-[#3B424B]
                                bg-[#22262B]
                                px-4
                                text-[12px]
                                font-medium!
                                text-[#C5CBD0]
                                transition-colors
                                hover:border-[#505963]
                                hover:bg-[#292E34]
                                hover:text-[#F1F2F3]
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Back to users
                        </button>
                    }
                />

                <div
                    className="
                        flex
                        items-start
                        gap-3
                        border
                        border-[#5B383E]
                        bg-[#2C2024]
                        px-5
                        py-4
                    "
                >
                    <CircleAlert
                        size={17}
                        strokeWidth={1.8}
                        className="
                            mt-0.5
                            shrink-0
                            text-[#D38D96]
                        "
                    />

                    <div>
                        <p
                            className="
                                text-[12px]
                                font-semibold!
                                text-[#E7B0B6]
                            "
                        >
                            Unable to load user
                        </p>

                        <p
                            className="
                                mt-1
                                text-[12px]
                                leading-5
                                text-[#B98990]
                            "
                        >
                            {loadError ||
                                'The requested user could not be found.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================
       EDIT VIEW
    ========================================================== */

    if (isEditing) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Edit User"
                    subtitle={`Update account information and access settings for ${user.name}.`}
                    action={
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="
                                inline-flex
                                h-10
                                items-center
                                gap-2
                                border
                                border-[#3B424B]
                                bg-[#22262B]
                                px-4
                                text-[12px]
                                font-medium!
                                text-[#BFC5CB]
                                transition-colors
                                hover:border-[#505963]
                                hover:bg-[#292E34]
                                hover:text-[#F1F2F3]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <X size={14} strokeWidth={1.8} />
                            Cancel editing
                        </button>
                    }
                />

                <EditUserView
                    user={user}
                    saving={saving}
                    saveError={saveError}
                    fieldErrors={fieldErrors}
                    onSubmit={handleUpdateUser}
                    onCancel={handleCancelEdit}
                />
            </div>
        );
    }

    /* =========================================================
       DETAILS VIEW
    ========================================================== */

    return (
        <div className="space-y-6">
            <PageHeader
                title="User Details"
                subtitle="Review identity, profile information and platform access."
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                                inline-flex
                                h-10
                                items-center
                                gap-2
                                border
                                border-[#3A4149]
                                bg-[#22262B]
                                px-3.5
                                text-[12px]
                                font-medium!
                                text-[#BFC5CB]
                                transition-colors
                                hover:border-[#505963]
                                hover:bg-[#292E34]
                                hover:text-[#F1F2F3]
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className="
                                inline-flex
                                h-10
                                items-center
                                gap-2
                                border
                                border-[#168277]
                                bg-[#0F766E]
                                px-4
                                text-[12px]
                                font-semibold!
                                text-white!
                                transition-colors
                                hover:bg-[#128276]
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Edit User
                        </button>
                    </div>
                }
            />

            <UserDetailsView
                user={user}
                successMessage={successMessage}
                onDismissSuccess={() => setSuccessMessage('')}
            />
        </div>
    );
};

export default UserDetails;
