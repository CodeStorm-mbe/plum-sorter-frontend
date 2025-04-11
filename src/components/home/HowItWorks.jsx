import { motion } from 'framer-motion';
import { FaUpload, FaCog, FaCheckCircle } from 'react-icons/fa';

const steps = [
    {
        title: 'Upload',
        description: 'Téléchargez une image de prune à analyser',
        icon: <FaUpload className="text-4xl text-accent-gold" />,
    },
    {
        title: 'Prédiction',
        description: 'Notre IA analyse l\'image avec précision',
        icon: <FaCog className="text-4xl text-accent-gold" />,
    },
    {
        title: 'Résultat',
        description: 'Obtenez la classification détaillée de votre prune',
        icon: <FaCheckCircle className="text-4xl text-accent-gold" />,
    },
];

const HowItWorks = () => {
    return (
        <section className="py-16">
            <h2 className="font-title text-3xl font-bold text-center mb-12">
                Comment Ça <span className="text-accent-emerald">Fonctionne</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className="bg-background-card rounded-xl p-8 text-center"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex justify-center mb-6">
                            {step.icon}
                        </div>
                        <h3 className="font-title text-xl text-accent-emerald mb-2">{step.title}</h3>
                        <p className="text-gray-300">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
