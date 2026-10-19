import React, { useEffect, useState } from 'react';

import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import { apiRequest } from '@/api/client';

import OrgProfileView from './components/OrgProfileView';
import OrgProfileEdit from './components/OrgProfileEdit';

import { emptyForm, toArray, getProfilePayload } from './utils/orgProfileUtils';

const SUCCESS_DURATION = 1500;

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
    const [form, setForm] = useState(emptyForm);
    const [profile, setProfile] = useState(null);

    const [editing, setEditing] = useState(false);
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

    // Load the organization profile.
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

    // Clean up locally generated preview URLs.
    useEffect(() => {
        return () => {
            revokePreview(pendingImages.photo);
            revokePreview(pendingImages.banner);
        };
    }, [pendingImages]);

    // Automatically close the success dialog after 1.5 seconds.
    // The edit screen stays underneath the dialog until it closes.
    useEffect(() => {
        if (!successOpen) return undefined;

        const timeoutId = window.setTimeout(() => {
            setSuccessOpen(false);
            setEditing(false);
        }, SUCCESS_DURATION);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [successOpen]);

    const handleSuccessClose = () => {
        setSuccessOpen(false);
        setEditing(false);
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

        setEditing(true);
    };

    const handleCancel = () => {
        if (saving || uploadingImage) return;

        setForm(toForm(profile));
        clearPendingImages();

        setError('');
        setSuccessOpen(false);
        setImageUploadError('');
        setImageUploadSuccess('');

        setEditing(false);
    };

    // Selecting an image creates a local preview only.
    // Uploads happen when Save Changes is clicked.
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

    // Upload a selected logo or banner.
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
            // Upload the selected logo only when saving.
            if (pendingImages.photo?.file) {
                setUploadingImage('photo');

                uploadedPhoto = await uploadPendingImage(
                    'photo',
                    pendingImages.photo.file,
                );
            }

            // Upload the selected banner only when saving.
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

            // Preserve the existing organization profile endpoint.
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

            // Keep the shared account photo synchronized in local UI state.
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

            // Keep the edit screen underneath the shared success dialog.
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
            <div className="space-y-6 font-sans">
                <PageHeader
                    title="Organization Profile"
                    subtitle="Manage your organization's information and public identity."
                />

                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 border-l-2 border-red-500 bg-red-500/[0.06] px-4 py-3.5"
                    >
                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-red-400"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-red-300">
                                Something went wrong
                            </p>
                            <p className="mt-1 text-sm leading-6 text-red-300/75">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <section
                        aria-label="Loading organization profile"
                        className="overflow-hidden border border-[#252D38] bg-[#0E1219]"
                    >
                        <div className="h-1 w-full overflow-hidden bg-[#171E28]">
                            <div className="h-full w-1/3 animate-pulse bg-[#0F6258]" />
                        </div>

                        <div className="space-y-6 p-5 sm:p-7">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 animate-pulse bg-[#202936]" />

                                <div className="min-w-0 flex-1 space-y-2.5">
                                    <div className="h-4 w-44 max-w-full animate-pulse bg-[#202936]" />
                                    <div className="h-3 w-28 max-w-full animate-pulse bg-[#1A222D]" />
                                </div>
                            </div>

                            <div className="h-px bg-[#252D38]" />

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="space-y-3 border border-[#252D38] p-4"
                                    >
                                        <div className="h-2.5 w-20 animate-pulse bg-[#202936]" />
                                        <div className="h-4 w-3/4 animate-pulse bg-[#1A222D]" />
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs tracking-wide text-[#8792A1]">
                                Loading organization information...
                            </p>
                        </div>
                    </section>
                ) : !profile ? (
                    <section className="relative overflow-hidden border border-[#252D38] bg-[#0E1219]">
                        <div className="h-1 bg-[#202936]" />

                        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-12 text-center">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[#394555] bg-[#151C26]">
                                <AlertCircle
                                    size={23}
                                    strokeWidth={1.5}
                                    className="text-[#A8B2C0]"
                                />
                            </div>

                            <h2 className="text-base font-semibold text-[#E4E8ED]">
                                Profile unavailable
                            </h2>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-[#8792A1]">
                                We couldn't retrieve your organization's
                                information. Try reloading the page.
                            </p>

                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="mt-6 inline-flex min-h-10 items-center justify-center border border-[#394555] bg-[#171E28] px-5 text-sm font-medium text-[#E4E8ED] transition-colors hover:border-[#526174] hover:bg-[#202936] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6258] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1219]"
                            >
                                Reload profile
                            </button>
                        </div>
                    </section>
                ) : editing ? (
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
                    <OrgProfileView profile={profile} onEdit={handleEdit} />
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
