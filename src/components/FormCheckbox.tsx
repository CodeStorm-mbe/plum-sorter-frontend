"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface FormCheckboxProps {
    id: string;
    name: string; // Ajout de cette propriété
    label: React.ReactNode;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ id, label, checked, onChange, required = false }) => {
    return (
        <div className="flex items-center mb-4">
            <div className="relative flex items-center">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    required={required}
                    className="opacity-0 absolute h-5 w-5 cursor-pointer"
                />
                <div
                    className={`border ${
                        checked ? "border-accent-primary bg-accent-primary/20" : "border-white/20 bg-background-light/50"
                    } w-5 h-5 rounded flex flex-shrink-0 justify-center items-center mr-2 transition-colors duration-200`}
                >
                    <AnimatePresence>
                        {checked && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Check className="h-3 w-3 text-accent-primary" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <label htmlFor={id} className="text-sm text-white/80 cursor-pointer select-none">
                    {label}
                </label>
            </div>
        </div>
    )
}

export default FormCheckbox
