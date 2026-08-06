import { motion } from 'framer-motion';
import {
    HeartHandshake,
    ShieldCheck,
    BadgeCheck,
    LockKeyhole,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { accountData as accounts } from './accountData';
import AccountCard from './AccountCard';

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 32,
    },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            delay,
            ease: 'easeOut',
        },
    }),
};

const trustItems = [
    {
        icon: ShieldCheck,
        title: 'Verified Platform',
        description: 'Secure identity & trusted access',
    },
    {
        icon: BadgeCheck,
        title: 'Trusted Organizations',
        description: 'Verified NGOs and community partners',
    },
    {
        icon: LockKeyhole,
        title: 'Secure Accounts',
        description: 'Protected login & personal information',
    },
];

const AccountSelection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen overflow-hidden bg-background py-14 sm:py-16 lg:py-24 xl:py-28 mt-20">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl sm:h-130 sm:w-130 lg:h-162.5 lg:w-162.5" />

                <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl sm:-left-28 sm:h-72 sm:w-72" />

                <div className="absolute -right-20 top-1/3 h-52 w-52 rounded-full bg-accent/10 blur-3xl sm:-right-28 sm:h-64 sm:w-64 lg:h-80 lg:w-80" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.45),transparent_65%)]" />
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="mx-auto max-w-5xl text-center"
                >
                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary sm:px-5 sm:py-2.5 sm:text-sm">
                        <HeartHandshake
                            size={16}
                            className="shrink-0 sm:h-4.5 sm:w-4.5"
                        />

                        <span className="truncate font-jost">
                            Welcome to Stand For People
                        </span>
                    </div>

                    <h1 className="mt-7 font-fraunces text-4xl font-bold leading-[1.1] text-text-primary sm:mt-8 sm:text-5xl lg:text-6xl xl:text-7xl">
                        Choose how you'll
                        <span className="mt-2 block text-primary">
                            make an impact
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl font-jost text-base leading-7 text-text-secondary sm:text-lg sm:leading-8 lg:mt-7 lg:text-xl lg:leading-9">
                        Whether you're seeking support, donating to meaningful
                        causes, volunteering your time, or representing an
                        organization, we'll personalize your experience based on
                        the account you choose.
                    </p>
                </motion.div>

                {/* Trust Row */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.15}
                    variants={fadeUp}
                    className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5"
                >
                    {trustItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.25 }}
                                className="
                                    group
                                    flex
                                    items-start
                                    gap-4
                                    rounded-2xl
                                    border
                                    border-border/80
                                    bg-surface/80
                                    p-4
                                    backdrop-blur-sm
                                    transition-all
                                    duration-300
                                    hover:border-primary/15
                                    hover:shadow-lg
                                    sm:p-5
                                "
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                                    <Icon
                                        size={20}
                                        className="sm:h-[5.5px] sm:w-[5.5px]"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-poppins text-sm font-semibold text-text-primary">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 font-jost text-sm leading-6 text-text-secondary">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.25}
                    variants={fadeUp}
                    className="
                        mx-auto
                        mt-12
                        grid
                        max-w-7xl
                        grid-cols-1
                        gap-6
                        lg:mt-16
                        lg:grid-cols-2
                        lg:gap-8
                    "
                >
                    {accounts.map((account, index) => (
                        <AccountCard
                            key={account.id}
                            {...account}
                            delay={index * 0.12}
                            onClick={() => navigate(account.path)}
                        />
                    ))}
                </motion.div>

                {/* Bottom Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.45,
                    }}
                    className="
                        mx-auto
                        mt-12
                        max-w-5xl
                        rounded-3xl
                        border
                        border-primary/10
                        bg-linear-to-r
                        from-primary/5
                        via-primary/3
                        to-transparent
                        p-5
                        backdrop-blur-sm
                        sm:mt-14
                        sm:rounded-[28px]
                        sm:p-7
                    "
                >
                    <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-14 sm:w-14">
                            <ShieldCheck size={24} className="sm:h-7 sm:w-7" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-poppins text-base font-semibold text-text-primary sm:text-lg">
                                Your account determines your experience
                            </h3>

                            <p className="mt-3 font-jost text-[15px] leading-7 text-text-secondary sm:text-base sm:leading-8">
                                Individuals can request assistance, donate,
                                volunteer, and manage all of their activities
                                from one personalized dashboard. Organizations
                                gain access to campaign management, request
                                verification, volunteer coordination, impact
                                reporting, and administrative tools designed to
                                maximize community impact. Choose the account
                                that best represents how you'll use the
                                platform.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AccountSelection;
