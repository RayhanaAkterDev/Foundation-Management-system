import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: 'easeOut',
            }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className="
                group
                relative
                cursor-pointer
                rounded-2xl
                border
                border-border
                bg-surface
                p-5
                transition-all
                duration-300
                hover:border-primary/20
                hover:shadow-[0_12px_30px_-12px_rgba(15,23,42,0.15)]
                sm:p-6
                lg:p-7
            "
        >
            {/* Top */}
            <div className="flex items-start justify-between gap-4">
                <div
                    className={`
                        flex
                        h-12
                        w-12
                        shrink-0
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
                    <Icon className="h-6 w-6" strokeWidth={2} />
                </div>

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                        ${
                            isPrimary
                                ? 'bg-primary/8 text-primary group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white'
                                : 'bg-accent/10 text-accent group-hover:translate-x-1 group-hover:bg-accent group-hover:text-white'
                        }
                    `}
                >
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>

            {/* Title */}
            <h2 className="mt-5 font-fraunces text-2xl font-semibold text-text-primary sm:text-3xl">
                {title}
            </h2>

            {/* Audience */}
            <p className="mt-2 font-jost text-sm text-text-secondary">
                {audience}
            </p>

            {/* Description */}
            <p className="mt-5 font-jost text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                {description}
            </p>

            {/* Features */}
            <div className="mt-6 border-t border-border pt-5">
                <p className="font-poppins text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                    You can
                </p>

                <ul className="mt-3 space-y-2.5">
                    {features.slice(0, 4).map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                            <CheckCircle2
                                className={`
                                    mt-0.5
                                    h-4
                                    w-4
                                    shrink-0
                                    ${
                                        isPrimary
                                            ? 'text-primary'
                                            : 'text-accent'
                                    }
                                `}
                            />

                            <span className="font-jost text-sm leading-5 text-text-primary">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA */}
            <div
                className={`
                    mt-6
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    transition-colors
                    duration-300
                    ${
                        isPrimary
                            ? 'bg-primary/5 group-hover:bg-primary/10'
                            : 'bg-accent/5 group-hover:bg-accent/10'
                    }
                `}
            >
                <span className="font-jost text-sm font-semibold text-text-primary">
                    {buttonText}
                </span>

                <span
                    className={`
                        font-jost
                        text-xs
                        font-medium
                        ${isPrimary ? 'text-primary' : 'text-accent'}
                    `}
                >
                    Continue
                </span>
            </div>
        </motion.article>
    );
};

export default AccountCard;
