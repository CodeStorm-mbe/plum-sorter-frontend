"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import { Calendar, Download, BarChart2, PieChart, Clock, Database } from "lucide-react"
import AccuracyChart from "../components/AccuracyChart"
import CategoryDistribution from "../components/CategoryDistribution"
import RecentImagesTable from "../components/RecentImagesTable"
import Button from "../components/Button"
import AnimatedCard from "../components/AnimatedCard"
import PageTransition from "../components/PageTransition"

const DashboardPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [dateRange, setDateRange] = useState("week")

  // Données fictives pour les graphiques
  const accuracyData = [
    { name: "Lun", accuracy: 92 },
    { name: "Mar", accuracy: 94 },
    { name: "Mer", accuracy: 93 },
    { name: "Jeu", accuracy: 95 },
    { name: "Ven", accuracy: 97 },
    { name: "Sam", accuracy: 96 },
    { name: "Dim", accuracy: 98 },
  ]

  const categoryData = [
    { name: "Bonne qualité", value: 45, color: "#05ffa1" },
    { name: "Non mûre", value: 20, color: "#ffe202" },
    { name: "Tachetée", value: 15, color: "#ff9e00" },
    { name: "Fissurée", value: 10, color: "#ff2a6d" },
    { name: "Meurtrie", value: 7, color: "#b537f2" },
    { name: "Pourrie", value: 3, color: "#ff3860" },
  ]

  const recentImages = [
    {
      id: 1,
      thumbnail: "https://via.placeholder.com/80x80?text=Prune+1",
      category: "Bonne qualité",
      confidence: 98,
      date: "10/04/2025",
    },
    {
      id: 2,
      thumbnail: "https://via.placeholder.com/80x80?text=Prune+2",
      category: "Non mûre",
      confidence: 95,
      date: "10/04/2025",
    },
    {
      id: 3,
      thumbnail: "https://via.placeholder.com/80x80?text=Prune+3",
      category: "Tachetée",
      confidence: 92,
      date: "09/04/2025",
    },
    {
      id: 4,
      thumbnail: "https://via.placeholder.com/80x80?text=Prune+4",
      category: "Fissurée",
      confidence: 97,
      date: "09/04/2025",
    },
    {
      id: 5,
      thumbnail: "https://via.placeholder.com/80x80?text=Prune+5",
      category: "Meurtrie",
      confidence: 91,
      date: "08/04/2025",
    },
    {
      id: 6,
      thumbnail: "https://via.placeholder.com/80x80?text=Prune+6",
      category: "Pourrie",
      confidence: 99,
      date: "08/04/2025",
    },
  ]

  return (
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />

          <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
            <motion.div
                className="flex flex-col md:flex-row items-center justify-between mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-title font-bold mb-4 md:mb-0 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Dashboard
              </h1>

              <div className="flex flex-wrap gap-4">
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <select
                      className="bg-background-light/50 border border-white/10 text-white rounded-md px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="day">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-primary pointer-events-none" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button variant="outline" icon={<Download className="h-4 w-4 mr-2" />} size="md">
                    Exporter
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  title: "Images analysées",
                  value: "1,248",
                  icon: <Database className="h-5 w-5" />,
                  color: "from-accent-primary to-accent-secondary",
                },
                {
                  title: "Précision moyenne",
                  value: "97.8%",
                  icon: <BarChart2 className="h-5 w-5" />,
                  color: "from-accent-secondary to-accent-tertiary",
                },
                {
                  title: "Temps moyen",
                  value: "0.8s",
                  icon: <Clock className="h-5 w-5" />,
                  color: "from-accent-tertiary to-accent-primary",
                },
                {
                  title: "Catégories",
                  value: "6",
                  icon: <PieChart className="h-5 w-5" />,
                  color: "from-accent-primary to-accent-secondary",
                },
              ].map((stat, index) => (
                  <motion.div
                      key={index}
                      className="card p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white/60 text-sm">{stat.title}</p>
                        <h3
                            className={`text-2xl font-bold mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        >
                          {stat.value}
                        </h3>
                      </div>
                      <div className="p-2 rounded-full bg-background-light/50">
                        <div className="text-accent-primary">{stat.icon}</div>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <AnimatedCard delay={0.1}>
                <div className="flex items-center mb-4">
                  <BarChart2 className="h-5 w-5 text-accent-primary mr-2" />
                  <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Évolution de la précision
                  </h2>
                </div>
                <AccuracyChart data={accuracyData} />
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <div className="flex items-center mb-4">
                  <PieChart className="h-5 w-5 text-accent-secondary mr-2" />
                  <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Répartition par catégorie
                  </h2>
                </div>
                <CategoryDistribution data={categoryData} />
              </AnimatedCard>
            </div>

            {/* Tableau des dernières images */}
            <AnimatedCard delay={0.3}>
              <div className="flex items-center mb-6">
                <Database className="h-5 w-5 text-accent-tertiary mr-2" />
                <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Dernières images traitées
                </h2>
              </div>

              <RecentImagesTable images={recentImages} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </AnimatedCard>
          </div>

          {/* Footer */}
          <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
            <div className="container mx-auto text-center">
              <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
            </div>
          </footer>
        </div>
      </PageTransition>
  )
}

export default DashboardPage
