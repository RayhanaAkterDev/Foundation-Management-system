import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import IndividualProfileView from './IndividualProfileView';
import IndividualProfileEdit from './IndividualProfileEdit';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    district: '',
    address: '',
};
const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
const extractForm = (user) => {
    const p = user?.individual_profile || user?.individualProfile || {};
    return {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        date_of_birth: (p.date_of_birth || '').slice(0, 10),
        district: p.district || '',
        address: p.address || '',
        photo: user?.photo || null,
    };
};
const parseResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        const detail = data?.errors
            ? Object.values(data.errors).flat().find(Boolean)
            : null;
        throw new Error(
            detail || data?.message || 'Unable to complete this request.',
        );
    }
    return data;
};
const safeStoredUser = (storage) => {
    try {
        return JSON.parse(storage.getItem('user') || 'null');
    } catch {
        return null;
    }
};

export default function IndividualProfile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [memberSince, setMemberSince] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function fetchProfile() {
            try {
                const token = getToken();
                if (!token)
                    throw new Error(
                        'Your session has expired. Please log in again.',
                    );
                const data = await parseResponse(
                    await fetch(`${API_URL}/user`, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                );
                if (cancelled) return;
                const user = data.user;
                if (!user) throw new Error('Unable to load your profile.');
                const values = extractForm(user);
                setProfile(values);
                setForm(values);
                setMemberSince(user.created_at || null);
            } catch (err) {
                if (!cancelled)
                    setError(err.message || 'Unable to load your profile.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchProfile();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
        setError('');
        setSuccess('');
    };
    const handleEdit = () => {
        setForm({ ...profile });
        setError('');
        setSuccess('');
        setEditing(true);
    };
    const handleCancel = () => {
        setForm({ ...profile });
        setError('');
        setSuccess('');
        setEditing(false);
    };

    const handleSave = async (event) => {
        event?.preventDefault();
        if (saving) return;
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const token = getToken();
            if (!token)
                throw new Error(
                    'Your session has expired. Please log in again.',
                );
            const currentStoredUser =
                safeStoredUser(localStorage) || safeStoredUser(sessionStorage);
            const newEmail = form.email.trim();
            const currentEmail =
                profile?.email || currentStoredUser?.email || '';
            const emailChanged =
                currentEmail.toLowerCase() !== newEmail.toLowerCase();
            const payload = {
                name: form.name.trim(),
                email: newEmail,
                phone: form.phone.trim(),
                date_of_birth: form.date_of_birth,
                district: form.district.trim(),
                address: form.address.trim(),
            };
            const data = await parseResponse(
                await fetch(`${API_URL}/profile`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }),
            );
            const updatedUser = data.user;
            if (!updatedUser)
                throw new Error(
                    'The server did not return your updated profile.',
                );
            const updatedProfile =
                updatedUser.individual_profile ||
                updatedUser.individualProfile ||
                {};
            const values = extractForm(updatedUser);
            setProfile(values);
            setForm(values);
            setMemberSince(updatedUser.created_at || memberSince);
            const storage = localStorage.getItem('auth_token')
                ? localStorage
                : sessionStorage;
            const existingUser = safeStoredUser(storage);
            storage.setItem(
                'user',
                JSON.stringify({
                    ...existingUser,
                    ...updatedUser,
                    individualProfile: updatedProfile,
                }),
            );
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
            setEditing(false);
            setSuccess('Your profile has been updated successfully.');
        } catch (err) {
            setError(err.message || 'Unable to update your profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <PageHeader
                title="My Profile"
                subtitle="Manage your personal information and account details."
            />
            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-3 border border-red-900/50 bg-red-950/20 px-4 py-3 text-[14px] text-red-300"
                >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}
            {success && !editing && (
                <div
                    role="status"
                    className="flex items-start gap-3 border border-[#303A47] bg-[#1A222D] px-4 py-3 text-[14px] text-[#B8C0CA]"
                >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    {success}
                </div>
            )}
            {loading ? (
                <div className="border border-[#252D38] bg-[#0E1219] px-6 py-14 text-center text-[14px] text-[#8792A1]">
                    Loading your profile...
                </div>
            ) : !profile ? (
                <div className="border border-[#252D38] bg-[#0E1219] px-6 py-12 text-center text-[14px] text-[#B8C0CA]">
                    Your profile could not be loaded.
                </div>
            ) : editing ? (
                <IndividualProfileEdit
                    form={form}
                    memberSince={memberSince}
                    saving={saving}
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
        </div>
    );
}
