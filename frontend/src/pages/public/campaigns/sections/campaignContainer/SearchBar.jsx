import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => {
    return (
        <div
            className="
        flex items-center gap-3
        border-b border-border
        py-3 sm:py-4
        transition-colors
        focus-within:border-primary/30
        mt-6 md:mt-8
        mb-2
    "
        >
            <FiSearch
                className="
            shrink-0
            text-lg md:text-xl
            text-text-secondary
        "
            />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search campaigns, causes, or locations"
                className="
            w-full
            bg-transparent
            outline-none
            text-sm md:text-base
            text-text-primary
            placeholder:text-text-secondary/60
        "
            />
        </div>
    );
};

export default SearchBar;
