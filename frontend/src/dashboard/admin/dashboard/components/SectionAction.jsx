import React from 'react';

import { ArrowRight } from 'lucide-react';

const SectionAction = ({ children, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="
            inline-flex w-fit items-center gap-2
            border-b border-primary/30 pb-1.5
            font-poppins text-[10px] font-semibold uppercase
            tracking-widest text-primary
            transition-colors hover:border-primary hover:text-primary-hover
        "
    >
        {children}

        <ArrowRight size={13} />
    </button>
);

export default SectionAction;
