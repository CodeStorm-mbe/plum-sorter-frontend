import { motion } from 'framer-motion';
import Button from '../components/common/Button';

const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 max-w-4xl mx-auto"
        >
            <h1 className="font-title text-3xl md:text-4xl font-bold text-center mb-8">
                À <span className="text-accent-emerald">Propos</span>
            </h1>

            <div className="bg-background-card rounded-xl p-6 md:p-8 mb-8">
                <h2 className="font-title text-2xl mb-4">Le Projet Hackathon</h2>

                <p className="mb-4 text-gray-300">
                    Ce projet a été développé dans le cadre de la Journée Internationale de l'Intelligence Artificielle (JCIA), organisée au Cameroun du 22 au 24 avril 2025. Le hackathon s'inscrit dans le thème « Intelligence Artificielle et Développement Économique : Innover pour transformer ».
                </p>

                <p className="mb-4 text-gray-300">
                    L'objectif principal du projet est le tri automatique des prunes en six catégories distinctes (bonne qualité, non mûre, tachetée, fissurée, meurtrie et pourrie), en utilisant des techniques avancées de vision par ordinateur et d'apprentissage profond.
                </p>

                <h2 className="font-title text-2xl mt-8 mb-4">Méthodologie & Technologies</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="font-title text-xl text-accent-gold mb-2">Front-end</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            <li>React.js (JavaScript)</li>
                            <li>Framer Motion pour les animations</li>
                            <li>Tailwind CSS pour le styling</li>
                            <li>Chart.js pour les visualisations</li>
                            <li>React Dropzone pour l'upload d'images</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-title text-xl text-accent-gold mb-2">Back-end & IA</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            <li>API REST pour la communication</li>
                            <li>Architecture CNN pour la classification</li>
                            <li>Grad-CAM pour la visualisation explicative</li>
                            <li>Dataset African Plums de Kaggle</li>
                            <li>Prétraitement avancé des images</li>
                        </ul>
                    </div>
                </div>

                <h2 className="font-title text-2xl mt-8 mb-4">Notre équipe</h2>

                <p className="mb-6 text-gray-300">
                    Notre équipe est composée d'étudiants passionnés par l'intelligence artificielle et ses applications concrètes dans le développement économique.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {/* Placeholder team members - replace with actual team data */}
                    {[1, 2, 3, 4, 5].map((member) => (
                        <div key={member} className="text-center">
                            <div className="w-24 h-24 mx-auto bg-primary-light rounded-full mb-2"></div>
                            <h3 className="font-medium">Membre {member}</h3>
                            <p className="text-sm text-gray-400">Rôle</p>
                        </div>
                    ))}
                </div>

                <h2 className="font-title text-2xl mt-8 mb-4">Ressources</h2>

                <div className="flex flex-col md:flex-row gap-4">
                    <a
                        href="https://github.com/your-username/plum-sorter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                        <Button variant="outline">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                Code Source
                            </div>
                        </Button>
                    </a>

                    <a
                        href="https://www.kaggle.com/datasets/african-plums-dataset"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                        <Button variant="outline">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 9.52c-1.405 0-2.545 1.141-2.545 2.545 0 1.408 1.141 2.545 2.545 2.545 1.405 0 2.545-1.138 2.545-2.545s-1.14-2.545-2.545-2.545zm0-2.545c2.809 0 5.091 2.282 5.091 5.091s-2.282 5.091-5.091 5.091c-2.809 0-5.091-2.282-5.091-5.091s2.282-5.091 5.091-5.091zm0-2.545c-4.211 0-7.636 3.425-7.636 7.636s3.425 7.636 7.636 7.636 7.636-3.425 7.636-7.636-3.425-7.636-7.636-7.636zm0-2.546c5.618 0 10.182 4.564 10.182 10.182s-4.564 10.182-10.182 10.182-10.182-4.564-10.182-10.182 4.564-10.182 10.182-10.182z"/>
                                </svg>
                                Dataset Kaggle
                            </div>
                        </Button>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
