// src/pages/Auth/Login/Login.jsx

import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';
import logo from '@/assets/shared/footerLogo.png';

const Login = () => {
    return (
        <section className="min-h-screen bg-background">
            <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                {/* =========================================================
                    LEFT — Brand / Welcome
                ========================================================= */}
                <div className="relative hidden overflow-hidden bg-primary lg:block">
                    {/* Soft background shapes */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-40 -top-40 h-125 w-125 rounded-full bg-white/5 blur-3xl" />

                        <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-black/10 blur-3xl" />

                        {/* Minimal decorative line */}
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
                                    Helping people. Building stronger
                                    communities.
                                </p>
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="flex flex-1 items-center">
                            <div className="max-w-xl">
                                {/* Small label */}
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-white/40" />

                                    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/65">
                                        Welcome back
                                    </span>
                                </div>

                                <h1 className="mt-7 max-w-lg font-fraunces text-5xl font-medium leading-[1.08] text-white xl:text-[58px]">
                                    Continue making
                                    <span className="block text-white/65">
                                        a difference.
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-md text-base leading-7 text-white/70 xl:text-lg xl:leading-8">
                                    Sign in to continue supporting people,
                                    managing your activities, and staying
                                    connected with the communities that need
                                    you.
                                </p>

                                {/* Simple stat */}
                                <div className="mt-10 flex items-center gap-5">
                                    <div>
                                        <p className="font-fraunces text-3xl text-white">
                                            12,800+
                                        </p>

                                        <p className="mt-1 text-xs text-white/55">
                                            People supported
                                        </p>
                                    </div>

                                    <div className="h-10 w-px bg-white/15" />

                                    <div>
                                        <p className="font-fraunces text-3xl text-white">
                                            2026
                                        </p>

                                        <p className="mt-1 text-xs text-white/55">
                                            Building together
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="flex items-end justify-between">
                            <p className="max-w-xs text-xs leading-5 text-white/40">
                                A trusted space for individuals and
                                organizations working together for stronger
                                communities.
                            </p>

                            <span className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                                Stand For People
                            </span>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    RIGHT — Login
                ========================================================= */}
                <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
                    <div className="w-full max-w-md">
                        <LoginHeader />

                        <div className="mt-8 rounded-3xl border border-border/80 bg-surface p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)] sm:p-8">
                            <LoginForm />
                        </div>

                        <LoginFooter />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
