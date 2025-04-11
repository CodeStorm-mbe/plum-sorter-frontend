import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Accueil', path: '/' },
        { name: 'Prédiction', path: '/prediction' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'À Propos', path: '/about' },
    ];

    return (
        <header className="py-4 px-6 bg-background-dark bg-opacity-90 backdrop-blur-sm fixed w-full z-10">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="font-title text-2xl text-accent-gold">
                    PlumSort<span className="text-accent-emerald">AI</span>
                </Link>

                <ul className="hidden md:flex space-x-8">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className="relative font-body"
                            >
                                {item.name}
                                {location.pathname === item.path && (
                                    <motion.div
                                        layoutId="navIndicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-emerald"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                <button className="md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>
        </header>
    );
};

export default Navbar;
