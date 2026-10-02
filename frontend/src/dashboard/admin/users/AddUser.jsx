import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import UserForm from './components/UserForm';
import { createUser } from './api/userApi';

const AddUser = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    // ============================================================
    // NAVIGATION
    // ============================================================

    const handleBack = () => {
        if (loading) {
            return;
        }

        navigate('/admin/dashboard/users');
    };

    // ============================================================
    // CREATE USER
    // ============================================================

    const handleAddUser = async (formData) => {
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            await createUser(formData);

            navigate('/admin/dashboard/users', {
                state: {
                    successMessage: 'User added successfully.',
                },
            });
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setFieldErrors(err.errors);
            }

            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="space-y-8">
            <PageHeader
                title="Add User"
                subtitle="Create a new account and configure its initial access to the Stand For People platform."
                action={
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            border
                            border-border
                            bg-surface
                            px-4
                            text-sm
                            font-medium
                            text-text-primary
                            transition-colors
                            hover:bg-background-alt
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <ArrowLeft size={16} strokeWidth={1.8} />

                        <span>Back to users</span>
                    </button>
                }
            />

            <div className="mx-auto w-full max-w-[1000px]">
                <UserForm
                    mode="add"
                    loading={loading}
                    error={error}
                    fieldErrors={fieldErrors}
                    onSubmit={handleAddUser}
                    onCancel={handleBack}
                />
            </div>
        </div>
    );
};

export default AddUser;
