import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const AccountCard = ({
    icon: Icon,
    title,
    description,
    features,
    audience,
    buttonText,
    color = 'primary',
    onClick,
    delay = 0,
}) => {
    const isPrimary = color === 'primary';

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                ease: 'easeOut',
            }}
            whileHover={{
                y: -8,
            }}
            onClick={onClick}
            className="
                group
                relative
                cursor-pointer
                overflow-hidden
                rounded-[28px]
                sm:rounded-4xl
                lg:rounded-[36px]
                border
                border-border
                bg-surface
                transition-all
                duration-500
                hover:border-primary/20
                hover:shadow-[0_25px_60px_rgba(15,118,110,.10)]
            "
        >
            {/* Hover Overlay */}
            <div
                className={`
                    absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100
                    ${
                        isPrimary
                            ? 'bg-linear-to-br from-primary/5 via-transparent to-primary/2'
                            : 'bg-linear-to-br from-accent/10 via-transparent to-accent/5'
                    }
                `}
            />

            {/* Glow */}
            <div
                className={`
                    absolute -right-24 -top-24 h-56 w-56 sm:h-72 sm:w-72 rounded-full blur-3xl transition-all duration-500
                    ${
                        isPrimary
                            ? 'bg-primary/10 group-hover:bg-primary/15'
                            : 'bg-accent/15 group-hover:bg-accent/20'
                    }
                `}
            />

            <div className="relative flex h-full flex-col p-5 sm:p-7 lg:p-9 xl:p-10">
                {/* Top */}
                <div className="flex items-center justify-between gap-4">
                    <div
                        className={`
                            inline-flex items-center gap-2 rounded-full px-3 py-2 sm:px-4
                            text-xs sm:text-sm font-medium
                            ${
                                isPrimary
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-accent/15 text-accent'
                            }
                        `}
                    >
                        <Sparkles size={15} />
                        Account Type
                    </div>

                    <ArrowRight
                        size={20}
                        className="
                            hidden sm:block
                            opacity-0
                            -translate-x-2
                            transition-all
                            duration-300
                            group-hover:opacity-100
                            group-hover:translate-x-0
                        "
                    />
                </div>

                {/* Icon */}
                <div className="relative mt-8 sm:mt-10">
                    <div
                        className={`
                            absolute inset-0
                            h-20 w-20
                            sm:h-24 sm:w-24
                            rounded-full
                            blur-2xl
                            ${isPrimary ? 'bg-primary/15' : 'bg-accent/20'}
                        `}
                    />

                    <motion.div
                        whileHover={{
                            rotate: -6,
                            scale: 1.05,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                        }}
                        className={`
                            relative
                            flex
                            h-20 w-20
                            sm:h-24 sm:w-24
                            items-center
                            justify-center
                            rounded-3xl
                            sm:rounded-[30px]
                            ${
                                isPrimary
                                    ? 'bg-linear-to-br from-primary/15 to-primary/5 text-primary'
                                    : 'bg-linear-to-br from-accent/20 to-accent/5 text-accent'
                            }
                        `}
                    >
                        <Icon size={34} className="sm:hidden" strokeWidth={2} />

                        <Icon
                            size={42}
                            className="hidden sm:block"
                            strokeWidth={2}
                        />
                    </motion.div>
                </div>

                {/* Title */}
                <h2 className="mt-8 sm:mt-10 font-fraunces text-3xl sm:text-4xl leading-tight text-text-primary">
                    {title}
                </h2>

                {/* Audience */}
                <div className="mt-6 sm:mt-7 rounded-2xl border border-border bg-background p-4 sm:p-5">
                    <span className="font-poppins text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                        Best For
                    </span>

                    <p className="mt-2 font-jost text-base sm:text-lg leading-7 text-text-primary">
                        {audience}
                    </p>
                </div>

                {/* Description */}
                <p className="mt-6 sm:mt-7 font-jost text-base sm:text-[17px] leading-7 sm:leading-8 text-text-secondary">
                    {description}
                </p>

                {/* Divider */}
                <div className="my-7 sm:my-8 h-px bg-border" />

                {/* Features */}
                <div className="flex-1">
                    <h3 className="font-poppins text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
                        What you can do
                    </h3>

                    <ul className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
                        {features.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-start gap-3 sm:gap-4"
                            >
                                <div
                                    className={`
                                        mt-0.5
                                        flex
                                        h-6 w-6
                                        sm:h-7 sm:w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        ${
                                            isPrimary
                                                ? 'bg-primary/10'
                                                : 'bg-accent/15'
                                        }
                                    `}
                                >
                                    <CheckCircle2
                                        size={14}
                                        className={
                                            isPrimary
                                                ? 'text-primary'
                                                : 'text-accent'
                                        }
                                    />
                                </div>

                                <span className="font-jost text-[15px] sm:text-base leading-7 text-text-primary">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`
                        mt-8 sm:mt-10
                        flex flex-col gap-4
                        sm:flex-row sm:items-center sm:justify-between
                        rounded-2xl
                        border
                        px-5 py-5
                        sm:px-6
                        transition-all
                        duration-300
                        ${
                            isPrimary
                                ? 'border-primary/15 bg-primary/5 group-hover:border-primary/30 group-hover:bg-primary/10'
                                : 'border-accent/20 bg-accent/5 group-hover:border-accent/30 group-hover:bg-accent/10'
                        }
                    `}
                >
                    <div className="min-w-0">
                        <p className="font-poppins text-base sm:text-lg font-semibold text-text-primary">
                            {buttonText}
                        </p>

                        <p className="mt-1 font-jost text-sm leading-6 text-text-secondary">
                            Continue to sign in
                        </p>
                    </div>

                    <div
                        className={`
                            flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full transition-all duration-300
                            sm:self-auto
                            ${
                                isPrimary
                                    ? 'bg-primary text-white group-hover:translate-x-1'
                                    : 'bg-accent text-white group-hover:translate-x-1'
                            }
                        `}
                    >
                        <ArrowRight size={20} />
                    </div>
                </motion.div>
            </div>

            {/* Border Glow */}
            <div
                className={`
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[28px]
                    sm:rounded-4xl
                    lg:rounded-[36px]
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                    ${
                        isPrimary
                            ? 'ring-1 ring-primary/10'
                            : 'ring-1 ring-accent/15'
                    }
                `}
            />
        </motion.article>
    );
};

export default AccountCard;
