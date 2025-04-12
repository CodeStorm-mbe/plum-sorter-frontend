"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

// src/components/FormInput.tsx

interface FormInputProps {
    id: string;
    name: string; // Ajout de cette propriété
    label: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
    icon?: React.ReactNode;
    autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
                                                 id,
                                                 label,
                                                 type,
                                                 placeholder,
                                                 value,
                                                 onChange,
                                                 required = false,
                                                 error,
                                                 icon,
                                                 autoComplete,
                                             }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const inputType = type === "password" && showPassword ? "text" : type

    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-white/80 mb-1.5">
                {label} {required && <span className="text-accent-tertiary">*</span>}
            </label>

            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">{icon}</div>}

                <motion.input
                    id={id}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoComplete={autoComplete}
                    className={`w-full bg-background-light/50 border ${
                        error ? "border-accent-tertiary" : isFocused ? "border-accent-primary" : "border-white/10"
                    } rounded-md py-2.5 px-4 ${
                        icon ? "pl-10" : ""
                    } text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all duration-200`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {type === "password" && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}

                {/* Animated border effect */}
                {isFocused && (
                    <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </div>

            {error && (
                <motion.p
                    className="mt-1 text-sm text-accent-tertiary"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {error}
                </motion.p>
            )}
        </div>
    )
}

export default FormInput
