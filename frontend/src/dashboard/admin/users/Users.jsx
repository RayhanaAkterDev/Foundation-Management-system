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
    UsersRound,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import UserDeleteModal from './modals/DeleteModal';

import UserStats from './components/Stats';
import UserCategoryTabs from './components/CategoryTabs';
import UserFilters from './components/Filters';
import UserTable from './components/Table';
import UserPagination from './components/Pagination';
import UserSuccessToast from './components/SuccessToast';

import { fetchUsers, deleteUser } from './api/userApi';

const USERS_PER_PAGE = 25;

const Users = () => {
    const navigate = useNavigate();

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

    const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
    // FILTER STATE
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
            width: '60px',
        },
        {
            key: 'name',
            header: 'User',
            sortable: true,
            sortKey: 'name',
        },
        {
            key: 'role',
            header: 'Role',
            sortable: true,
            sortKey: 'role',
        },
        {
            key: 'emailVerification',
            header: 'Email Verification',
            sortable: true,
            sortKey: 'emailVerification',
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '110px',
        },
    ];

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div>
                <PageHeader
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
                />

                <div
                    className="
                        flex
                        min-h-[320px]
                        items-center
                        justify-center
                        border
                        border-[#343944]
                        bg-[#22252D]
                    "
                >
                    <div className="text-center">
                        <div
                            className="
                                mx-auto
                                h-8
                                w-8
                                animate-spin
                                rounded-full
                                border-2
                                border-[#404754]
                                border-t-[#C3C7CF]
                            "
                        />

                        <p
                            className="
                                mt-4
                                text-sm
                                font-semibold
                                text-[#F1F2F4]
                            "
                        >
                            Loading users...
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-[#9299A6]
                            "
                        >
                            Retrieving the user directory.
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
            <div>
                <PageHeader
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
                />

                <div
                    className="
                        border
                        border-[#5A343B]
                        bg-[#38272C]
                        px-5
                        py-4
                        text-sm
                        text-[#E9A1A8]
                    "
                >
                    {error}
                </div>
            </div>
        );
    }

    // ============================================================
    // FILTER CONTENT
    // ============================================================

    const filterContent = (
        <>
            <div className="px-5 pb-5 pt-5">
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-[#6F7785]
                            "
                        >
                            Directory controls
                        </p>

                        <h3
                            className="
                                mt-1.5
                                text-[15px]
                                font-semibold
                                text-[#F1F2F4]
                            "
                        >
                            Filter users
                        </h3>
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="
                                text-[11px]
                                font-medium
                                text-[#9299A6]
                                transition-colors
                                hover:text-[#F1F2F4]
                            "
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <p
                    className="
                        mt-2
                        text-[12px]
                        leading-5
                        text-[#9299A6]
                    "
                >
                    Refine the directory by role, account status and
                    verification.
                </p>
            </div>

            <div
                className="
                    border-t
                    border-[#343944]
                    px-4
                    py-5
                "
            >
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        px-1
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-[#6F7785]
                        "
                    >
                        User role
                    </p>

                    <span
                        className="
                            text-[10px]
                            tabular-nums
                            text-[#6F7785]
                        "
                    >
                        {categoryTabs.length}
                    </span>
                </div>

                <UserCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />
            </div>

            <div
                className="
                    border-t
                    border-[#343944]
                    px-4
                    py-5
                "
            >
                <p
                    className="
                        mb-3
                        px-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#6F7785]
                    "
                >
                    Account filters
                </p>

                <UserFilters
                    statusFilter={statusFilter}
                    onStatusChange={handleStatusChange}
                    verificationFilter={verificationFilter}
                    onVerificationChange={handleVerificationChange}
                />
            </div>
        </>
    );

    // ============================================================
    // MAIN
    // ============================================================

    return (
        <>
            <div className="min-w-0">
                {/* ========================================================
                    HEADER
                ======================================================== */}

                <PageHeader
                    title="Users"
                    subtitle="Manage registered users, account roles, verification and platform access."
                    action={
                        <div
                            className="
                                flex
                                w-full
                                items-center
                                gap-2

                                sm:w-auto
                                sm:justify-end
                            "
                        >
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredUsers.length === 0}
                                className="
                                    inline-flex
                                    h-10
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    border
                                    border-[#404754]
                                    bg-[#22252D]
                                    px-3.5
                                    text-[12px]
                                    font-medium
                                    text-[#C3C7CF]
                                    transition-colors

                                    hover:border-[#515866]
                                    hover:bg-[#272B34]
                                    hover:text-[#F1F2F4]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40

                                    sm:flex-none
                                "
                            >
                                <Download size={15} strokeWidth={1.8} />
                                Export CSV
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/admin/dashboard/users/add')
                                }
                                className="
                                    inline-flex
                                    h-10
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    border
                                    border-[#4B5260]
                                    bg-[#303641]
                                    px-3.5
                                    text-[12px]
                                    font-semibold
                                    text-[#F1F2F4]
                                    transition-colors

                                    hover:border-[#5A6270]
                                    hover:bg-[#393F4C]

                                    sm:flex-none
                                "
                            >
                                <Plus size={16} strokeWidth={2} />
                                Add User
                            </button>
                        </div>
                    }
                />

                {/* ========================================================
                    STATS
                ======================================================== */}

                <UserStats
                    total={statistics.total}
                    individuals={statistics.individuals}
                    organizations={statistics.organizations}
                    administrators={statistics.administrators}
                />

                {/* ========================================================
                    USER DIRECTORY
                ======================================================== */}

                <section className="mt-8 sm:mt-10">
                    {/* Section heading */}

                    <div
                        className="
                            mb-4
                            flex
                            flex-col
                            gap-3

                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div className="min-w-0">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <UsersRound
                                    size={15}
                                    strokeWidth={1.8}
                                    className="text-[#9299A6]"
                                />

                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-[#6F7785]
                                    "
                                >
                                    User directory
                                </span>
                            </div>

                            <h2
                                className="
                                    mt-1.5
                                    text-[17px]
                                    font-semibold
                                    tracking-[-0.015em]
                                    text-[#F1F2F4]

                                    sm:text-[18px]
                                "
                            >
                                Manage accounts
                            </h2>

                            <p
                                className="
                                    mt-1
                                    max-w-xl
                                    text-[12px]
                                    leading-5
                                    text-[#9299A6]
                                "
                            >
                                Search, review and manage registered platform
                                accounts.
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-[11px]
                                text-[#9299A6]
                            "
                        >
                            <span
                                className="
                                    font-semibold
                                    tabular-nums
                                    text-[#F1F2F4]
                                "
                            >
                                {filteredUsers.length}
                            </span>

                            <span>
                                {filteredUsers.length === 1
                                    ? 'result'
                                    : 'results'}
                            </span>
                        </div>
                    </div>

                    {/* ====================================================
                        DIRECTORY LAYOUT
                    ==================================================== */}

                    <div
                        className="
                            grid
                            min-w-0
                            gap-4

                            xl:grid-cols-[minmax(0,1fr)_250px]
                        "
                    >
                        {/* =================================================
                            TABLE WORKSPACE
                        ================================================= */}

                        <div
                            className="
                                min-w-0
                                overflow-hidden
                                border
                                border-[#343944]
                                bg-[#22252D]
                            "
                        >
                            {/* Toolbar */}

                            <div
                                className="
                                    border-b
                                    border-[#343944]
                                    bg-[#20232A]
                                    p-3

                                    sm:p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3

                                        sm:flex-row
                                        sm:items-center
                                    "
                                >
                                    {/* Search */}

                                    <div
                                        className="
                                            relative
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        <Search
                                            size={16}
                                            strokeWidth={1.8}
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-[#6F7785]
                                            "
                                        />

                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Search users by name or email..."
                                            className="
                                                h-10
                                                w-full
                                                border
                                                border-[#343944]
                                                bg-[#181A20]
                                                pl-9
                                                pr-14
                                                text-[12px]
                                                text-[#F1F2F4]
                                                outline-none
                                                transition-colors

                                                placeholder:text-[#6F7785]

                                                hover:border-[#404754]

                                                focus:border-[#515866]
                                                focus:ring-0
                                            "
                                        />

                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={handleClearSearch}
                                                className="
                                                    absolute
                                                    right-3
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-[10px]
                                                    font-semibold
                                                    text-[#9299A6]
                                                    transition-colors
                                                    hover:text-[#F1F2F4]
                                                "
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile/tablet filter button */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileFiltersOpen(true)
                                        }
                                        className="
                                            inline-flex
                                            h-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            gap-2
                                            border
                                            border-[#404754]
                                            bg-[#272B34]
                                            px-3.5
                                            text-[12px]
                                            font-medium
                                            text-[#C3C7CF]
                                            transition-colors

                                            hover:bg-[#303641]
                                            hover:text-[#F1F2F4]

                                            xl:hidden
                                        "
                                    >
                                        <SlidersHorizontal
                                            size={15}
                                            strokeWidth={1.8}
                                        />
                                        Filters
                                        {activeFilterCount > 0 && (
                                            <span
                                                className="
                                                    flex
                                                    h-5
                                                    min-w-5
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[#393F4C]
                                                    px-1
                                                    text-[10px]
                                                    font-semibold
                                                    text-[#F1F2F4]
                                                "
                                            >
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Table context */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    border-b
                                    border-[#343944]
                                    px-4
                                    py-3
                                "
                            >
                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-[12px]
                                            font-semibold
                                            text-[#F1F2F4]
                                        "
                                    >
                                        Registered users
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[10px]
                                            text-[#6F7785]

                                            sm:text-[11px]
                                        "
                                    >
                                        {filteredUsers.length} matching{' '}
                                        {filteredUsers.length === 1
                                            ? 'account'
                                            : 'accounts'}
                                    </p>
                                </div>

                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="
                                            hidden
                                            shrink-0
                                            text-[11px]
                                            font-medium
                                            text-[#9299A6]
                                            transition-colors
                                            hover:text-[#F1F2F4]

                                            sm:block
                                        "
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>

                            {/* =================================================
                                TABLE
                            ================================================= */}

                            <div
                                className="
                                    min-w-0
                                    overflow-x-auto
                                "
                            >
                                <div className="min-w-[760px]">
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
                            </div>

                            {/* Pagination */}

                            {filteredUsers.length > 0 && (
                                <div
                                    className="
                                        border-t
                                        border-[#343944]
                                        bg-[#20232A]
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

                        {/* =================================================
                            DESKTOP FILTER SIDEBAR
                        ================================================= */}

                        <aside
                            className="
                                hidden
                                self-start
                                overflow-hidden
                                border
                                border-[#343944]
                                bg-[#22252D]

                                xl:block
                            "
                        >
                            {filterContent}
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
                        z-50

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
                            bg-black/55
                            backdrop-blur-[2px]
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            max-h-[85vh]
                            overflow-y-auto
                            border-t
                            border-[#404754]
                            bg-[#22252D]
                            shadow-2xl

                            sm:bottom-auto
                            sm:left-auto
                            sm:right-0
                            sm:top-0
                            sm:h-full
                            sm:max-h-none
                            sm:w-[340px]
                            sm:border-l
                            sm:border-t-0
                        "
                    >
                        <div
                            className="
                                sticky
                                top-0
                                z-10
                                flex
                                items-center
                                justify-between
                                border-b
                                border-[#343944]
                                bg-[#20232A]
                                px-5
                                py-4
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-[#6F7785]
                                    "
                                >
                                    Directory
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-sm
                                        font-semibold
                                        text-[#F1F2F4]
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
                                    border-[#343944]
                                    text-[#9299A6]
                                    transition-colors

                                    hover:bg-[#272B34]
                                    hover:text-[#F1F2F4]
                                "
                            >
                                <X size={17} strokeWidth={1.8} />
                            </button>
                        </div>

                        {filterContent}

                        <div
                            className="
                                sticky
                                bottom-0
                                border-t
                                border-[#343944]
                                bg-[#20232A]
                                p-4
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
                                    bg-[#303641]
                                    text-[12px]
                                    font-semibold
                                    text-[#F1F2F4]
                                    transition-colors
                                    hover:bg-[#393F4C]
                                "
                            >
                                Show {filteredUsers.length}{' '}
                                {filteredUsers.length === 1 ? 'user' : 'users'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                SUCCESS TOAST
            ======================================================== */}

            <UserSuccessToast show={toast.show} message={toast.message} />

            {/* ========================================================
                DELETE DIALOG
            ======================================================== */}

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
