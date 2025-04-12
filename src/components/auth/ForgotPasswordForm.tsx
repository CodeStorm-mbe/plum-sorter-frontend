"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { AtSign, Send, AlertCircle, ArrowLeft } from "lucide-react"
import Button from "../Button"

const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            // Simuler un appel API
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setIsSubmitted(true)
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="card">
                <Link to="/login" className="inline-flex items-center text-white/70 hover:text-white mb-6">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Retour à la connexion</span>
                </Link>

                <h2 className="text-2xl font-title font-bold mb-6 text-center bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                    Réinitialisation du mot de passe
                </h2>

                {error && (
                    <motion.div
                        className="mb-6 p-3 bg-accent-tertiary/20 border border-accent-tertiary/30 rounded-md flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="h-5 w-5 text-accent-tertiary mr-2" />
                        <p className="text-white/90 text-sm">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-white/50 hover:text-white"
                            aria-label="Fermer"
                        >
                            &times;
                        </button>
                    </motion.div>
                )}

                {isSubmitted ? (
                    <motion.div
                        className="text-center py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-plum-good/20 mb-4">
                            <Send className="h-8 w-8 text-plum-good" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Email envoyé!</h3>
                        <p className="text-white/70 mb-6">
                            Si un compte existe avec l'adresse {email}, vous recevrez un email avec les instructions pour
                            réinitialiser votre mot de passe.
                        </p>
                        <Link to="/login">
                            <Button variant="outline">Retour à la connexion</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        <p className="text-white/70 mb-6">
                            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-white/70">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <AtSign className="h-5 w-5 text-white/40" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="block w-full pl-10 pr-3 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                        placeholder="votre@email.com"
                                    />
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent-primary/50"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: email ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    disabled={isLoading}
                                    icon={<Send className="h-5 w-5" />}
                                >
                                    {isLoading ? "Envoi en cours..." : "Envoyer les instructions"}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </motion.div>
    )
}

export default ForgotPasswordForm
