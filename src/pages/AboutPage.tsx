"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import { Github, ExternalLink, Code, Database, Award, Brain, Cpu, Zap } from "lucide-react"
import AnimatedCard from "../components/AnimatedCard"
import PageTransition from "../components/PageTransition"
import Button from "../components/Button"

const AboutPage: React.FC = () => {
  return (
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />

          <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
            <motion.h1
                className="text-3xl md:text-4xl font-title font-bold text-center mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              À propos du projet
            </span>
            </motion.h1>

            <motion.p
                className="text-center text-white/70 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
              Découvrez l'histoire et les détails techniques derrière notre solution innovante
            </motion.p>

            <div className="max-w-4xl mx-auto">
              <AnimatedCard delay={0.1}>
                <div className="flex items-center mb-4">
                  <Award className="h-5 w-5 text-accent-primary mr-2" />
                  <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Le Hackathon JCIA 2025
                  </h2>
                </div>

                <p className="text-white/80 mb-4">
                  Ce projet a été développé dans le cadre de la Journée Internationale de l'Intelligence Artificielle
                  (JCIA), organisée au Cameroun du 22 au 24 avril 2025. Le hackathon national est ouvert à tous les
                  étudiants passionnés d'intelligence artificielle et de machine learning.
                </p>

                <p className="text-white/80 mb-4">
                  L'événement s'inscrit dans le thème « Intelligence Artificielle et Développement Économique : Innover
                  pour transformer », avec pour objectif de mettre en avant des solutions innovantes capables de résoudre
                  des problématiques réelles.
                </p>

                <div className="flex items-center space-x-2 text-accent-primary">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Date limite de soumission : 17 avril 2025 à 23H</span>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.2} className="my-8">
                <div className="flex items-center mb-4">
                  <Brain className="h-5 w-5 text-accent-secondary mr-2" />
                  <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Le projet de tri automatique des prunes
                  </h2>
                </div>

                <p className="text-white/80 mb-4">
                  Le projet central de ce hackathon repose sur le tri automatique des prunes en six catégories (de bonne
                  qualité, non mûre, tachetée, fissurée, meurtrie et pourrie), à l'aide de techniques avancées de vision
                  par ordinateur et d'apprentissage profond.
                </p>

                <p className="text-white/80 mb-4">
                  Le défi principal consiste à concevoir un modèle d'intelligence artificielle atteignant la meilleure
                  précision (accuracy) possible pour la classification des images des prunes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <motion.div
                      className="card bg-background-light/30 p-4 h-full"
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)" }}
                  >
                    <h3 className="font-medium mb-4 flex items-center">
                      <Code className="h-5 w-5 mr-2 text-accent-primary" />
                      <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Technologies utilisées
                    </span>
                    </h3>

                    <ul className="space-y-3 text-white/80">
                      {[
                        "React avec TypeScript",
                        "Tailwind CSS pour le styling",
                        "Framer Motion pour les animations",
                        "Recharts pour les visualisations",
                        "React Router pour la navigation",
                      ].map((item, index) => (
                          <motion.li
                              key={index}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.1 * index }}
                          >
                            <span className="text-accent-primary mr-2">•</span>
                            <span>{item}</span>
                          </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                      className="card bg-background-light/30 p-4 h-full"
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)" }}
                  >
                    <h3 className="font-medium mb-4 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-accent-secondary" />
                      <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Données et modèle
                    </span>
                    </h3>

                    <ul className="space-y-3 text-white/80">
                      {[
                        "Dataset: African Plums Dataset (Kaggle)",
                        "Classification en 6 catégories",
                        "Techniques de vision par ordinateur",
                        "Apprentissage profond (CNN)",
                        "Visualisation Grad-CAM pour l'explicabilité",
                      ].map((item, index) => (
                          <motion.li
                              key={index}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.1 * index }}
                          >
                            <span className="text-accent-secondary mr-2">•</span>
                            <span>{item}</span>
                          </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.3}>
                <div className="flex items-center mb-4">
                  <ExternalLink className="h-5 w-5 text-accent-tertiary mr-2" />
                  <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Ressources et liens
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Code source",
                      description: "Accéder au repository GitHub du projet",
                      icon: <Github className="h-6 w-6 text-accent-primary" />,
                      url: "https://github.com/username/plum-sorter",
                    },
                    {
                      title: "Dataset",
                      description: "African Plums Dataset sur Kaggle",
                      icon: <Database className="h-6 w-6 text-accent-secondary" />,
                      url: "https://www.kaggle.com/datasets/african-plums",
                    },
                    {
                      title: "Formulaire d'inscription",
                      description: "S'inscrire au hackathon JCIA 2025",
                      icon: <Award className="h-6 w-6 text-accent-tertiary" />,
                      url: "https://forms.gle/Ufce6tWdij58V8Pi7",
                    },
                  ].map((link, index) => (
                      <motion.a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 card bg-background-light/30 hover:bg-background-light/50 transition-all duration-300"
                          whileHover={{
                            x: 5,
                            boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)",
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * index }}
                      >
                        <div className="mr-4">{link.icon}</div>
                        <div>
                          <h3 className="font-medium text-white">{link.title}</h3>
                          <p className="text-white/70 text-sm">{link.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-white/50" />
                      </motion.a>
                  ))}
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.4} className="mt-8">
                <div className="flex items-center mb-4">
                  <Cpu className="h-5 w-5 text-accent-primary mr-2" />
                  <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Contact et crédits
                  </h2>
                </div>

                <p className="text-white/80 mb-6">
                  Ce projet a été développé par l'équipe TriPrune pour le hackathon JCIA 2025. Pour toute question ou
                  suggestion, n'hésitez pas à nous contacter.
                </p>

                <div className="card bg-background-light/30 p-4">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-accent-secondary" />
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Équipe TriPrune
                  </span>
                  </h3>

                  <ul className="space-y-3 text-white/80">
                    {[
                      "Chef d'équipe: [Nom du chef d'équipe]",
                      "Développeur Frontend: [Nom du développeur frontend]",
                      "Développeur Backend: [Nom du développeur backend]",
                      "Data Scientist: [Nom du data scientist]",
                      "Designer UX/UI: [Nom du designer]",
                    ].map((member, index) => (
                        <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * index }}
                        >
                          <span className="text-accent-tertiary mr-2">•</span>
                          <span>{member}</span>
                        </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="primary" icon={<ExternalLink className="h-4 w-4 mr-2" />} withGlow>
                    Contacter l'équipe
                  </Button>
                </div>
              </AnimatedCard>
            </div>
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

export default AboutPage
