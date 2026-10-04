// src/dashboard/admin/users/UserDetails.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CircleAlert, Pencil, X } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import EditUserView from './components/EditUserView';
import UserDetailsView from './components/UserDetailsView';

import { fetchUser, updateUserAndRefresh } from './api/userApi';

/* ==========================================================================
   USER DETAILS
============================================================================ */

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
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        if (saving) {
            return;
        }

        setIsEditing(false);
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

    /* ======================================================================
       LOADING
    ====================================================================== */

    if (loading) {
        return (
            <div
                className="
                    space-y-8
                    font-sans!
                "
            >
                <PageHeader
                    title="User Details"
                    subtitle="Loading account information..."
                />

                <div
                    className="
                        flex
                        min-h-130
                        items-center
                        justify-center

                        border
                        border-[#252D38]

                        bg-[#0E1219]

                        px-6
                        py-12
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
                                border-[#29323E]
                                border-t-[#8792A1]
                            "
                        />

                        <p
                            className="
                                mt-5

                                font-sans!

                                text-[12px]
                                font-semibold!

                                text-[#EEF1F5]!
                            "
                        >
                            Loading user details
                        </p>

                        <p
                            className="
                                mt-1.5

                                font-sans!

                                text-[11px]
                                font-normal!
                                leading-5

                                text-[#697586]!
                            "
                        >
                            Retrieving account information.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* ======================================================================
       LOAD ERROR
    ====================================================================== */

    if (loadError || !user) {
        return (
            <div
                className="
                    space-y-8
                    font-sans!
                "
            >
                <PageHeader
                    title="User Details"
                    subtitle="The requested account could not be loaded."
                    action={
                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                                group

                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2.5

                                border
                                border-[#29323E]

                                bg-[#0E1219]

                                px-3.5

                                font-sans!
                                text-[11px]
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

                <div
                    className="
                        flex
                        items-start
                        gap-3.5

                        border
                        border-[#493038]

                        bg-[#281A1F]

                        px-5
                        py-4

                        sm:px-6
                        sm:py-5
                    "
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center

                            border
                            border-[#493038]

                            bg-[#301F25]

                            text-[#D99A9F]
                        "
                    >
                        <CircleAlert size={15} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 pt-0.5">
                        <p
                            className="
                                font-sans!

                                text-[11.5px]
                                font-semibold!

                                text-[#E4B0B4]!
                            "
                        >
                            Unable to load user
                        </p>

                        <p
                            className="
                                mt-1

                                font-sans!

                                text-[11px]
                                font-normal!
                                leading-5

                                text-[#B98289]!
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

    /* ======================================================================
       EDIT VIEW
    ====================================================================== */

    if (isEditing) {
        return (
            <div
                className="
                    space-y-8
                    font-sans!
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
                                items-center
                                justify-center
                                gap-2.5

                                border
                                border-[#29323E]

                                bg-[#0E1219]

                                px-3.5

                                font-sans!
                                text-[11px]
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
                space-y-8
                font-sans!
            "
        >
            <PageHeader
                title="User Details"
                subtitle="Review identity, profile information and platform access."
                action={
                    <div
                        className="
                            flex
                            w-full
                            flex-wrap
                            items-center
                            justify-end
                            gap-2.5

                            sm:w-auto
                            sm:gap-3
                        "
                    >
                        {/* BACK */}

                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                                group

                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2.5

                                border
                                border-[#29323E]

                                bg-[#0E1219]

                                px-3.5

                                font-sans!
                                text-[11px]
                                font-medium!
                                whitespace-nowrap

                                text-[#AEB7C3]!

                                transition-[background-color,border-color,color]
                                duration-150
                                ease-out

                                hover:border-[#394555]
                                hover:bg-[#151B24]
                                hover:text-[#EEF1F5]!

                                focus:outline-none
                                focus:ring-0
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

                            <span>Back</span>
                        </button>

                        {/* EDIT */}

                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className="
                                group

                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2.5

                                border
                                border-[#394555]

                                bg-[#1A222D]

                                px-4

                                font-sans!
                                text-[11px]
                                font-semibold!
                                whitespace-nowrap

                                text-[#EEF1F5]!

                                transition-[background-color,border-color,color]
                                duration-150
                                ease-out

                                hover:border-[#4B5869]
                                hover:bg-[#1D2632]

                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <Pencil
                                size={14}
                                strokeWidth={1.8}
                                className="
                                    shrink-0

                                    text-[#AEB7C3]

                                    transition-colors
                                    duration-150

                                    group-hover:text-[#EEF1F5]
                                "
                            />

                            <span>Edit User</span>
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
