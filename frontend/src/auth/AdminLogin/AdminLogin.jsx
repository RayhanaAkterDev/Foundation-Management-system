import LoginForm from '../Login/LoginForm';
import logo from '@/assets/shared/footerLogo.png';

const AdminLogin = () => {
    return (
        <section className="min-h-screen bg-background">
            <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                {/* =====================================================
                    LEFT — Admin Branding
                ===================================================== */}
                <div className="relative hidden overflow-hidden bg-primary lg:block">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-40 -top-40 h-125 w-125 rounded-full bg-white/5 blur-3xl" />

                        <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-black/10 blur-3xl" />

                        <div className="absolute bottom-24 right-20 h-64 w-px rotate-45 bg-white/10" />

                        <div className="absolute bottom-20 right-32 h-40 w-px rotate-45 bg-white/10" />
                    </div>

                    <div className="relative z-10 flex min-h-screen flex-col px-12 py-12 xl:px-16 xl:py-14">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="h-11 w-11 rounded-xl bg-white p-1.5"
                            />

                            <div>
                                <p className="font-fraunces text-xl leading-none text-white">
                                    Stand For People
                                </p>

                                <p className="mt-1 text-xs text-white/60">
                                    Centralized humanitarian coordination.
                                </p>
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="flex flex-1 items-center">
                            <div className="max-w-xl">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-white/40" />

                                    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/65">
                                        Administration
                                    </span>
                                </div>

                                <h1 className="mt-7 max-w-lg font-fraunces text-5xl font-medium leading-[1.08] text-white xl:text-[58px]">
                                    Coordinate
                                    <span className="block text-white/65">
                                        with purpose.
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-md text-base leading-7 text-white/70 xl:text-lg xl:leading-8">
                                    Access the Stand For People administration
                                    workspace to coordinate users,
                                    organizations, requests, campaigns,
                                    donations, volunteers, and reports.
                                </p>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div>
                            <p className="max-w-xs text-xs leading-5 text-white/40">
                                Authorized administrators only. This area is
                                reserved for managing the SP platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    RIGHT — Admin Login
                ===================================================== */}
                <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
                    <div className="w-full max-w-md">
                        {/* Mobile brand */}
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="h-10 w-10 rounded-xl bg-primary p-1.5"
                            />

                            <div>
                                <p className="font-fraunces text-lg font-semibold text-text-primary">
                                    Stand For People
                                </p>

                                <p className="text-xs text-text-secondary">
                                    Administration
                                </p>
                            </div>
                        </div>

                        {/* Header */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Admin Portal
                            </p>

                            <h1 className="mt-3 font-fraunces text-3xl font-semibold text-text-primary sm:text-4xl">
                                Administrator sign in
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
                                Sign in with your authorized administrator
                                account to continue.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="mt-8 rounded-3xl border border-border/80 bg-surface p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)] sm:p-8">
                            <LoginForm loginRole="admin" />
                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-text-secondary">
                            Administrator access is separate from public
                            Individual and Organization accounts.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;
