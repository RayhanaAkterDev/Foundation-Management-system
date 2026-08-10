// src/pages/Auth/Login/LoginHeader.jsx

import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const LoginHeader = () => {
    return (
        <header>
            {/* Small label */}
            <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LogIn size={16} strokeWidth={2} />
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Sign In
                </span>
            </div>

            <h1 className="mt-5 font-fraunces text-4xl leading-tight text-text-primary sm:text-[42px]">
                Welcome back
            </h1>

            <p className="mt-3 max-w-md text-[15px] leading-7 text-text-secondary">
                Sign in to continue supporting verified campaigns, volunteer
                initiatives, and community requests.
            </p>

            <p className="mt-6 text-sm text-text-secondary">
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
