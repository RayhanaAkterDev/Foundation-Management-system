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
        setError('');
        setSuccess('');
        setImageUploadError('');
        setImageUploadSuccess('');
        setEditing(true);
    };

    const handleCancel = () => {
        setForm(toForm(profile));
        setError('');
        setSuccess('');
        setImageUploadError('');
        setImageUploadSuccess('');
        setEditing(false);
    };

    const handleSave = async (event) => {
        event?.preventDefault();

        if (saving) return;

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                ...form,
                focus_areas: toArray(form.focus_areas),
                communities_served: toArray(form.communities_served),
                primary_activities: toArray(form.primary_activities),
            };

            const response = await apiRequest('/organization/profile', {
                method: 'PUT',
                body: JSON.stringify(payload),
            });

            const updatedProfile = getProfilePayload(response);

            setProfile((current) => ({
                ...(current || {}),
                ...payload,
                ...(updatedProfile || {}),
                photo:
                    updatedProfile?.photo ??
                    current?.photo ??
                    current?.user?.photo ??
                    null,
                banner: updatedProfile?.banner ?? current?.banner ?? null,
            }));

            setForm(
                toForm({
                    ...payload,
                    ...(updatedProfile || {}),
                }),
            );

            setEditing(false);
            setSuccess('Organization information updated successfully.');
        } catch (err) {
            setError(
                err?.message || 'Failed to update organization information.',
            );
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (field, file) => {
        if (!file || uploadingImage) return;

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

        setUploadingImage(field);
        setImageUploadError('');
        setImageUploadSuccess('');

        const body = new FormData();
        body.append(field, file);

        try {
            const response = await apiRequest(
                `/organization/profile/${field}`,
                {
                    method: 'POST',
                    body,
                },
            );

            const imageUrl = response?.[field];

            if (!imageUrl) {
                throw new Error(
                    'The upload response did not include an image URL.',
                );
            }

            setProfile((current) => ({
                ...(current || {}),
                [field]: imageUrl,
                ...(field === 'photo' && current?.user
                    ? {
                          user: {
                              ...current.user,
                              photo: imageUrl,
                          },
                      }
                    : {}),
            }));

            setImageUploadSuccess(
                field === 'photo'
                    ? 'Organization logo updated successfully.'
                    : 'Organization banner updated successfully.',
            );
        } catch (err) {
            setImageUploadError(
                err?.message || 'Image upload failed. Please try again.',
            );
        } finally {
            setUploadingImage('');
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Organization Profile"
                description="Manage your organization's information and public identity."
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
                    className="flex items-start gap-3 border border-[#315b4e] bg-[#19312c] px-4 py-3 text-sm text-[#b9e5d7]"
                >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {loading ? (
                <div className="border border-[#2b3836] bg-[#15201e] px-5 py-12 text-center text-sm text-[#91a09b]">
                    Loading organization profile...
                </div>
            ) : !profile ? (
                <div className="border border-[#2b3836] bg-[#15201e] px-5 py-10 text-center">
                    <p className="text-sm text-[#cbd5d1]">
                        Your organization profile could not be loaded.
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 border border-[#426b60] px-4 py-2 text-sm font-medium text-[#c9e9df] transition hover:bg-[#19312c]"
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
                    imageUploadError={imageUploadError}
                    imageUploadSuccess={imageUploadSuccess}
                />
            ) : (
                <OrgProfileView profile={profile} onEdit={handleEdit} />
            )}
        </div>
    );
}
