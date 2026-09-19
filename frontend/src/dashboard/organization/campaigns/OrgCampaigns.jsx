import React, { useEffect, useMemo, useState } from 'react';

import CampaignPageHeader from './components/CampaignPageHeader';
import CampaignOverview from './components/CampaignOverview';
import CampaignFilters from './components/CampaignFilters';
import CampaignList from './components/CampaignList';
import CampaignPagination from './components/CampaignPagination';
import CampaignCreateModal from './modals/CampaignCreateModal';

const CAMPAIGNS_PER_PAGE = 9;

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const OrgCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchCampaigns = async () => {
        try {
            setIsLoading(true);
            setError('');

            const token =
                localStorage.getItem('auth_token') ||
                sessionStorage.getItem('auth_token');

            const response = await fetch(
                `${API_BASE_URL}/organization/campaigns`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to load campaigns.');
            }

            setCampaigns(Array.isArray(data?.campaigns) ? data.campaigns : []);
        } catch (err) {
            console.error('Failed to fetch organization campaigns:', err);

            setCampaigns([]);
            setError(
                err?.message || 'Something went wrong while loading campaigns.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadCampaigns = async () => {
            try {
                setIsLoading(true);
                setError('');

                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                const response = await fetch(
                    `${API_BASE_URL}/organization/campaigns`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message || 'Failed to load campaigns.',
                    );
                }

                if (!isMounted) return;

                setCampaigns(
                    Array.isArray(data?.campaigns) ? data.campaigns : [],
                );
            } catch (err) {
                if (!isMounted) return;

                console.error('Failed to fetch organization campaigns:', err);

                setCampaigns([]);
                setError(
                    err?.message ||
                        'Something went wrong while loading campaigns.',
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadCampaigns();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredCampaigns = useMemo(() => {
        const query = search.trim().toLowerCase();

        return campaigns.filter((campaign) => {
            const status = String(campaign?.status || '')
                .trim()
                .toLowerCase();

            const searchMatch =
                !query ||
                [
                    campaign?.title,
                    campaign?.description,
                    campaign?.category,
                    campaign?.deadline,
                    campaign?.end_date,
                    campaign?.helpRequestTitle,
                    campaign?.help_request?.title,
                    campaign?.help_request_title,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query);

            const statusMatch =
                statusFilter === 'all' || status === statusFilter;

            return searchMatch && statusMatch;
        });
    }, [campaigns, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCampaigns.length / CAMPAIGNS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedCampaigns = useMemo(() => {
        const start = (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE;

        return filteredCampaigns.slice(start, start + CAMPAIGNS_PER_PAGE);
    }, [filteredCampaigns, safeCurrentPage]);

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleCreateCampaign = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleCampaignCreated = () => {
        setIsCreateModalOpen(false);
        fetchCampaigns();
    };

    const handleOpenCampaign = (campaign) => {
        // Campaign detail logic will be connected later.
        console.log('Open campaign:', campaign);
    };

    return (
        <div className="space-y-6">
            <CampaignPageHeader onCreate={handleCreateCampaign} />

            <CampaignOverview campaigns={campaigns} />

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-text-primary">
                        Campaign register
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                        Monitor the campaigns your organization is managing and
                        the support connected to each case.
                    </p>
                </div>

                <CampaignFilters
                    search={search}
                    setSearch={handleSearchChange}
                    statusFilter={statusFilter}
                    setStatusFilter={handleStatusChange}
                />

                {isLoading ? (
                    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border bg-surface">
                        <p className="text-sm font-medium text-text-secondary">
                            Loading campaigns...
                        </p>
                    </div>
                ) : error ? (
                    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center">
                        <div>
                            <p className="text-sm font-semibold text-red-700">
                                Unable to load campaigns
                            </p>

                            <p className="mt-1 text-xs text-red-600">{error}</p>

                            <button
                                type="button"
                                onClick={fetchCampaigns}
                                className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <CampaignList
                            campaigns={paginatedCampaigns}
                            onOpen={handleOpenCampaign}
                        />

                        {filteredCampaigns.length > 0 && (
                            <CampaignPagination
                                currentPage={safeCurrentPage}
                                totalPages={totalPages}
                                totalItems={filteredCampaigns.length}
                                itemsPerPage={CAMPAIGNS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </section>

            <CampaignCreateModal
                open={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onCreated={handleCampaignCreated}
            />
        </div>
    );
};

export default OrgCampaigns;
