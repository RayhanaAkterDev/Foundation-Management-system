// src/pages/Auth/Login/LoginFooter.jsx

import { Link } from 'react-router-dom';

const LoginFooter = () => {
    return (
        <footer className="mt-7">
            <div className="flex items-center justify-center gap-3 text-xs text-text-secondary">
                <Link
                    to="/terms"
                    className="transition-colors hover:text-primary"
                >
                    Terms of Service
                </Link>

                <span className="text-border">•</span>

                <Link
                    to="/privacy"
                    className="transition-colors hover:text-primary"
                >
                    Privacy Policy
                </Link>

                <span className="text-border">•</span>

                <Link
                    to="/contact"
                    className="transition-colors hover:text-primary"
                >
                    Contact
                </Link>
            </div>

            <p className="mx-auto mt-4 max-w-sm text-center text-[11px] leading-5 text-text-secondary/80">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
            </p>
        </footer>
    );
};

export default LoginFooter;
