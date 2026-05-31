import {
    TbShieldCheck,
    TbUsers,
    TbBoltFilled,
} from 'react-icons/tb';

const stats = [
    {
        icon: TbShieldCheck,
        label: 'Verified Needs',
        bg: 'bg-gradient-to-r from-emerald-500/10 to-emerald-100/10',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-600',
    },
    {
        icon: TbUsers,
        label: 'Trusted Community',
        bg: 'bg-gradient-to-r from-amber-500/10 to-amber-100/10',
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-500',
    },
    {
        icon: TbBoltFilled,
        label: 'Faster Impact',
        bg: 'bg-gradient-to-r from-sky-500/10 to-sky-100/10',
        iconBg: 'bg-sky-500/10',
        iconColor: 'text-sky-500',
    },
];

export default stats;