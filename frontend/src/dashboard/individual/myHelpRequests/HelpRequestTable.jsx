import React from 'react';

import DataTable from '@/components/dashboard/DataTable';

const HelpRequestTable = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
}) => {
    return (
        <DataTable
            columns={columns}
            rows={rows}
            onSort={onSort}
            getSortIcon={getSortIcon}
            resultCount={resultCount}
            empty={{
                title: 'No help requests found',
                message: 'Try changing your search or filter options.',
            }}
        />
    );
};

export default HelpRequestTable;
