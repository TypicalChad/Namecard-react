import React, { memo } from "react";

const TableFilter = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Search:</span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
                    placeholder="Search..."
                />
            </div>
        </div>
    );
};

export default memo(TableFilter);
