import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../../components/common/Button';
import navLinks from '../../data/navLinks';
import logo from '../../assets/images/shared/logo.png';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav
            aria-label="Main Navigation"
            className={`sticky top-0 z-50 transition-all duration-300 ease-in-out && ${scrolled ? 'h-22 bg-[#EDF4F7]/60 backdrop-blur border-b border-primary/20 shadow-sm' : 'h-28 bg-[#FCFBFD] lg:bg-[#F4F8F9] border-transparent'}`}
        >
            <div className="container-wrapper flex justify-between items-center h-full">
                {/* Menu */}
                <ul className="text-right flex justify-center items-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md transition-all duration-300 hover:text-primary-hover hover:bg-primary/10 ${
                                        isActive
                                            ? 'text-primary font-semibold'
                                            : 'text-text-primary'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Logo */}
                <Link to="/">
                    <img
                        src={logo}
                        alt="CareLink logo"
                        className={`transition-all duration-300 ${
                            scrolled ? 'h-16' : 'h-18'
                        }`}
                    />
                </Link>

                {/* CTA */}
                <div className="cta-buttons flex items-center gap-4">
                    <Button>Donate Now</Button>
                    <Button variant="outline">Login</Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
