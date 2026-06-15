import { Users, HeartHandshake, HandHelping, ShieldCheck } from 'lucide-react';

const roles = [
    {
        label: 'Requester',
        icon: HeartHandshake,
        title: 'Request Source',
        desc: 'Submits assistance requests based on real-world needs and emergencies.',
        action: 'Generates structured aid requests',
    },
    {
        label: 'Donor',
        icon: Users,
        title: 'Resource Provider',
        desc: 'Contributes funds or resources to verified and prioritized cases.',
        action: 'Supports verified requests',
    },
    {
        label: 'Volunteer',
        icon: HandHelping,
        title: 'Field Executor',
        desc: 'Responds to assigned tasks based on location and priority.',
        action: 'Delivers on-ground support',
    },
    {
        label: 'Admin',
        icon: ShieldCheck,
        title: 'System Guardian',
        desc: 'Maintains verification, trust integrity, and system moderation.',
        action: 'Controls verification and workflow integrity',
    },
];

export default roles;