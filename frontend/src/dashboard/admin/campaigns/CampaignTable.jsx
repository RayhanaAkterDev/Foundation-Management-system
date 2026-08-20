import React from 'react';

import DataTable from '@/components/dashboard/DataTable';

const CampaignTable = ({ columns, rows, onSort, getSortIcon, resultCount }) => {
    return (
        <DataTable
            columns={columns}
            rows={rows}
            onSort={onSort}
            getSortIcon={getSortIcon}
            resultCount={resultCount}
            empty={{
                title: 'No campaigns found',
                message: 'Try changing your search or filter options.',
            }}
        />
    );
};

export default CampaignTable;
