// src/dashboard/admin/users/UserDetails.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CircleAlert, Pencil, X } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import EditUserView from './components/EditUserView';
import UserDetailsView from './components/UserDetailsView';

import { fetchUser, updateUserAndRefresh } from './api/userApi';

/* ==========================================================================
   USER DETAILS
============================================================================ */

const UserDetails = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { pathname } = useLocation();
    const isEditing = pathname.endsWith('/edit');

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    /* ======================================================================
       LOAD USER
    ====================================================================== */

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

    /* ======================================================================
       NAVIGATION
    ====================================================================== */

    const handleBack = () => {
        if (saving) {
            return;
        }

        navigate('/admin/dashboard/users');
    };

    /* ======================================================================
       EDIT MODE
    ====================================================================== */

    const handleStartEdit = () => {
        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');
        navigate(`/admin/dashboard/users/${userId}/edit`);
    };

    const handleCancelEdit = () => {
        if (saving) {
            return;
        }

        navigate(`/admin/dashboard/users/${userId}`);
        setSaveError('');
        setFieldErrors({});
    };

    /* ======================================================================
       UPDATE USER
    ====================================================================== */

    const handleUpdateUser = async (formData) => {
        if (!user) {
            return;
        }

        setSaving(true);
        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');

        try {
            const refreshed = await updateUserAndRefresh(user.id, formData);

            setUser(refreshed.user);
            navigate(`/admin/dashboard/users/${userId}`, { replace: true });

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

    /* ==========================================================================
   LOADING
============================================================================ */

    if (loading) {
        return (
            <div className="space-y-6 font-sans! sm:space-y-8">
                <PageHeader
                    title={isEditing ? 'Edit User' : 'User Details'}
                    subtitle="Loading account information..."
                />

                <LoadingUI
                    variant="page"
                    title={
                        isEditing
                            ? 'Loading user for editing'
                            : 'Loading user details'
                    }
                    description="Retrieving account information."
                    className="min-h-72 sm:min-h-100 lg:min-h-130"
                />
            </div>
        );
    }

    /* ==========================================================================
   LOAD ERROR
============================================================================ */

    if (loadError || !user) {
        return (
            <div className="space-y-6 font-sans! sm:space-y-8">
                <PageHeader
                    title={isEditing ? 'Edit User' : 'User Details'}
                    subtitle="The requested account could not be loaded."
                    action={
                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                            group
                            inline-flex
                            h-10
                            w-full
                            items-center
                            justify-center
                            gap-2.5
                            border
                            border-[#29323E]
                            bg-[#0E1219]
                            px-3.5
                            font-sans!
                            text-[12px]
                            font-medium!
                            whitespace-nowrap
                            text-[#AEB7C3]!
                            transition-[background-color,border-color,color]
                            duration-150
                            ease-out
                            hover:border-[#394555]
                            hover:bg-[#1A222D]
                            hover:text-[#EEF1F5]!
                            focus:outline-none
                            focus:ring-0
                            sm:w-auto
                        "
                        >
                            <ArrowLeft
                                size={14}
                                strokeWidth={1.8}
                                className="
                                shrink-0
                                text-[#697586]
                                transition-[transform,color]
                                duration-150
                                group-hover:-translate-x-0.5
                                group-hover:text-[#AEB7C3]
                            "
                            />

                            <span>Back to users</span>
                        </button>
                    }
                />

                <LoadingError
                    title="Unable to load user"
                    message={
                        loadError || 'The requested user could not be found.'
                    }
                />
            </div>
        );
    }

    /* ======================================================================
       EDIT VIEW
    ====================================================================== */

    if (isEditing) {
        return (
            <div
                className="
                    space-y-6
                    font-sans!
                    sm:space-y-8
                "
            >
                <PageHeader
                    title="Edit User"
                    subtitle={`Update account information and access settings for ${user.name}.`}
                    action={
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="
                                group

                                inline-flex
                                h-10
                                w-full
                                sm:w-auto
                                items-center
                                justify-center
                                gap-2.5

                                border
                                border-[#29323E]

                                bg-[#0E1219]

                                px-3.5

                                font-sans!
                                text-[12px]
                                font-medium!
                                whitespace-nowrap

                                text-[#AEB7C3]!

                                transition-[background-color,border-color,color]
                                duration-150
                                ease-out

                                hover:border-[#394555]
                                hover:bg-[#1A222D]
                                hover:text-[#EEF1F5]!

                                disabled:cursor-not-allowed
                                disabled:opacity-40

                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <X
                                size={14}
                                strokeWidth={1.8}
                                className="
                                    shrink-0

                                    text-[#697586]

                                    transition-colors
                                    duration-150

                                    group-hover:text-[#AEB7C3]
                                "
                            />

                            <span>Cancel editing</span>
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

    /* ======================================================================
       DETAILS VIEW
    ====================================================================== */

    return (
        <div
            className="
                space-y-6
                font-sans!
                sm:space-y-8
            "
        >
            <PageHeader
                title="User Details"
                subtitle="Review account identity, verification, and role-specific profile details."
                action={
                    <div
                        className="
            grid w-full grid-cols-2 items-center gap-2.5
            sm:flex sm:w-auto sm:flex-wrap sm:justify-end
        "
                    >
                        {/* BACK — SECONDARY ACTION */}

                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                group inline-flex h-10 min-w-0
                items-center justify-center gap-2
                border border-[#343e4b]
                bg-transparent px-3.5

                font-sans text-[12px] font-medium
                whitespace-nowrap text-[#b8c2cf]

                transition-colors duration-150

                hover:border-[#4b596a]
                hover:bg-[#1c232d]
                hover:text-[#f1f5f9]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#8492A3]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#171c24]
            "
                        >
                            <ArrowLeft
                                size={15}
                                strokeWidth={1.8}
                                className="
                    shrink-0 text-[#8492a3]
                    transition-colors
                    group-hover:text-[#d5dde6]
                "
                            />

                            <span>Back</span>
                        </button>

                        {/* EDIT USER — PRIMARY ACTION */}

                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className="
                group inline-flex h-10 min-w-0
                items-center justify-center gap-2.5
                border border-[#465363]
                bg-[#354253] px-4

                font-sans text-[12px] font-semibold
                whitespace-nowrap text-white

                transition-colors duration-150

                hover:border-[#627286]
                hover:bg-[#455468]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#9DAABD]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#171c24]

                active:bg-[#2B3645]
            "
                        >
                            <Pencil
                                size={16}
                                strokeWidth={2}
                                className="shrink-0"
                            />

                            <span>Edit User</span>
                        </button>
                    </div>
                }
            />

            <UserDetailsView user={user} />

            <SuccessDialog
                open={Boolean(successMessage)}
                action="updated"
                entity="user"
                name={user?.name || ''}
                onClose={() => setSuccessMessage('')}
            />
        </div>
    );
};

export default UserDetails;
