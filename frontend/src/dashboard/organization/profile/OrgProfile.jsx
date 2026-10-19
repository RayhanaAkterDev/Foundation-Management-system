import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import { apiRequest } from '@/api/client';
import OrgProfileView from './components/OrgProfileView';
import OrgProfileEdit from './components/OrgProfileEdit';
import { emptyForm, toArray, getProfilePayload } from './utils/orgProfileUtils';

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
    const [success, setSuccess] = useState('');

    const [uploadingImage, setUploadingImage] = useState('');
    const [imageUploadError, setImageUploadError] = useState('');
    const [imageUploadSuccess, setImageUploadSuccess] = useState('');

    const [pendingImages, setPendingImages] = useState(
        createEmptyPendingImages,
    );

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

    // Clean up locally generated preview URLs on unmount.
    useEffect(() => {
        return () => {
            revokePreview(pendingImages.photo);
            revokePreview(pendingImages.banner);
        };
    }, [pendingImages]);

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
        setSuccess('');
    };

    const handleEdit = () => {
        setForm(toForm(profile));
        clearPendingImages();
        setError('');
        setSuccess('');
        setImageUploadError('');
        setImageUploadSuccess('');
        setEditing(true);
    };

    const handleCancel = () => {
        if (saving || uploadingImage) return;

        setForm(toForm(profile));
        clearPendingImages();
        setError('');
        setSuccess('');
        setImageUploadError('');
        setImageUploadSuccess('');
        setEditing(false);
    };

    // Selecting an image only creates a local preview.
    // No request is sent and nothing is uploaded at this stage.
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
        setSuccess('');
    };

    // This function is called only from Save changes.
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
        setSuccess('');
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

            setEditing(false);
            setImageUploadSuccess('');
            setSuccess('Organization profile updated successfully.');
        } catch (err) {
            setError(err?.message || 'Failed to save organization profile.');
        } finally {
            setUploadingImage('');
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 font-sans!">
            <PageHeader
                title="Organization Profile"
                subtitle="Manage your organization's information and public identity."
            />

            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-3 border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300"
                >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && !editing && (
                <div
                    role="status"
                    className="flex items-start gap-3 border border-[#303A47] bg-[#1A222D] px-4 py-3 text-sm text-[#B8C0CA]"
                >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {loading ? (
                <div className="border border-[#252D38] bg-[#0E1219] px-5 py-12 h-130 text-center text-sm text-[#8792A1]">
                    Loading organization profile...
                </div>
            ) : !profile ? (
                <div className="border border-[#252D38] bg-[#0E1219] px-5 py-10 text-center">
                    <p className="text-sm text-[#B8C0CA]">
                        Your organization profile could not be loaded.
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 border border-[#394555] px-4 py-2 text-sm font-medium text-[#D6DBE1] transition hover:bg-[#1A222D]"
                    >
                        Try again
                    </button>
                </div>
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
    );
}
