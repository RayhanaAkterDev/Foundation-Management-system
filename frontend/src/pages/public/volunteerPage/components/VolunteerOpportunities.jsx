import { TbArrowRight, TbClock, TbMapPin } from 'react-icons/tb';

const roles = [
    {
        title: 'Field Support Volunteer',
        location: 'Dhaka',
        time: 'Flexible',
        desc: 'Help distribute food, medicine and emergency aid.',
    },
    {
        title: 'Remote Coordinator',
        location: 'Remote',
        time: '2-3 hrs/day',
        desc: 'Coordinate requests and field operations.',
    },
    {
        title: 'Medical Support Assistant',
        location: 'Khulna',
        time: 'Part Time',
        desc: 'Support medical logistics and healthcare teams.',
    },
];

const VolunteerOpportunities = () => {
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-10">Open Opportunities</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role) => (
                    <div
                        key={role.title}
                        className="group p-6 rounded-2xl border border-border hover:border-primary transition bg-white/40 backdrop-blur hover:-translate-y-1"
                    >
                        <h3 className="text-lg font-semibold">{role.title}</h3>

                        <p className="text-text-secondary mt-2 text-sm">
                            {role.desc}
                        </p>

                        <div className="flex gap-4 mt-4 text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                                <TbMapPin />
                                {role.location}
                            </span>

                            <span className="flex items-center gap-1">
                                <TbClock />
                                {role.time}
                            </span>
                        </div>

                        <button className="mt-5 inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition">
                            Apply Now
                            <TbArrowRight />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VolunteerOpportunities;
