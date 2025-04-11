import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AccuracyChart from '../components/dashboard/AccuracyChart';
import CategoryDistribution from '../components/dashboard/CategoryDistribution';
import RecentImages from '../components/dashboard/RecentImages';

const DashboardPage = () => {
    const [dateFilter, setDateFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    // Simulate data loading
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24"
        >
            <h1 className="font-title text-3xl md:text-4xl font-bold text-center mb-8">
                Tableau de <span className="text-accent-emerald">Bord</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-background-card rounded-xl p-6">
                    <h2 className="font-title text-xl mb-4">Évolution de la Précision</h2>
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-emerald"></div>
                        </div>
                    ) : (
                        <AccuracyChart />
                    )}
                </div>

                <div className="bg-background-card rounded-xl p-6">
                    <h2 className="font-title text-xl mb-4">Distribution par Catégorie</h2>
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-emerald"></div>
                        </div>
                    ) : (
                        <CategoryDistribution />
                    )}
                </div>
            </div>

            <div className="bg-background-card rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="font-title text-xl mb-2 sm:mb-0">Images Récentes</h2>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-background-dark border border-gray-700 rounded-lg px-3 py-1 text-sm"
                        >
                            <option value="all">Toutes les dates</option>
                            <option value="today">Aujourd'hui</option>
                            <option value="week">Cette semaine</option>
                            <option value="month">Ce mois</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-background-dark border border-gray-700 rounded-lg px-3 py-1 text-sm"
                        >
                            <option value="all">Toutes les catégories</option>
                            <option value="good">Bonne Qualité</option>
                            <option value="unripe">Non Mûre</option>
                            <option value="spotted">Tachetée</option>
                            <option value="cracked">Fissurée</option>
                            <option value="bruised">Meurtrie</option>
                            <option value="rotten">Pourrie</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-emerald"></div>
                    </div>
                ) : (
                    <RecentImages dateFilter={dateFilter} categoryFilter={categoryFilter} />
                )}
            </div>
        </motion.div>
    );
};

export default DashboardPage;
