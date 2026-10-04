import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Plus,
    Download,
    Search,
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    SlidersHorizontal,
    X,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import UserDeleteModal from './modals/DeleteModal';

import UserStats from './components/Stats';
import UserFilters from './components/Filters';
import UserTable from './components/Table';
import UserPagination from './components/Pagination';
import UserSuccessToast from './components/SuccessToast';

import { fetchUsers, deleteUser } from './api/userApi';

const USERS_PER_PAGE = 25;

const Users = () => {
    const navigate = useNavigate();

    // ============================================================
    // STATE
    // ============================================================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [verificationFilter, setVerificationFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const [toast, setToast] = useState({
        show: false,
        message: '',
    });

    // ============================================================
    // SUCCESS TOAST
    // ============================================================

    const showSuccessToast = (message) => {
        setToast({
            show: true,
            message,
        });

        setTimeout(() => {
            setToast({
                show: false,
                message: '',
            });
        }, 3000);
    };

    // ============================================================
    // LOAD USERS
    // ============================================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await fetchUsers();

            setUsers(data.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadInitialUsers = async () => {
            try {
                const data = await fetchUsers();

                if (!cancelled) {
                    setUsers(data.users);
                    setError('');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialUsers();

        return () => {
            cancelled = true;
        };
    }, []);

    // ============================================================
    // DELETE USER
    // ============================================================

    const openDeleteModal = (user) => {
        setDeleteError('');
        setSelectedDeleteUser(user);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setSelectedDeleteUser(null);
        setDeleteError('');
    };

    const handleDeleteUser = async () => {
        if (!selectedDeleteUser) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError('');

        try {
            await deleteUser(selectedDeleteUser.id);

            setSelectedDeleteUser(null);

            await loadUsers();

            showSuccessToast('User deleted successfully.');
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    // ============================================================
    // STATISTICS
    // ============================================================

    const statistics = useMemo(() => {
        return {
            total: users.length,

            individuals: users.filter((user) => user.role === 'individual')
                .length,

            organizations: users.filter((user) => user.role === 'organization')
                .length,

            administrators: users.filter((user) => user.role === 'admin')
                .length,
        };
    }, [users]);

    // ============================================================
    // CATEGORY TABS
    // ============================================================

    const categoryTabs = useMemo(
        () => [
            {
                key: 'all',
                label: 'All Users',
                count: statistics.total,
            },
            {
                key: 'individual',
                label: 'Individuals',
                count: statistics.individuals,
            },
            {
                key: 'organization',
                label: 'Organizations',
                count: statistics.organizations,
            },
            {
                key: 'admin',
                label: 'Administrators',
                count: statistics.administrators,
            },
        ],
        [statistics],
    );

    // ============================================================
    // ACTIVE FILTER COUNT
    // ============================================================

    const activeFilterCount = useMemo(() => {
        let count = 0;

        if (activeCategory !== 'all') {
            count += 1;
        }

        if (statusFilter !== 'all') {
            count += 1;
        }

        if (verificationFilter !== 'all') {
            count += 1;
        }

        return count;
    }, [activeCategory, statusFilter, verificationFilter]);

    // ============================================================
    // FILTERING + SORTING
    // ============================================================

    const filteredUsers = useMemo(() => {
        let result = [...users];

        if (activeCategory !== 'all') {
            result = result.filter((user) => user.role === activeCategory);
        }

        if (statusFilter !== 'all') {
            result = result.filter((user) => user.status === statusFilter);
        }

        if (verificationFilter !== 'all') {
            result = result.filter((user) => {
                const isVerified = Boolean(user.email_verified_at);

                return verificationFilter === 'verified'
                    ? isVerified
                    : !isVerified;
            });
        }

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter(
                (user) =>
                    user.name?.toLowerCase().includes(search) ||
                    user.email?.toLowerCase().includes(search),
            );
        }

        if (!sortConfig.key || !sortConfig.direction) {
            return result;
        }

        result.sort((a, b) => {
            let first = a[sortConfig.key];
            let second = b[sortConfig.key];

            if (sortConfig.key === 'created_at') {
                first = new Date(first).getTime();
                second = new Date(second).getTime();
            }

            first = first ?? '';
            second = second ?? '';

            if (typeof first === 'string') {
                first = first.toLowerCase();
                second = second.toLowerCase();
            }

            if (first < second) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }

            if (first > second) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }

            return 0;
        });

        return result;
    }, [
        users,
        activeCategory,
        statusFilter,
        verificationFilter,
        searchTerm,
        sortConfig,
    ]);

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / USERS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedUsers = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE;

        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, safeCurrentPage]);

    // ============================================================
    // CONTROLS
    // ============================================================

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleVerificationChange = (event) => {
        setVerificationFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setActiveCategory('all');
        setStatusFilter('all');
        setVerificationFilter('all');
        setCurrentPage(1);
    };

    // ============================================================
    // SORT
    // ============================================================

    const handleSort = (key) => {
        setSortConfig((current) => {
            if (current.key !== key) {
                return {
                    key,
                    direction: 'asc',
                };
            }

            if (current.direction === 'asc') {
                return {
                    key,
                    direction: 'desc',
                };
            }

            return {
                key: null,
                direction: null,
            };
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown size={14} strokeWidth={1.8} />;
        }

        if (sortConfig.direction === 'asc') {
            return <ArrowUp size={14} strokeWidth={2} />;
        }

        if (sortConfig.direction === 'desc') {
            return <ArrowDown size={14} strokeWidth={2} />;
        }

        return <ChevronsUpDown size={14} strokeWidth={1.8} />;
    };

    // ============================================================
    // CSV EXPORT
    // ============================================================

    const handleExportCSV = () => {
        if (filteredUsers.length === 0) {
            return;
        }

        const headers = ['Name', 'Email', 'Role', 'Status', 'Joined'];

        const csvRows = filteredUsers.map((user) => [
            user.name,
            user.email,
            user.role,
            user.status,
            new Date(user.created_at).toLocaleDateString(),
        ]);

        const csvContent = [headers, ...csvRows]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value ?? '').replace(/"/g, '""')}"`,
                    )
                    .join(','),
            )
            .join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'stand-for-people-users.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSuccessToast('Users exported successfully.');
    };

    // ============================================================
    // TABLE
    // ============================================================

    const rows = paginatedUsers.map((user, index) => ({
        ...user,

        serialNumber: (safeCurrentPage - 1) * USERS_PER_PAGE + index + 1,

        joinedDate: new Date(user.created_at).toLocaleDateString(),
    }));

    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '56px',
        },
        {
            key: 'name',
            header: 'User',
            sortable: true,
            sortKey: 'name',
            width: 'minmax(220px, 1.5fr)',
        },
        {
            key: 'role',
            header: 'Role',
            sortable: true,
            sortKey: 'role',
            width: 'minmax(130px, 0.8fr)',
        },
        {
            key: 'emailVerification',
            header: 'Email Verification',
            sortable: true,
            sortKey: 'emailVerification',
            width: 'minmax(155px, 0.9fr)',
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: 'minmax(110px, 0.65fr)',
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '90px',
        },
    ];

    // ============================================================
    // FILTER COMPONENT
    // ============================================================

    const filters = (
        <UserFilters
            categoryTabs={categoryTabs}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            verificationFilter={verificationFilter}
            onVerificationChange={handleVerificationChange}
            activeFilterCount={activeFilterCount}
            onClearFilters={handleClearFilters}
        />
    );

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
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
                    "
                >
                    <div className="text-center">
                        <div
                            className="
                                mx-auto
                                mb-4
                                h-8
                                w-8

                                animate-spin
                                rounded-full

                                border-2
                                border-[#252D38]
                                border-t-[#84909F]
                            "
                        />

                        <p
                            className="
                                font-sans!
                                text-[13px]
                                font-semibold!
                                text-[#EEF1F5]
                            "
                        >
                            Loading users...
                        </p>

                        <p
                            className="
                                mt-1.5
                                font-sans!
                                text-[11px]
                                text-[#7F8A99]
                            "
                        >
                            Please wait while we retrieve the user list.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
                />

                <div
                    className="
                        border
                        border-[#5A343B]

                        bg-[#28181D]

                        px-5
                        py-4

                        font-sans!
                        text-[12px]
                        text-[#E9A1A8]
                    "
                >
                    {error}
                </div>
            </div>
        );
    }

    // ============================================================
    // MAIN
    // ============================================================

    return (
        <>
            <div className="space-y-12 lg:space-y-14">
                {/* ====================================================
                    PAGE HEADER
                ==================================================== */}

                <PageHeader
                    title="Users"
                    subtitle="Review and manage everyone connected to Stand For People, including their roles, account status, and platform access."
                    action={
                        <div
                            className="
                flex
                w-full
                flex-wrap
                items-center
                justify-end
                gap-2

                sm:w-auto
            "
                        >
                            {/* =========================================================
                EXPORT CSV
            ========================================================= */}

                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredUsers.length === 0}
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

                    disabled:cursor-not-allowed
                    disabled:border-[#202832]
                    disabled:bg-[#0E1219]
                    disabled:text-[#566171]!
                    disabled:opacity-60
                "
                            >
                                <Download
                                    size={14}
                                    strokeWidth={1.8}
                                    className="
                        shrink-0

                        text-[#697586]

                        transition-colors
                        duration-150

                        group-hover:text-[#AEB7C3]

                        group-disabled:text-[#4E5967]
                    "
                                />

                                <span>Export CSV</span>
                            </button>

                            {/* =========================================================
                ADD USER
            ========================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/admin/dashboard/users/add')
                                }
                                className="
                    group

                    inline-flex
                    h-10
                    items-center
                    justify-center
                    gap-2.5

                    border
                    border-[#29323E]
                    bg-[#1A222D]

                    px-4

                    font-sans!
                    text-[11px]
                    font-semibold!
                    whitespace-nowrap

                    text-[#EEF1F5]!

                    transition-[background-color,border-color]
                    duration-150
                    ease-out

                    hover:border-[#394555]
                    hover:bg-[#1D2632]

                    focus:outline-none
                    focus:ring-0
                "
                            >
                                <span
                                    className="
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center

                        bg-[#252F3B]

                        text-[#C8D0D9]

                        transition-colors
                        duration-150

                        group-hover:bg-[#303A47]
                        group-hover:text-[#EEF1F5]
                    "
                                >
                                    <Plus size={13} strokeWidth={2} />
                                </span>

                                <span>Add User</span>
                            </button>
                        </div>
                    }
                />

                {/* ====================================================
                    STATS
                ==================================================== */}

                <UserStats
                    total={statistics.total}
                    individuals={statistics.individuals}
                    organizations={statistics.organizations}
                    administrators={statistics.administrators}
                />

                {/* ====================================================
                    USER MANAGEMENT
                ==================================================== */}

                <section className="pt-2 lg:pt-3">
                    {/* ===============================================
                        SECTION HEADING
                    =============================================== */}

                    <div
                        className="
                            mb-7

                            flex
                            flex-col
                            gap-5

                            border-b
                            border-[#252D38]

                            pb-6

                            sm:flex-row
                            sm:items-end
                            sm:justify-between

                            lg:mb-8
                            lg:pb-7
                        "
                    >
                        <div className="min-w-0">
                            <div
                                className="
                                    mb-2.5

                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <span
                                    className="
                                        h-1.5
                                        w-1.5

                                        bg-[#697586]
                                    "
                                />

                                <span
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.15em]

                                        text-[#697586]
                                    "
                                >
                                    Administration
                                </span>
                            </div>

                            <h2
                                className="
                                    font-sans!

                                    text-[20px]
                                    font-semibold!
                                    leading-[1.25]
                                    tracking-[-0.02em]

                                    text-[#EEF1F5]!

                                    sm:text-[21px]
                                "
                            >
                                User management
                            </h2>

                            <p
                                className="
                                    mt-2
                                    max-w-xl

                                    font-sans!
                                    text-[12px]
                                    leading-[1.65]

                                    text-[#8792A1]
                                "
                            >
                                Review accounts, roles, and access across the
                                platform.
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-4
                            "
                        >
                            <span
                                className="
                                    hidden
                                    h-9
                                    w-px

                                    bg-[#252D38]

                                    sm:block
                                "
                            />

                            <div>
                                <p
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]

                                        text-[#667282]
                                    "
                                >
                                    Showing
                                </p>

                                <p
                                    className="
                                        mt-1

                                        font-sans!
                                        text-[12px]
                                        font-semibold!

                                        text-[#B8C0CA]
                                    "
                                >
                                    {filteredUsers.length}{' '}
                                    <span
                                        className="
                                            font-normal
                                            text-[#788493]
                                        "
                                    >
                                        {filteredUsers.length === 1
                                            ? 'user'
                                            : 'users'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===============================================
                        MOBILE / TABLET FILTER TRIGGER
                    =============================================== */}

                    <div className="mb-5 xl:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="
                                flex
                                h-10
                                w-full
                                items-center
                                justify-between

                                border
                                border-[#252D38]

                                bg-[#0E1219]

                                px-3.5

                                font-sans!
                                text-[11px]
                                font-medium!

                                text-[#AEB7C3]

                                transition-colors
                                duration-150

                                hover:border-[#35404E]
                                hover:bg-[#151B24]
                                hover:text-[#EEF1F5]
                            "
                        >
                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <SlidersHorizontal
                                    size={14}
                                    strokeWidth={1.8}
                                />
                                Filters
                            </span>

                            {activeFilterCount > 0 && (
                                <span
                                    className="
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center

                                        bg-[#1D2632]

                                        px-1.5

                                        text-[9px]
                                        font-semibold!
                                        tabular-nums

                                        text-[#EEF1F5]
                                    "
                                >
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* ===============================================
                        WORKSPACE
                    =============================================== */}

                    <div
                        className="
                            grid
                            min-w-0
                            gap-6

                            xl:grid-cols-[minmax(0,1fr)_340px]
                            xl:items-stretch
                            xl:gap-7
                        "
                    >
                        {/* ===========================================
                            TABLE WORKSPACE
                        =========================================== */}

                        <div
                            className="
                                relative
                                min-h-0
                                min-w-0

                                xl:h-full
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-h-0
                                    min-w-0
                                    flex-col

                                    overflow-hidden

                                    border
                                    border-[#252D38]

                                    bg-[#0E1219]

                                    xl:absolute
                                    xl:inset-0
                                "
                            >
                                {/* ===================================
                                    SEARCH TOOLBAR
                                =================================== */}

                                <div
                                    className="
                                        shrink-0

                                        border-b
                                        border-[#252D38]

                                        bg-[#1A222D]

                                        px-4
                                        py-3.5

                                        sm:px-5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-3.5

                                            lg:flex-row
                                            lg:items-center
                                            lg:justify-between
                                        "
                                    >
                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >
                                            <div className="relative">
                                                <Search
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="
                                                        pointer-events-none

                                                        absolute
                                                        left-3
                                                        top-1/2

                                                        -translate-y-1/2

                                                        text-[#697586]
                                                    "
                                                />

                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                    placeholder="Search by name or email"
                                                    className="
                                                        h-10
                                                        w-full

                                                        border
                                                        border-[#29323E]

                                                        bg-[#0A0E14]

                                                        pl-9
                                                        pr-16

                                                        font-sans!
                                                        text-[12px]
                                                        font-medium!

                                                        text-[#EEF1F5]

                                                        outline-none

                                                        transition-colors
                                                        duration-150

                                                        placeholder:text-[#5E6978]

                                                        hover:border-[#394553]

                                                        focus:border-[#4B5869]
                                                        focus:ring-0
                                                    "
                                                />

                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleClearSearch
                                                        }
                                                        className="
                                                            absolute
                                                            right-3
                                                            top-1/2

                                                            -translate-y-1/2

                                                            font-sans!
                                                            text-[9px]
                                                            font-semibold!
                                                            uppercase
                                                            tracking-[0.08em]

                                                            text-[#788493]

                                                            transition-colors

                                                            hover:text-[#EEF1F5]

                                                            focus:outline-none
                                                            focus:ring-0
                                                        "
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                shrink-0
                                                items-center
                                                gap-4
                                            "
                                        >
                                            <span
                                                className="
                                                    hidden
                                                    h-7
                                                    w-px

                                                    bg-[#303A47]

                                                    lg:block
                                                "
                                            />

                                            <div>
                                                <p
                                                    className="
                                                        font-sans!
                                                        text-[8px]
                                                        font-semibold!
                                                        uppercase
                                                        tracking-[0.14em]

                                                        text-[#657181]
                                                    "
                                                >
                                                    Directory
                                                </p>

                                                <p
                                                    className="
                                                        mt-1

                                                        font-sans!
                                                        text-[11px]
                                                        font-medium!

                                                        text-[#AAB3BF]
                                                    "
                                                >
                                                    {filteredUsers.length}{' '}
                                                    {filteredUsers.length === 1
                                                        ? 'result'
                                                        : 'results'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ===================================
                                    TABLE CONTEXT
                                =================================== */}

                                <div
                                    className="
                                        flex
                                        shrink-0
                                        items-center
                                        justify-between
                                        gap-4

                                        border-b
                                        border-[#252D38]

                                        bg-[#0E1219]

                                        px-4
                                        py-3.5

                                        sm:px-5
                                    "
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="
                                                font-sans!
                                                text-[12px]
                                                font-semibold!

                                                text-[#EEF1F5]
                                            "
                                        >
                                            Registered users
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                truncate

                                                font-sans!
                                                text-[10px]

                                                text-[#697586]
                                            "
                                        >
                                            Browse and review platform accounts
                                        </p>
                                    </div>

                                    <span
                                        className="
                                            hidden
                                            shrink-0

                                            font-sans!
                                            text-[9px]
                                            font-medium!

                                            text-[#697586]

                                            sm:block
                                        "
                                    >
                                        Sorted by account
                                    </span>
                                </div>

                                {/* ===================================
                                    TABLE
                                =================================== */}

                                <div
                                    className="
                                        min-h-0
                                        min-w-0
                                        flex-1

                                        overflow-auto

                                        bg-[#0E1219]

                                        [&::-webkit-scrollbar]:h-1.5
                                        [&::-webkit-scrollbar]:w-1.5

                                        [&::-webkit-scrollbar-track]:bg-[#0A0E14]
                                        [&::-webkit-scrollbar-thumb]:bg-[#303A47]

                                        hover:[&::-webkit-scrollbar-thumb]:bg-[#465261]
                                    "
                                >
                                    <UserTable
                                        columns={columns}
                                        rows={rows}
                                        onSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        resultCount={filteredUsers.length}
                                        onView={(userId) =>
                                            navigate(
                                                `/admin/dashboard/users/${userId}/details`,
                                            )
                                        }
                                        onDelete={openDeleteModal}
                                    />
                                </div>

                                {/* ===================================
                                    PAGINATION
                                =================================== */}

                                {filteredUsers.length > 0 && (
                                    <div
                                        className="
                                            shrink-0

                                            border-t
                                            border-[#252D38]

                                            bg-[#1A222D]
                                        "
                                    >
                                        <UserPagination
                                            currentPage={safeCurrentPage}
                                            totalPages={totalPages}
                                            totalItems={filteredUsers.length}
                                            itemsPerPage={USERS_PER_PAGE}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ===========================================
                            DESKTOP FILTER SIDEBAR
                        =========================================== */}

                        <aside
                            className="
                                hidden
                                min-w-0

                                border
                                border-[#252D38]

                                bg-[#0E1219]

                                xl:block
                            "
                        >
                            {filters}
                        </aside>
                    </div>
                </section>
            </div>

            {/* ========================================================
                MOBILE / TABLET FILTER DRAWER
            ======================================================== */}

            {mobileFiltersOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-100

                        xl:hidden
                    "
                >
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="
                            absolute
                            inset-0

                            bg-[#05070A]/75

                            backdrop-blur-[2px]
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-0
                            left-0
                            right-0

                            max-h-[88vh]
                            overflow-y-auto

                            border-t
                            border-[#252D38]

                            bg-[#0E1219]

                            shadow-[0_-20px_60px_rgba(0,0,0,0.45)]

                            sm:bottom-0
                            sm:left-auto
                            sm:top-0

                            sm:h-full
                            sm:max-h-none
                            sm:w-[380px]

                            sm:border-l
                            sm:border-t-0
                        "
                    >
                        <div
                            className="
                                sticky
                                top-0
                                z-30

                                flex
                                items-center
                                justify-between

                                border-b
                                border-[#252D38]

                                bg-[#0E1219]/95

                                px-4
                                py-3.5

                                backdrop-blur-md
                            "
                        >
                            <div>
                                <p
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]

                                        text-[#697586]
                                    "
                                >
                                    User directory
                                </p>

                                <p
                                    className="
                                        mt-1

                                        font-sans!
                                        text-[13px]
                                        font-semibold!

                                        text-[#EEF1F5]
                                    "
                                >
                                    Filters
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                aria-label="Close filters"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center

                                    border
                                    border-[#29323E]

                                    bg-[#151B24]

                                    text-[#8792A1]

                                    transition-colors
                                    duration-150

                                    hover:border-[#3B4655]
                                    hover:bg-[#1A222D]
                                    hover:text-[#EEF1F5]
                                "
                            >
                                <X size={16} strokeWidth={1.8} />
                            </button>
                        </div>

                        {filters}

                        <div
                            className="
                                sticky
                                bottom-0
                                z-30

                                border-t
                                border-[#252D38]

                                bg-[#0E1219]/95

                                p-4

                                backdrop-blur-md
                            "
                        >
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="
                                    flex
                                    h-10
                                    w-full
                                    items-center
                                    justify-center

                                    border
                                    border-[#394555]

                                    bg-[#171E28]

                                    font-sans!
                                    text-[11px]
                                    font-semibold!

                                    text-[#EEF1F5]

                                    transition-colors
                                    duration-150

                                    hover:border-[#4B5869]
                                    hover:bg-[#1D2632]
                                "
                            >
                                Show {filteredUsers.length}{' '}
                                {filteredUsers.length === 1 ? 'user' : 'users'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <UserSuccessToast show={toast.show} message={toast.message} />

            <UserDeleteModal
                user={selectedDeleteUser}
                loading={deleteLoading}
                error={deleteError}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteUser}
            />
        </>
    );
};

export default Users;
