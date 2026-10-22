import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import { apiRequest } from '@/api/client';

import OrgProfileView from './components/OrgProfileView';
import OrgProfileEdit from './components/OrgProfileEdit';

import { emptyForm, toArray, getProfilePayload } from './utils/orgProfileUtils';

const SUCCESS_DURATION = 1500;
const PROFILE_PATH = '/organization/dashboard/profile';
const PROFILE_EDIT_PATH = `${PROFILE_PATH}/edit`;

const toForm = (data) => ({
    name: data?.name ?? '',
    email: data?.email ?? data?.user?.email ?? '',
    phone: data?.phone ?? data?.user?.phone ?? '',
    website: data?.website ?? '',
    address: data?.address ?? '',
    mission: data?.mission ?? '',
    focus_areas: toArray(data?.focus_areas),
    communities_served: toArray(data?.communities_served),
    team_size: data?.team_size ?? '',
    primary_activities: toArray(data?.primary_activities),
});

const createEmptyPendingImages = () => ({
    photo: null,
    banner: null,
});

const revokePreview = (pendingImage) => {
    if (pendingImage?.preview) {
        URL.revokeObjectURL(pendingImage.preview);
    }
};

export default function OrgProfile() {
    const navigate = useNavigate();
    const location = useLocation();

    const editing = location.pathname.replace(/\/$/, '') === PROFILE_EDIT_PATH;

    const [form, setForm] = useState(emptyForm);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);

    const [uploadingImage, setUploadingImage] = useState('');
    const [imageUploadError, setImageUploadError] = useState('');
    const [imageUploadSuccess, setImageUploadSuccess] = useState('');

    const [pendingImages, setPendingImages] = useState(
        createEmptyPendingImages,
    );

    // Load organization profile.
    useEffect(() => {
        let cancelled = false;

        const fetchProfile = async () => {
            try {
                const response = await apiRequest('/organization/profile');

                if (cancelled) return;

                const data = getProfilePayload(response);

                if (!data) {
                    throw new Error(
                        'Could not load your organization profile.',
                    );
                }

                setProfile(data);
                setForm(toForm(data));
                setError('');
            } catch (err) {
                if (cancelled) return;

                setError(
                    err?.message || 'Failed to load organization profile.',
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    // Clean up temporary image previews.
    useEffect(() => {
        return () => {
            revokePreview(pendingImages.photo);
            revokePreview(pendingImages.banner);
        };
    }, [pendingImages]);

    // Automatically close success dialog after 1.5 seconds.
    useEffect(() => {
        if (!successOpen) return undefined;

        const timeoutId = window.setTimeout(() => {
            setSuccessOpen(false);
            navigate(PROFILE_PATH, { replace: true });
        }, SUCCESS_DURATION);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [successOpen, navigate]);

    const handleSuccessClose = () => {
        setSuccessOpen(false);
        navigate(PROFILE_PATH, { replace: true });
    };

    const clearPendingImages = () => {
        setPendingImages((current) => {
            revokePreview(current.photo);
            revokePreview(current.banner);

            return createEmptyPendingImages();
        });
    };

    const handleChange = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setError('');
    };

    const handleEdit = () => {
        setForm(toForm(profile));
        clearPendingImages();

        setError('');
        setSuccessOpen(false);
        setImageUploadError('');
        setImageUploadSuccess('');

        navigate(PROFILE_EDIT_PATH);
    };

    const handleCancel = () => {
        if (saving || uploadingImage) return;

        setForm(toForm(profile));
        clearPendingImages();

        setError('');
        setSuccessOpen(false);
        setImageUploadError('');
        setImageUploadSuccess('');

        navigate(PROFILE_PATH, { replace: true });
    };

    // Select image locally. Upload only when saving.
    const handleImageUpload = (field, file) => {
        if (!file || saving || uploadingImage) return;

        if (!['photo', 'banner'].includes(field)) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            setImageUploadError('Please select a JPEG, PNG, or WebP image.');
            setImageUploadSuccess('');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageUploadError('The image must be 5 MB or smaller.');
            setImageUploadSuccess('');
            return;
        }

        const preview = URL.createObjectURL(file);

        setPendingImages((current) => {
            revokePreview(current[field]);

            return {
                ...current,
                [field]: {
                    file,
                    preview,
                },
            };
        });

        setImageUploadError('');
        setImageUploadSuccess('');
        setError('');
    };

    // Upload selected logo or banner.
    const uploadPendingImage = async (field, file) => {
        const body = new FormData();
        body.append(field, file);

        const response = await apiRequest(`/organization/profile/${field}`, {
            method: 'POST',
            body,
        });

        const imageUrl = response?.[field];

        if (!imageUrl) {
            throw new Error(
                `The server did not return the uploaded ${field} URL.`,
            );
        }

        return imageUrl;
    };

    const handleSave = async (event) => {
        event?.preventDefault();

        if (saving || uploadingImage) return;

        setSaving(true);
        setError('');
        setSuccessOpen(false);
        setImageUploadError('');
        setImageUploadSuccess('');

        let uploadedPhoto = null;
        let uploadedBanner = null;

        try {
            // Upload logo only after Save is clicked.
            if (pendingImages.photo?.file) {
                setUploadingImage('photo');

                uploadedPhoto = await uploadPendingImage(
                    'photo',
                    pendingImages.photo.file,
                );
            }

            // Upload banner only after Save is clicked.
            if (pendingImages.banner?.file) {
                setUploadingImage('banner');

                uploadedBanner = await uploadPendingImage(
                    'banner',
                    pendingImages.banner.file,
                );
            }

            const payload = {
                ...form,
                focus_areas: toArray(form.focus_areas),
                communities_served: toArray(form.communities_served),
                primary_activities: toArray(form.primary_activities),
            };

            // Preserve existing organization API endpoint.
            const response = await apiRequest('/organization/profile', {
                method: 'PUT',
                body: JSON.stringify(payload),
            });

            const updatedProfile = getProfilePayload(response);

            const finalProfile = {
                ...(profile || {}),
                ...payload,
                ...(updatedProfile || {}),
                photo:
                    uploadedPhoto ??
                    updatedProfile?.photo ??
                    profile?.photo ??
                    profile?.user?.photo ??
                    null,
                banner:
                    uploadedBanner ??
                    updatedProfile?.banner ??
                    profile?.banner ??
                    null,
            };

            // Synchronize shared account photo.
            if (uploadedPhoto && finalProfile.user) {
                finalProfile.user = {
                    ...finalProfile.user,
                    photo: uploadedPhoto,
                };
            }

            setProfile(finalProfile);
            setForm(toForm(finalProfile));

            clearPendingImages();
            setImageUploadSuccess('');

            // Keep edit page underneath shared success dialog.
            setSuccessOpen(true);
        } catch (err) {
            setError(err?.message || 'Failed to save organization profile.');
        } finally {
            setUploadingImage('');
            setSaving(false);
        }
    };

    return (
        <>
            <div className="min-w-0 space-y-6 font-sans">
                <PageHeader
                    title="Organization Profile"
                    subtitle="Manage your organization's information and public identity."
                />

                {loading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading organization profile"
                        description="Retrieving your organization information."
                    />
                ) : !profile ? (
                    <LoadingError
                        title="Organization profile unavailable"
                        message={
                            error ||
                            "We couldn't retrieve your organization's information. Please reload the page to try again."
                        }
                    />
                ) : (
                    <>
                        {error && (
                            <LoadingError
                                title="Unable to update organization profile"
                                message={error}
                            />
                        )}

                        {editing ? (
                            <OrgProfileEdit
                                form={form}
                                profile={profile}
                                saving={saving}
                                onChange={handleChange}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onUploadImage={handleImageUpload}
                                uploadingImage={uploadingImage}
                                pendingImages={pendingImages}
                                imageUploadError={imageUploadError}
                                imageUploadSuccess={imageUploadSuccess}
                            />
                        ) : (
                            <OrgProfileView
                                profile={profile}
                                onEdit={handleEdit}
                            />
                        )}
                    </>
                )}
            </div>

            <SuccessDialog
                open={successOpen}
                action="updated"
                entity="organization"
                name={form.name?.trim() || ''}
                onClose={handleSuccessClose}
            />
        </>
    );
}
