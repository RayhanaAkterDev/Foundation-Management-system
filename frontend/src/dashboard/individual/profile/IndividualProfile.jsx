import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import IndividualProfileView from './components/IndividualProfileView';
import IndividualProfileEdit from './components/IndividualProfileEdit';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    district: '',
    address: '',
    photo: '',
    participation_preferences: [],
    category_preferences: [],
};

/* =========================================================
   AUTH HELPERS
========================================================= */

const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const getAuthStorage = () =>
    localStorage.getItem('auth_token') ? localStorage : sessionStorage;

const safeStoredUser = (storage) => {
    try {
        return JSON.parse(storage.getItem('user') || 'null');
    } catch {
        return null;
    }
};

/* =========================================================
   DATA HELPERS
========================================================= */

const toArray = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) return parsed;
        } catch {
            return value
                .split(/[,;|]/)
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return [];
};

const extractForm = (user) => {
    const individualProfile =
        user?.individual_profile || user?.individualProfile || {};

    return {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',

        date_of_birth: (individualProfile.date_of_birth || '').slice(0, 10),

        district: individualProfile.district || '',
        address: individualProfile.address || '',
        photo: user?.photo || '',

        participation_preferences: toArray(
            individualProfile.participation_preferences,
        ),

        category_preferences: toArray(individualProfile.category_preferences),
    };
};

const parseResponse = async (response) => {
    const responseText = await response.text();

    let data = {};

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = {};
        }
    }

    if (!response.ok) {
        const validationError = data?.errors
            ? Object.values(data.errors).flat().find(Boolean)
            : null;

        throw new Error(
            validationError ||
                data?.message ||
                `The request failed (${response.status}). Please try again.`,
        );
    }

    return data;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function IndividualProfile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [memberSince, setMemberSince] = useState(null);

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // The selected image remains local until Save is clicked.
    const [pendingPhotoFile, setPendingPhotoFile] = useState(null);
    const [pendingPhotoPreview, setPendingPhotoPreview] = useState('');

    const [error, setError] = useState('');

    // Common success modal state.
    const [successOpen, setSuccessOpen] = useState(false);

    /* =====================================================
       SUCCESS MODAL — AUTO CLOSE AND RETURN TO PROFILE
    ===================================================== */

    useEffect(() => {
        if (!successOpen) return undefined;

        const timeoutId = window.setTimeout(() => {
            setSuccessOpen(false);
            setEditing(false);
        }, 1500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [successOpen]);

    const handleSuccessClose = () => {
        setSuccessOpen(false);
        setEditing(false);
    };

    /* =====================================================
       LOAD PROFILE
    ===================================================== */

    useEffect(() => {
        let cancelled = false;

        async function fetchProfile() {
            try {
                const token = getToken();

                if (!token) {
                    throw new Error(
                        'Your session has expired. Please log in again.',
                    );
                }

                const response = await fetch(`${API_URL}/user`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await parseResponse(response);

                if (cancelled) return;

                const user = data.user;

                if (!user) {
                    throw new Error('Unable to load your profile.');
                }

                const values = extractForm(user);

                setProfile(values);
                setForm(values);
                setMemberSince(user.created_at || null);

                const storage = getAuthStorage();
                const existingUser = safeStoredUser(storage) || {};

                storage.setItem(
                    'user',
                    JSON.stringify({
                        ...existingUser,
                        ...user,
                    }),
                );
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Unable to load your profile.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    /* =====================================================
       FORM CHANGES
    ===================================================== */

    const handleChange = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));

        setError('');
    };

    /* =====================================================
       CLEAR TEMPORARY PHOTO
    ===================================================== */

    const clearPendingPhoto = () => {
        setPendingPhotoFile(null);

        setPendingPhotoPreview((previousPreview) => {
            if (previousPreview) {
                URL.revokeObjectURL(previousPreview);
            }

            return '';
        });
    };

    /* =====================================================
       ENTER EDIT MODE
    ===================================================== */

    const handleEdit = () => {
        setForm({ ...profile });

        clearPendingPhoto();

        setError('');
        setEditing(true);
    };

    /* =====================================================
       CANCEL EDITING
    ===================================================== */

    const handleCancel = () => {
        if (saving || uploadingPhoto) return;

        setForm({ ...profile });

        clearPendingPhoto();

        setError('');
        setEditing(false);
    };

    /* =====================================================
       SELECT PHOTO — NO API REQUEST
    ===================================================== */

    const handlePhotoUpload = (file) => {
        if (!file || saving || uploadingPhoto) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            setError('Choose a JPG, PNG, or WebP image.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('The image must be 5 MB or smaller.');
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setPendingPhotoPreview((previousPreview) => {
            if (previousPreview) {
                URL.revokeObjectURL(previousPreview);
            }

            return previewUrl;
        });

        setPendingPhotoFile(file);
        setError('');
    };

    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    const handleSave = async (event) => {
        event?.preventDefault();

        if (saving || uploadingPhoto) return;

        setSaving(true);
        setError('');

        try {
            const token = getToken();

            if (!token) {
                throw new Error(
                    'Your session has expired. Please log in again.',
                );
            }

            const currentStoredUser =
                safeStoredUser(localStorage) || safeStoredUser(sessionStorage);

            const newEmail = form.email.trim();

            const currentEmail =
                profile?.email || currentStoredUser?.email || '';

            const emailChanged =
                currentEmail.toLowerCase() !== newEmail.toLowerCase();

            /*
             * STEP 1:
             * Upload the image only after Save is clicked.
             */

            let savedPhoto = profile?.photo || '';

            if (pendingPhotoFile) {
                setUploadingPhoto(true);

                try {
                    const body = new FormData();

                    body.append('photo', pendingPhotoFile);

                    const uploadResponse = await fetch(
                        `${API_URL}/profile/photo`,
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body,
                        },
                    );

                    const uploadData = await parseResponse(uploadResponse);

                    savedPhoto =
                        uploadData.photo || uploadData.user?.photo || '';

                    if (!savedPhoto) {
                        throw new Error(
                            'The server did not return the uploaded photo URL.',
                        );
                    }
                } finally {
                    setUploadingPhoto(false);
                }
            }

            /*
             * STEP 2:
             * Update profile information.
             */

            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),

                date_of_birth: form.date_of_birth || null,

                district: form.district.trim(),
                address: form.address.trim(),

                photo: savedPhoto || null,

                participation_preferences: form.participation_preferences || [],

                category_preferences: form.category_preferences || [],
            };

            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await parseResponse(response);
            const updatedUser = data.user;

            if (!updatedUser) {
                throw new Error(
                    'The server did not return your updated profile.',
                );
            }

            /*
             * STEP 3:
             * Commit saved data to frontend state.
             */

            const updatedIndividualProfile =
                updatedUser.individual_profile ||
                updatedUser.individualProfile ||
                {};

            const values = extractForm(updatedUser);

            setProfile(values);
            setForm(values);

            setMemberSince(updatedUser.created_at || memberSince);

            const storage = getAuthStorage();
            const existingUser = safeStoredUser(storage) || {};

            storage.setItem(
                'user',
                JSON.stringify({
                    ...existingUser,
                    ...updatedUser,
                    individualProfile: updatedIndividualProfile,
                }),
            );

            // The save succeeded. Discard the temporary preview.
            clearPendingPhoto();

            /*
             * STEP 4:
             * Preserve the existing email verification flow.
             */

            if (emailChanged) {
                const verificationMethod =
                    updatedUser.verification_method ||
                    currentStoredUser?.verification_method ||
                    'email';

                const userId = updatedUser.id || currentStoredUser?.id;

                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');

                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('user');

                if (verificationMethod === 'demo' && userId) {
                    window.location.href = `/email-verification?status=demo&user_id=${encodeURIComponent(userId)}`;
                } else {
                    window.location.href = '/email-verification?status=email';
                }

                return;
            }

            /*
             * STEP 5:
             * Open the common success dialog.
             *
             * IMPORTANT:
             * Do not set editing(false) here.
             * The dialog appears over the edit page.
             * The timeout or Done button returns to profile view.
             */

            setSuccessOpen(true);
        } catch (err) {
            setError(err.message || 'Unable to update your profile.');
        } finally {
            setSaving(false);
            setUploadingPhoto(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-w-0 space-y-6 font-sans">
            <PageHeader
                title="My Profile"
                subtitle="Manage your personal information and account details."
            />

            {error && (
                <div
                    role="alert"
                    className="
                        flex items-start gap-3
                        rounded-xl border border-red-900/50
                        bg-red-950/20 px-4 py-3
                        text-[13px] text-red-300
                    "
                >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />

                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div
                    className="
                        flex min-h-130 flex-col
                        items-center justify-center
                        border border-[#252D38]
                        bg-[#0E1219] px-6 py-14
                        text-center
                    "
                >
                    <div
                        className="
                            mb-4 size-8 animate-spin
                            rounded-full border-2
                            border-[#303A47]
                            border-t-[#AAB8C6]
                        "
                    />

                    <p className="text-[13px] text-[#8792A1]">
                        Loading your profile...
                    </p>
                </div>
            ) : !profile ? (
                <div
                    className="
                        rounded-xl border border-[#252D38]
                        bg-[#0E1219] px-6 py-12
                        text-center text-[13px]
                        text-[#B8C0CA]
                    "
                >
                    Your profile could not be loaded.
                </div>
            ) : editing ? (
                <IndividualProfileEdit
                    form={form}
                    memberSince={memberSince}
                    saving={saving}
                    uploadingPhoto={uploadingPhoto}
                    photoPreview={pendingPhotoPreview}
                    onPhotoUpload={handlePhotoUpload}
                    onChange={handleChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <IndividualProfileView
                    profile={profile}
                    memberSince={memberSince}
                    onEdit={handleEdit}
                />
            )}

            {/* COMMON SUCCESS MODAL */}

            <SuccessDialog
                open={successOpen}
                action="updated"
                entity="user"
                name={form.name?.trim() || ''}
                onClose={handleSuccessClose}
            />
        </div>
    );
}
