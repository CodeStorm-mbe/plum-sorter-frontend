import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Stats from '../components/home/Stats';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24"
        >
            <Hero />
            <HowItWorks />
            <Stats />
        </motion.div>
    );
};

export default HomePage;
