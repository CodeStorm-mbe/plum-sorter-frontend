import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Stats = () => {
    // Normally these would come from your API
    const [stats, setStats] = useState({
        imagesProcessed: 0,
        accuracy: 0,
    });

    // Simulate loading stats
    useEffect(() => {
        setTimeout(() => {
            setStats({
                imagesProcessed: 5238,
                accuracy: 96.4,
            });
        }, 1000);
    }, []);

    return (
        <section className="py-16 bg-background-card rounded-xl">
            <h2 className="font-title text-3xl font-bold text-center mb-12">
                Nos <span className="text-accent-emerald">Statistiques</span>
            </h2>

            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                <motion.div
                    className="text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div className="font-title text-5xl text-accent-gold mb-2">
                        {stats.imagesProcessed.toLocaleString()}
                    </div>
                    <p className="text-gray-300">Images Analysées</p>
                </motion.div>

                <motion.div
                    className="text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="font-title text-5xl text-accent-gold mb-2">
                        {stats.accuracy}%
                    </div>
                    <p className="text-gray-300">Précision Globale</p>
                </motion.div>
            </div>
        </section>
    );
};

export default Stats;
