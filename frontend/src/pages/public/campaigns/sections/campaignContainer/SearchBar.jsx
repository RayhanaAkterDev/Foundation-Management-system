import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => {
    return (
        <div
            className="
                flex items-center gap-3
                border-b border-border
                pt-2 pb-4
                transition-colors
                focus-within:border-primary/20
                mb-2 mt-8
            "
        >
            <FiSearch className="text-text-secondary text-lg shrink-0" />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search campaigns, causes, or locations"
                className="
                    w-full
                    bg-transparent
                    outline-none
                    text-text-primary
                    placeholder:text-text-secondary/60
                "
            />
        </div>
    );
};

export default SearchBar;