import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Mail, X } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import ProfileView from './components/ProfileView';
import ProfileEdit from './components/ProfileEdit';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const SUCCESS_DURATION = 1500;

const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const getAuthStorage = () =>
    localStorage.getItem('auth_token') ? localStorage : sessionStorage;

const parseResponse = async (response) => {
    const text = await response.text();
    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
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
                `Request failed (${response.status}).`,
        );
    }

    return data;
};

const getValues = (user) => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photo: user?.photo || '',
});

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(getValues(null));
    const [originalEmail, setOriginalEmail] = useState('');
    const [memberSince, setMemberSince] = useState(null);
    const [pendingPhoto, setPendingPhoto] = useState(null);

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);
    const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchProfile = async () => {
            try {
                const token = getToken();

                if (!token) {
                    throw new Error(
                        'Your session has expired. Please log in again.',
                    );
                }

                const response = await fetch(`${API_URL}/user`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await parseResponse(response);

                if (cancelled) return;

                if (!data.user) {
                    throw new Error('Unable to load your profile.');
                }

                setProfile(data.user);
                setForm(getValues(data.user));
                setOriginalEmail(data.user.email || '');
                setMemberSince(data.user.created_at || null);
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Unable to load your profile.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        return () => {
            if (pendingPhoto?.preview) {
                URL.revokeObjectURL(pendingPhoto.preview);
            }
        };
    }, [pendingPhoto]);

    // Automatically close the success dialog, then return to profile view.
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

    const handleEdit = () => {
        setForm(getValues(profile));
        setPendingPhoto(null);
        setError('');
        setSuccessOpen(false);
        setEditing(true);
    };

    const handleCancel = () => {
        if (saving) return;

        setForm(getValues(profile));
        setPendingPhoto(null);
        setError('');
        setSuccessOpen(false);
        setEditing(false);
    };

    const handleChange = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));

        setError('');
    };

    const handlePhotoSelect = (file) => {
        if (!file || saving) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Choose a JPG, PNG, or WebP image.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('The image must be 5 MB or smaller.');
            return;
        }

        setPendingPhoto({
            file,
            preview: URL.createObjectURL(file),
        });

        setError('');
    };

    const handleSave = async () => {
        if (saving) return;

        setSaving(true);
        setError('');
        setSuccessOpen(false);

        try {
            const token = getToken();

            if (!token) {
                throw new Error(
                    'Your session has expired. Please log in again.',
                );
            }

            let uploadedPhoto = profile?.photo || '';

            // Upload the selected image only after Save Changes is clicked.
            if (pendingPhoto?.file) {
                const body = new FormData();
                body.append('photo', pendingPhoto.file);

                const photoResponse = await fetch(`${API_URL}/profile/photo`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body,
                });

                const photoData = await parseResponse(photoResponse);

                uploadedPhoto = photoData.photo || photoData.user?.photo || '';

                if (!uploadedPhoto) {
                    throw new Error(
                        'The server did not return the uploaded photo URL.',
                    );
                }
            }

            const email = form.email.trim();
            const emailChanged =
                email.toLowerCase() !== originalEmail.trim().toLowerCase();

            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email,
                    phone: form.phone.trim(),
                    photo: uploadedPhoto || null,
                }),
            });

            const data = await parseResponse(response);

            if (!data.user) {
                throw new Error(
                    'The server did not return your updated profile.',
                );
            }

            const updatedUser = {
                ...data.user,
                photo: data.user.photo || uploadedPhoto || '',
            };

            setProfile(updatedUser);
            setForm(getValues(updatedUser));
            setOriginalEmail(updatedUser.email || email);
            setMemberSince(updatedUser.created_at || memberSince);
            setPendingPhoto(null);

            const storage = getAuthStorage();
            const storedUser = JSON.parse(storage.getItem('user') || 'null');

            storage.setItem(
                'user',
                JSON.stringify({
                    ...(storedUser || {}),
                    ...updatedUser,
                }),
            );

            // Keep the existing email-change flow unchanged.
            if (emailChanged) {
                setEditing(false);
                setShowEmailChangeModal(true);
                return;
            }

            // Keep the edit screen underneath the dialog until it closes.
            setSuccessOpen(true);
        } catch (err) {
            setError(err.message || 'Unable to update your profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleContinueToLogin = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');

        window.location.href = '/admin/login';
    };

    return (
        <>
            <div className="min-w-0 space-y-6 font-sans">
                <PageHeader
                    title="My Profile"
                    subtitle="Manage your administrator account and personal information."
                />

                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 border border-red-900/50 bg-red-950/20 px-4 py-3 text-[13px] text-red-300"
                    >
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-5">
                        <div className="h-36 animate-pulse border border-[#252D38] bg-[#0E1219]" />
                        <div className="h-72 animate-pulse border border-[#252D38] bg-[#0E1219]" />
                    </div>
                ) : !profile ? (
                    <div className="border border-[#252D38] bg-[#0E1219] px-5 py-12 text-center text-[13px] text-[#B8C0CA]">
                        Your profile could not be loaded.
                    </div>
                ) : editing ? (
                    <ProfileEdit
                        form={form}
                        profile={profile}
                        memberSince={memberSince}
                        pendingPhoto={pendingPhoto}
                        saving={saving}
                        onChange={handleChange}
                        onPhotoSelect={handlePhotoSelect}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ) : (
                    <ProfileView
                        profile={profile}
                        memberSince={memberSince}
                        onEdit={handleEdit}
                    />
                )}
            </div>

            <SuccessDialog
                open={successOpen}
                action="updated"
                entity="user"
                name={form.name?.trim() || ''}
                onClose={handleSuccessClose}
            />

            {showEmailChangeModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="email-change-title"
                >
                    <div className="relative w-full max-w-lg border border-[#303A47] bg-[#0E1219] shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setShowEmailChangeModal(false)}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-[#8792A1] transition hover:bg-[#1A222D] hover:text-[#EEF1F5]"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>

                        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8">
                            <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[#303A47] bg-[#1A222D] text-[#B8C0CA]">
                                <CheckCircle2 size={22} />
                            </div>

                            <h2
                                id="email-change-title"
                                className="text-xl font-semibold text-[#EEF1F5]"
                            >
                                Email address updated
                            </h2>

                            <p className="mt-2 text-[13px] leading-6 text-[#8792A1]">
                                Your administrator email has been changed
                                successfully.
                            </p>

                            <div className="mt-5 border border-[#303A47] bg-[#151B24] px-4 py-4">
                                <div className="flex items-start gap-3">
                                    <Mail
                                        size={18}
                                        className="mt-0.5 shrink-0 text-[#B8C0CA]"
                                    />
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8792A1]">
                                            Verification required
                                        </p>
                                        <p className="mt-1 text-[13px] leading-5 text-[#D6DBE1]">
                                            Follow the email verification
                                            instructions sent to your new
                                            address.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 text-[12px] leading-5 text-[#8792A1]">
                                For security, you have been signed out. Verify
                                your new email address, then log in again.
                            </p>

                            <div className="mt-7 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleContinueToLogin}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#465261] px-5 text-[13px] font-semibold text-white transition hover:bg-[#586678]"
                                >
                                    Continue to Login
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
