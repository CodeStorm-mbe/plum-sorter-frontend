import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
// import plumAnimation from '../../../public/assets/animations/plum-animation.json'; // You'll need to add this animation

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="flex flex-col md:flex-row items-center justify-between py-16">
            <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="font-title text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                    Tri <span className="text-accent-emerald">Automatique</span> des <span className="text-accent-gold">Prunes</span>
                </h1>

                <p className="text-gray-300 text-lg mb-8 max-w-lg">
                    Un système de classification intelligent utilisant l'intelligence artificielle pour catégoriser automatiquement les prunes en six catégories distinctes.
                </p>

                <Button onClick={() => navigate('/prediction')} variant="primary">
                    Tester Maintenant →
                </Button>
            </motion.div>

            {/*<motion.div*/}
            {/*    className="md:w-1/2 flex justify-center"*/}
            {/*    initial={{ x: 50, opacity: 0 }}*/}
            {/*    animate={{ x: 0, opacity: 1 }}*/}
            {/*    transition={{ duration: 0.5, delay: 0.2 }}*/}
            {/*>*/}
            {/*    <div className="w-80 h-80">*/}
            {/*        <Lottie animationData={plumAnimation} loop={true} />*/}
            {/*    </div>*/}
            {/*</motion.div>*/}
        </section>
    );
};

export default Hero;
