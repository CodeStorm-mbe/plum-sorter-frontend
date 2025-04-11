import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-accent-emerald hover:bg-accent-emerald/80 text-white',
        secondary: 'bg-accent-gold hover:bg-accent-gold/80 text-primary-dark',
        outline: 'bg-transparent border border-accent-emerald text-accent-emerald hover:bg-accent-emerald/10',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-title font-medium transition-colors duration-300 ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
