import {
    TbFlameFilled,
    TbHeartFilled,
    TbHomeHeart,
    TbUsers,
    TbCalendarEvent,
    TbHeartHandshake,
} from 'react-icons/tb';

const statsData = [
    {
        id: 1,
        icon: TbHomeHeart,
        value: '430',
        label: 'Families Helped',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
    },
    {
        id: 2,
        icon: TbUsers,
        value: '120+',
        label: 'Volunteers',
        iconBg: 'bg-accent/15',
        iconColor: 'text-accent',
    },
    {
        id: 3,
        icon: TbCalendarEvent,
        value: '5',
        label: 'Days Left',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
    },
    {
        id: 4,
        icon: TbHeartHandshake,
        value: '72',
        label: 'Donors',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
    },
];

export default statsData;
