// src/pages/Auth/Login/Login.jsx

import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';
import logo from '@/assets/shared/footerLogo.png';

const Login = () => {
    return (
        <section className="min-h-screen bg-background">
            <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
                {/* Left */}
                <div className="relative hidden overflow-hidden lg:flex">
                    {/* Background */}
                    <div className="absolute inset-0 bg-[#0d6b63]" />

                    {/* Soft Ambient Light */}
                    <div className="absolute -top-48 -right-32 h-130 w-130 rounded-full bg-white/10 blur-[140px]" />
                    <div className="absolute -bottom-52 -left-32 h-120 w-120 rounded-full bg-black/15 blur-[160px]" />

                    {/* Subtle Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
            `,
                            backgroundSize: '44px 44px',
                        }}
                    />

                    {/* Decorative Circle */}
                    <div className="absolute -right-24 bottom-20 flex h-85 w-85 items-center justify-center rounded-full border border-white/10">
                        <div className="flex h-65 w-65 items-center justify-center rounded-full border border-white/10">
                            <div className="flex h-45 w-45 items-center justify-center rounded-full border border-white/10">
                                <div className="h-3 w-3 rounded-full bg-white/70" />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex h-full w-full flex-col px-16 py-14 text-white">
                        <div className='flex-1'>
                            {/* Brand */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={logo}
                                    alt="Stand For People"
                                    className="h-14 w-14 rounded-xl bg-white p-2"
                                />

                                <div>
                                    <h1 className="font-fraunces text-[30px] leading-none">
                                        Stand For People
                                    </h1>

                                    <p className="mt-1 text-sm text-white/70">
                                        Helping people. Building stronger
                                        communities.
                                    </p>
                                </div>
                            </div>

                            {/* Hero */}
                            <div className="mt-16">
                                <div className="max-w-lg">
                                    <span className="inline-flex rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
                                        Welcome Back
                                    </span>

                                    <h2 className="mt-8 font-fraunces text-[50px] leading-16 tracking-wider">
                                        Continue helping
                                        <br />
                                        people in need.
                                    </h2>

                                    <p className="mt-7 text-lg leading-8 text-white/75">
                                        Sign in to manage your donations,
                                        volunteer activities, and community
                                        requests in one trusted place.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="my-10 h-px w-20 bg-white/15" />

                                <p className="font-fraunces text-4xl">
                                    12,800+
                                </p>

                                <p className="mt-2 text-sm text-white/65">
                                    People supported through verified campaigns.
                                </p>
                            </div>

                            <div className="text-right text-xs uppercase tracking-[0.25em] text-white/40">
                                Since 2026
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center justify-center px-8 py-10 lg:px-20">
                    <div className="w-full max-w-md">
                        <LoginHeader />

                        <div className="mt-8 rounded-4xl border border-border/70 bg-surface p-8 shadow-sm/10">
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
