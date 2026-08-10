import { motion } from 'framer-motion';
import { ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { accountData as accounts } from './accountData';

const AccountSelection = () => {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-[#eef3f6] px-4 py-12 sm:py-16 lg:py-20 mt-20">
            <div className="mx-auto w-full max-w-5xl">
                {/* Branding */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                            <HeartHandshake className="h-5 w-5" />
                        </div>

                        <span className="font-fraunces text-xl font-semibold text-text-primary">
                            Stand For People
                        </span>
                    </div>

                    <p className="mt-2 font-jost text-sm text-text-secondary">
                        Helping people. Building stronger communities.
                    </p>
                </motion.div>

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    className="mx-auto mt-14 max-w-2xl text-center sm:mt-16"
                >
                    <h1 className="font-fraunces text-3xl font-semibold text-text-primary sm:text-4xl">
                        Choose your account
                    </h1>

                    <p className="mt-4 font-jost text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
                        Select the account that best represents how you will use
                        Stand For People.
                    </p>
                </motion.div>

                {/* Account Options */}
                <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
                    {accounts.map((account, index) => {
                        const Icon = account.icon;
                        const isPrimary = account.color === 'primary';

                        return (
                            <motion.button
                                key={account.id}
                                type="button"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.45,
                                    delay: 0.15 + index * 0.1,
                                }}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => navigate(account.path)}
                                className="
                                    group
                                    text-left
                                    rounded-2xl
                                    border
                                    border-border
                                    bg-surface
                                    p-6
                                    text-text-primary
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:border-primary/20
                                    hover:shadow-md
                                    sm:p-7
                                "
                            >
                                {/* Icon + Arrow */}
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-xl
                                            ${
                                                isPrimary
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-accent/10 text-accent'
                                            }
                                        `}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <ArrowRight
                                        className={`
                                            h-5
                                            w-5
                                            transition-all
                                            duration-300
                                            group-hover:translate-x-1
                                            ${
                                                isPrimary
                                                    ? 'text-primary'
                                                    : 'text-accent'
                                            }
                                        `}
                                    />
                                </div>

                                {/* Content */}
                                <h2 className="mt-6 font-fraunces text-2xl font-semibold sm:text-3xl">
                                    {account.title}
                                </h2>

                                <p className="mt-3 font-jost text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                                    {account.description}
                                </p>

                                {/* Small action */}
                                <div
                                    className={`
                                        mt-7
                                        font-jost
                                        text-sm
                                        font-semibold
                                        ${
                                            isPrimary
                                                ? 'text-primary'
                                                : 'text-accent'
                                        }
                                    `}
                                >
                                    {account.buttonText}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Small reassurance */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center"
                >
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />

                    <p className="font-jost text-xs text-text-secondary sm:text-sm">
                        Your account information is kept secure and protected.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default AccountSelection;
