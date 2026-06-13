// sections/FinalCTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
    return (
        <section className="container-width text-center py-20">

            <h2 className="text-2xl font-semibold">
                Be part of the system that delivers real help
            </h2>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link className="btn-primary" to="/request">
                    Submit a Request
                </Link>

                <Link className="btn-outline" to="/volunteer">
                    Become a Volunteer
                </Link>

                <Link className="btn-ghost" to="/donate">
                    Support Verified Needs
                </Link>
            </div>

        </section>
    );
};

export default FinalCTA;