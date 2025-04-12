"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import LoginForm from "../components/auth/LoginForm"
import PageTransition from "../components/PageTransition"

// Importer le hook useLanguage
import { useLanguage } from "../contexts/LanguageContext"

// Ajouter l'utilisation du hook dans le composant LoginPage
const LoginPage: React.FC = () => {
    const { t } = useLanguage()

    return (
        <PageTransition>
            <div className="min-h-screen">
                <Navbar />

                <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
                    <motion.div
                        className="flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h1
                            className="text-3xl md:text-4xl font-title font-bold text-center mb-2"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                {t("auth.login.title")}
              </span>
                        </motion.h1>

                        <motion.p
                            className="text-center text-white/70 mb-8 max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {t("auth.login.subtitle")}
                        </motion.p>

                        <LoginForm />
                    </motion.div>
                </div>

                {/* Footer */}
                <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
                    <div className="container mx-auto text-center">
                        <p className="text-white/60">{t("footer.copyright")}</p>
                    </div>
                </footer>
            </div>
        </PageTransition>
    )
}

export default LoginPage
