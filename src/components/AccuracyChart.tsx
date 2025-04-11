"use client"

import type React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

interface AccuracyChartProps {
    data: Array<{
        name: string
        accuracy: number
    }>
    className?: string
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ data, className = "" }) => {
    return (
        <motion.div
            className={`w-full h-80 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                    <YAxis stroke="rgba(255,255,255,0.7)" domain={[80, 100]} tick={{ fill: "rgba(255,255,255,0.7)" }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#141432",
                            borderColor: "rgba(0, 229, 255, 0.3)",
                            color: "white",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(0, 229, 255, 0.3)",
                        }}
                        labelStyle={{ color: "white", fontWeight: "bold" }}
                        cursor={{ fill: "rgba(0, 229, 255, 0.05)" }}
                    />
                    <Legend formatter={(value) => <span style={{ color: "white" }}>{value}</span>} />
                    <defs>
                        <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00e5ff" stopOpacity={1} />
                            <stop offset="100%" stopColor="#7b2ff7" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <Bar
                        dataKey="accuracy"
                        name="Précision (%)"
                        fill="url(#accuracyGradient)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

export default AccuracyChart
