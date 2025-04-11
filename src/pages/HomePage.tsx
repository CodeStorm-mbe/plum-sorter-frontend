"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import { ArrowRight, Upload, BarChart2, Info, Zap, Cpu, Brain } from "lucide-react"
import PageTransition from "../components/PageTransition"

const HomePage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />

          {/* Hero Section */}
          <motion.section
              className="pt-28 pb-16 px-4 md:px-8 lg:px-16 container mx-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div className="md:w-1/2" variants={itemVariants}>
                <motion.div
                    className="mb-2 inline-block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                <span className="bg-accent-primary/20 text-accent-primary px-3 py-1 rounded-full text-sm font-medium">
                  IA Avancée
                </span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold leading-tight mb-4">
                  <motion.span
                      className="block bg-gradient-to-r from-accent-primary via-white to-accent-secondary bg-clip-text text-transparent pb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.7 }}
                  >
                    Tri automatique
                  </motion.span>
                  <motion.span
                      className="block text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.7 }}
                  >
                    des prunes
                  </motion.span>
                </h1>

                <motion.p
                    className="text-lg md:text-xl text-white/80 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                >
                  Une solution innovante utilisant l'intelligence artificielle pour classifier les prunes en six
                  catégories distinctes avec une précision exceptionnelle.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Link to="/prediction">
                    <Button variant="primary" icon={<ArrowRight className="ml-2 h-5 w-5" />} withGlow>
                      Tester maintenant
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                  className="md:w-1/2 flex justify-center"
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative w-full max-w-md">
                  {/* Animated background elements */}
                  <motion.div
                      className="absolute inset-0 rounded-full blur-[100px] bg-accent-primary/30"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />

                  <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-accent-primary/30"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.1, 0.3],
                        rotate: 360,
                      }}
                      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />

                  <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-accent-secondary/20"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.1, 0.2],
                        rotate: -360,
                      }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />

                  <motion.img
                      src="/plum-3d.png"
                      alt="Illustration 3D de prune"
                      className="relative z-10 w-full h-auto floating"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "https://via.placeholder.com/500x500?text=Prune+3D"
                      }}
                      animate={{
                        rotateY: [0, 10, 0, -10, 0],
                        rotateX: [0, 5, 0, -5, 0],
                      }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />

                  {/* Scanning effect */}
                  <motion.div
                      className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-accent-primary/20 to-transparent"
                      animate={{
                        top: ["-100%", "100%", "-100%"],
                      }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear", repeatDelay: 1 }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* How it works section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-background-light/30 backdrop-blur-sm relative overflow-hidden">
            <div className="cyber-grid absolute inset-0 opacity-10" />

            <div className="container mx-auto relative z-10">
              <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-title font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                  Comment ça marche
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Notre système utilise des algorithmes avancés de vision par ordinateur pour analyser et classifier les
                  prunes avec une grande précision.
                </p>

                <div className="futuristic-divider max-w-xs mx-auto my-8" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Upload className="h-10 w-10 text-accent-primary" />,
                    title: "Upload",
                    description: "Téléchargez simplement une image de prune via notre interface intuitive.",
                  },
                  {
                    icon: <Cpu className="h-10 w-10 text-accent-secondary" />,
                    title: "Analyse IA",
                    description: "Notre modèle d'IA analyse l'image et détermine la catégorie de la prune.",
                  },
                  {
                    icon: <Zap className="h-10 w-10 text-accent-tertiary" />,
                    title: "Résultat",
                    description:
                        "Obtenez instantanément le résultat avec le score de confiance et une explication visuelle.",
                  },
                ].map((step, index) => (
                    <motion.div
                        key={index}
                        className="card flex flex-col items-center text-center p-6 h-full"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        whileHover={{
                          y: -5,
                          boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)",
                        }}
                    >
                      <motion.div
                          className="mb-4 p-4 bg-background-light/50 rounded-full relative"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                      >
                        {step.icon}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                              boxShadow: [
                                "0 0 0 rgba(var(--accent-primary-rgb), 0.4)",
                                "0 0 10px rgba(var(--accent-primary-rgb), 0.6)",
                                "0 0 0 rgba(var(--accent-primary-rgb), 0.4)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      </motion.div>

                      <h3 className="text-xl font-title font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        {step.title}
                      </h3>

                      <p className="text-white/80">{step.description}</p>
                    </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
              {[
                { label: "Images traitées", value: "10,000+", icon: <Brain className="h-6 w-6" /> },
                { label: "Précision globale", value: "97.8%", icon: <BarChart2 className="h-6 w-6" /> },
                { label: "Catégories", value: "6", icon: <Info className="h-6 w-6" /> },
                { label: "Temps de traitement", value: "<1s", icon: <Zap className="h-6 w-6" /> },
              ].map((stat, index) => (
                  <motion.div
                      key={index}
                      className="card text-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)",
                      }}
                  >
                    <motion.div
                        className="mx-auto mb-3 p-3 rounded-full bg-background-light/50 inline-block"
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(var(--accent-primary-rgb), 0.4)",
                            "0 0 10px rgba(var(--accent-primary-rgb), 0.6)",
                            "0 0 0 rgba(var(--accent-primary-rgb), 0.4)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                    >
                      <div className="text-accent-primary">{stat.icon}</div>
                    </motion.div>

                    <h3 className="text-4xl font-title font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </h3>

                    <p className="text-white/80">{stat.label}</p>
                  </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
            <div className="container mx-auto text-center">
              <motion.div className="inline-block mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <div className="p-2 rounded-full bg-background-light inline-block">
                  <Brain className="h-6 w-6 text-accent-primary" />
                </div>
              </motion.div>
              <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
            </div>
          </footer>
        </div>
      </PageTransition>
  )
}

export default HomePage
