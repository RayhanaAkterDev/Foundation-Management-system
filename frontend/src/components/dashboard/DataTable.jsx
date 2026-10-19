import React, {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { ChevronsUpDown } from 'lucide-react';
import EmptyState from './EmptyState';

/* ==========================================================================
   HELPERS
============================================================================ */

const getAlignmentClass = (align) => {
    if (align === 'right') return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
};

const getContentAlignmentClass = (align) => {
    if (align === 'right') return 'justify-end';
    if (align === 'center') return 'justify-center';
    return 'justify-start';
};

const getPixelWidth = (width) => {
    if (typeof width === 'number') return width;

    if (typeof width === 'string' && /^\d+(\.\d+)?px$/.test(width.trim())) {
        return Number.parseFloat(width);
    }

    return null;
};

/*
 * These are baseline minimum widths.
 * The shared table additionally measures action controls
 * from actual rendered rows, including conditional buttons.
 */

const DEFAULT_MINIMUMS = {
    serialNumber: 58,
    name: 180,
    role: 115,
    status: 105,
    emailVerification: 130,
    email_verified_at: 130,
    emailVerified: 130,
    verification_status: 115,
    organization_type: 120,
    registration_number: 105,
    registeredDate: 105,
    actions: 110,
};

const getColumnMinimum = (column, fallback, measuredWidths) => {
    const base = DEFAULT_MINIMUMS[column.key] ?? fallback;

    const configured =
        typeof column.minWidth === 'number' ? column.minWidth : 0;

    const measured = measuredWidths[column.key] ?? 0;

    return Math.max(base, configured, measured);
};

/*
 * Build valid grid tracks.
 * Existing minmax() expressions are handled directly.
 * Never create nested minmax() expressions.
 */

const getGridTrack = (width, minimum) => {
    const fixed = getPixelWidth(width);

    if (fixed !== null) {
        return `${Math.max(fixed, minimum)}px`;
    }

    if (typeof width !== 'string') {
        return `minmax(${minimum}px, 1fr)`;
    }

    const trimmed = width.trim();

    const minmaxMatch = trimmed.match(/^minmax\(\s*([^,]+)\s*,\s*(.+)\s*\)$/i);

    if (minmaxMatch) {
        const upper = minmaxMatch[2].trim();
        return `minmax(${minimum}px, ${upper})`;
    }

    if (/^\d*\.?\d+fr$/i.test(trimmed)) {
        return `minmax(${minimum}px, ${trimmed})`;
    }

    return `minmax(${minimum}px, ${trimmed})`;
};

/* ==========================================================================
   DATA TABLE
============================================================================ */

const DataTable = ({
    columns = [],
    rows = [],
    keyField = 'id',
    empty,
    onSort,
    getSortIcon,
    resizableColumns = false,
    minColumnWidth = 80,
    maxColumnWidth = 520,
}) => {
    const [columnWidths, setColumnWidths] = useState({});
    const [measuredWidths, setMeasuredWidths] = useState({});

    const tableRef = useRef(null);
    const headerScrollRef = useRef(null);
    const bodyScrollRef = useRef(null);
    const resizeCleanupRef = useRef(null);

    /* ======================================================================
       MEASURE NON-TRUNCATABLE CONTROLS
    ====================================================================== */

    const measureControls = useCallback(() => {
        const table = tableRef.current;

        if (!table) return;

        const nextWidths = {};

        /*
         * Measure every row's action group, not just the first.
         * This protects conditional controls such as an
         * organization's Review button.
         */

        columns.forEach((column) => {
            if (column.key !== 'actions') return;

            const cells = table.querySelectorAll('[data-table-cell="actions"]');

            let requiredWidth = 0;

            cells.forEach((cell) => {
                const content = cell.firstElementChild;

                if (!content) return;

                const actionGroup = content.firstElementChild;

                if (!actionGroup) return;

                const groupStyle = window.getComputedStyle(actionGroup);

                const gap = Number.parseFloat(groupStyle.columnGap) || 0;

                const children = Array.from(actionGroup.children).filter(
                    (element) =>
                        window.getComputedStyle(element).display !== 'none',
                );

                const contentWidth = children.reduce((total, element) => {
                    return total + element.getBoundingClientRect().width;
                }, 0);

                const gaps = Math.max(0, children.length - 1) * gap;

                const cellStyle = window.getComputedStyle(cell);

                const padding =
                    (Number.parseFloat(cellStyle.paddingLeft) || 0) +
                    (Number.parseFloat(cellStyle.paddingRight) || 0);

                requiredWidth = Math.max(
                    requiredWidth,
                    contentWidth + gaps + padding + 8,
                );
            });

            if (requiredWidth > 0) {
                nextWidths[column.key] = Math.ceil(requiredWidth);
            }
        });

        setMeasuredWidths((current) => {
            const oldKeys = Object.keys(current);
            const newKeys = Object.keys(nextWidths);

            if (
                oldKeys.length === newKeys.length &&
                newKeys.every((key) => current[key] === nextWidths[key])
            ) {
                return current;
            }

            return nextWidths;
        });
    }, [columns]);

    useLayoutEffect(() => {
        measureControls();
    }, [measureControls, rows]);

    /* ======================================================================
       GRID TEMPLATE
    ====================================================================== */

    const minimumWidths = useMemo(() => {
        return columns.map((column) =>
            getColumnMinimum(column, minColumnWidth, measuredWidths),
        );
    }, [columns, minColumnWidth, measuredWidths]);

    const gridTemplate = useMemo(() => {
        return columns
            .map((column, index) => {
                const minimum = minimumWidths[index];

                const resized = resizableColumns
                    ? columnWidths[column.key]
                    : undefined;

                if (typeof resized === 'number') {
                    return `${Math.max(resized, minimum)}px`;
                }

                return getGridTrack(column.width || 'minmax(0, 1fr)', minimum);
            })
            .join(' ');
    }, [columns, minimumWidths, columnWidths, resizableColumns]);

    /*
     * The grid itself has a minimum total width.
     * Its tracks never have to collapse to fit the viewport.
     */

    const tableMinWidth = useMemo(() => {
        const contentWidth = columns.reduce((total, column, index) => {
            const minimum = minimumWidths[index];

            const resized = resizableColumns
                ? columnWidths[column.key]
                : undefined;

            const fixed = getPixelWidth(column.width);

            return (
                total +
                Math.max(
                    minimum,
                    typeof resized === 'number' ? resized : (fixed ?? minimum),
                )
            );
        }, 0);

        // Allow for horizontal padding of grid rows.
        return contentWidth + 32;
    }, [columns, minimumWidths, columnWidths, resizableColumns]);

    /* ======================================================================
       SYNCHRONIZE HORIZONTAL SCROLLING
    ====================================================================== */

    const syncFromBody = (event) => {
        const header = headerScrollRef.current;

        if (header) {
            header.scrollLeft = event.currentTarget.scrollLeft;
        }
    };

    const syncFromHeader = (event) => {
        const body = bodyScrollRef.current;

        if (body) {
            body.scrollLeft = event.currentTarget.scrollLeft;
        }
    };

    /* ======================================================================
       START COLUMN RESIZE
    ====================================================================== */

    const startResize = (event, column) => {
        if (
            !resizableColumns ||
            column.resizable === false ||
            event.button !== 0
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        resizeCleanupRef.current?.();

        const headerElement = event.currentTarget.parentElement;

        if (!headerElement) return;

        const startX = event.clientX;

        const startWidth = headerElement.getBoundingClientRect().width;

        const minimum = getColumnMinimum(
            column,
            minColumnWidth,
            measuredWidths,
        );

        const maximum = Math.max(
            minimum,
            typeof column.maxWidth === 'number'
                ? column.maxWidth
                : maxColumnWidth,
        );

        const columnKey = column.key;

        const handlePointerMove = (moveEvent) => {
            const difference = moveEvent.clientX - startX;

            const nextWidth = Math.round(
                Math.min(Math.max(startWidth + difference, minimum), maximum),
            );

            setColumnWidths((currentWidths) => {
                if (currentWidths[columnKey] === nextWidth) {
                    return currentWidths;
                }

                return {
                    ...currentWidths,
                    [columnKey]: nextWidth,
                };
            });
        };

        const cleanup = () => {
            window.removeEventListener('pointermove', handlePointerMove);

            window.removeEventListener('pointerup', handlePointerUp);

            window.removeEventListener('pointercancel', handlePointerUp);

            resizeCleanupRef.current = null;
        };

        function handlePointerUp() {
            cleanup();
        }

        resizeCleanupRef.current = cleanup;

        window.addEventListener('pointermove', handlePointerMove);

        window.addEventListener('pointerup', handlePointerUp);

        window.addEventListener('pointercancel', handlePointerUp);
    };

    /* ======================================================================
       RESET COLUMN WIDTH
    ====================================================================== */

    const resetColumnWidth = (event, column) => {
        if (!resizableColumns || column.resizable === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const originalWidth = getPixelWidth(column.width);

        setColumnWidths((currentWidths) => {
            const nextWidths = {
                ...currentWidths,
            };

            if (originalWidth !== null) {
                nextWidths[column.key] = Math.max(
                    originalWidth,
                    getColumnMinimum(column, minColumnWidth, measuredWidths),
                );
            } else {
                delete nextWidths[column.key];
            }

            return nextWidths;
        });
    };

    /* ======================================================================
       EMPTY STATE
    ====================================================================== */

    if (rows.length === 0) {
        return (
            <div
                className="
                    flex min-h-65 w-full items-center
                    justify-center bg-[#0E1219]
                    px-5 py-10
                "
            >
                <div className="w-full max-w-70">
                    <EmptyState
                        icon={empty?.icon}
                        title={empty?.title || 'No records found'}
                        message={
                            empty?.message ||
                            'There is currently no data to display.'
                        }
                    />
                </div>
            </div>
        );
    }

    /* ======================================================================
       TABLE
    ====================================================================== */

    return (
        <div
            ref={tableRef}
            role="table"
            className="
                relative w-full min-w-0
                bg-[#0E1219]
            "
        >
            {/* =============================================================
                STICKY TABLE HEADER
            ============================================================= */}

            <div
                className="
                    sticky top-0 z-40
                    w-full min-w-0
                    bg-[#121821]
                    shadow-[0_1px_0_rgba(37,45,56,0.9)]
                "
            >
                <div
                    ref={headerScrollRef}
                    onScroll={syncFromHeader}
                    className="
                        w-full min-w-0
                        overflow-x-auto
                        overflow-y-hidden
                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden
                    "
                >
                    <div
                        role="row"
                        className="
                            grid min-h-11 items-center
                            border-b border-[#252D38]
                            bg-[#121821]
                            px-3
                            sm:px-4
                        "
                        style={{
                            minWidth: `${tableMinWidth}px`,
                            gridTemplateColumns: gridTemplate,
                        }}
                    >
                        {columns.map((column) => {
                            const sortable = Boolean(column.sortable && onSort);

                            const sortKey = column.sortKey || column.key;

                            const canResize =
                                resizableColumns && column.resizable !== false;

                            return (
                                <div
                                    key={column.key}
                                    role="columnheader"
                                    className={`
                                        relative min-w-0
                                        border-x first:border-0 last:border-0
                                        border-[#252D38]
                                        px-2
                                        text-[9px] font-semibold!
                                        uppercase tracking-[0.13em]
                                        text-[#697586]
                                        ${getAlignmentClass(column.align)}
                                    `}
                                >
                                    {sortable ? (
                                        <button
                                            type="button"
                                            onClick={() => onSort(sortKey)}
                                            className={`
                                                group inline-flex
                                                min-h-8 min-w-0 max-w-full
                                                items-center gap-1.5
                                                overflow-hidden
                                                whitespace-nowrap
                                                text-[#697586]
                                                transition-colors duration-150
                                                hover:text-[#AEB7C3]
                                                focus:outline-none focus:ring-0
                                                ${
                                                    column.align === 'right'
                                                        ? 'ml-auto'
                                                        : ''
                                                }
                                                ${
                                                    column.align === 'center'
                                                        ? 'mx-auto'
                                                        : ''
                                                }
                                            `}
                                        >
                                            <span
                                                className="min-w-0 truncate"
                                                title={String(
                                                    column.header ?? '',
                                                )}
                                            >
                                                {column.header}
                                            </span>

                                            <span
                                                className="
                                                    flex h-4 w-4 shrink-0
                                                    items-center justify-center
                                                    text-[#566171]
                                                    transition-colors duration-150
                                                    group-hover:text-[#929CAA]
                                                "
                                            >
                                                {getSortIcon ? (
                                                    getSortIcon(sortKey)
                                                ) : (
                                                    <ChevronsUpDown
                                                        size={12}
                                                        strokeWidth={1.8}
                                                    />
                                                )}
                                            </span>
                                        </button>
                                    ) : (
                                        <span
                                            className={`
                                                flex min-h-8 min-w-0
                                                max-w-full items-center
                                                overflow-hidden
                                                ${getContentAlignmentClass(
                                                    column.align,
                                                )}
                                            `}
                                        >
                                            <span
                                                className="min-w-0 truncate"
                                                title={String(
                                                    column.header ?? '',
                                                )}
                                            >
                                                {column.header}
                                            </span>
                                        </span>
                                    )}

                                    {/* RESIZE HANDLE */}

                                    {canResize && (
                                        <div
                                            role="separator"
                                            aria-orientation="vertical"
                                            aria-label={`Resize ${column.header} column`}
                                            title="Drag to resize · Double-click to reset"
                                            onPointerDown={(event) =>
                                                startResize(event, column)
                                            }
                                            onDoubleClick={(event) =>
                                                resetColumnWidth(event, column)
                                            }
                                            className="
                                                group/resize
                                                absolute top-0 -right-1 z-20
                                                h-full w-2
                                                cursor-col-resize
                                                touch-none select-none
                                            "
                                        >
                                            <span
                                                className="
                                                    absolute top-1/2 right-0.75
                                                    h-5 w-px -translate-y-1/2
                                                    bg-[#303A47] opacity-0
                                                    transition-[height,background-color,opacity]
                                                    duration-150
                                                    group-hover/resize:h-7
                                                    group-hover/resize:bg-[#697586]
                                                    group-hover/resize:opacity-100
                                                "
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* =============================================================
                HORIZONTALLY SCROLLABLE TABLE BODY
                NO ADDITIONAL VERTICAL SCROLLBAR
            ============================================================= */}

            <div
                ref={bodyScrollRef}
                onScroll={syncFromBody}
                className="
                    w-full min-w-0
                    overflow-x-auto
                    bg-[#0E1219]
                "
            >
                <div
                    style={{
                        minWidth: `${tableMinWidth}px`,
                    }}
                >
                    {/* =====================================================
                        TABLE DATA ROWS
                    ===================================================== */}

                    <div role="rowgroup">
                        {rows.map((row, rowIndex) => (
                            <div
                                key={row[keyField] ?? rowIndex}
                                role="row"
                                className="
                                    group/row
                                    grid min-h-15 items-center
                                    border-b border-[#202832]
                                    bg-[#0E1219]
                                    px-3
                                    transition-colors duration-150 ease-out
                                    last:border-b-0
                                    hover:bg-[#151B24]
                                    sm:px-4
                                "
                                style={{
                                    gridTemplateColumns: gridTemplate,
                                }}
                            >
                                {columns.map((column) => {
                                    const value = row[column.key];

                                    const isActions = column.key === 'actions';

                                    return (
                                        <div
                                            key={column.key}
                                            role="cell"
                                            data-table-cell={column.key}
                                            className={`
                                                min-w-0
                                                px-2
                                                text-[11px] leading-5
                                                text-[#B8C0CA]
                                                transition-colors duration-150
                                                group-hover/row:text-[#C8CED6]
                                                ${getAlignmentClass(
                                                    column.align,
                                                )}
                                                ${
                                                    column.nowrap
                                                        ? 'whitespace-nowrap'
                                                        : ''
                                                }
                                                ${
                                                    isActions
                                                        ? 'overflow-visible'
                                                        : 'overflow-hidden'
                                                }
                                            `}
                                        >
                                            <div
                                                className={
                                                    isActions
                                                        ? 'min-w-0 w-full'
                                                        : 'min-w-0 w-full overflow-hidden'
                                                }
                                            >
                                                {column.render ? (
                                                    column.render(
                                                        value,
                                                        row,
                                                        rowIndex,
                                                    )
                                                ) : (
                                                    <span
                                                        className="
                                                            block min-w-0
                                                            max-w-full truncate
                                                        "
                                                        title={
                                                            value == null
                                                                ? ''
                                                                : String(value)
                                                        }
                                                    >
                                                        {value ?? '—'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
