// src/pages/Auth/Login/LoginHeader.jsx

import { Link } from 'react-router-dom';

const LoginHeader = () => {
    return (
        <header>
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Sign In
            </span>

            <h1 className="mt-4 font-fraunces text-[38px] leading-tight text-text-primary">
                Welcome back
            </h1>

            <p className="mt-3 max-w-md text-base leading-7 text-text-secondary">
                Sign in to continue supporting verified campaigns, volunteer
                initiatives, and community requests through one trusted
                platform.
            </p>

            <p className="mt-7 text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link
                    to="/account/register"
                    className="font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                    Create one
                </Link>
            </p>
        </header>
    );
};

export default LoginHeader;
