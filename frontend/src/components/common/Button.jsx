import React from 'react';

function Button({ children, variant = 'primary' }) {
    const baseStyles =
        'px-5 py-2 rounded-md font-medium transition-all duration-300 cursor-pointer flex items-center gap-2';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        outline:
            'border border-primary text-primary hover:bg-primary hover:text-white',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]}`}>
            {children}
        </button>
    );
}

export default Button;
