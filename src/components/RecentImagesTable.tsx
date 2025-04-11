"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter } from "lucide-react"

interface RecentImagesTableProps {
  images: Array<{
    id: number
    thumbnail: string
    category: string
    confidence: number
    date: string
  }>
  activeFilter: string
  onFilterChange: (filter: string) => void
  className?: string
}

const RecentImagesTable: React.FC<RecentImagesTableProps> = ({
                                                               images,
                                                               activeFilter,
                                                               onFilterChange,
                                                               className = "",
                                                             }) => {
  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Bonne qualité": "bg-plum-good",
      "Non mûre": "bg-plum-unripe",
      Tachetée: "bg-plum-spotted",
      Fissurée: "bg-plum-cracked",
      Meurtrie: "bg-plum-bruised",
      Pourrie: "bg-plum-rotten",
    }

    return categoryMap[category] || "bg-accent-primary"
  }

  // Filtrer les images en fonction du filtre actif
  const filteredImages = images.filter((img) => activeFilter === "all" || img.category === activeFilter)

  return (
      <div className={`w-full ${className}`}>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 text-accent-primary mr-2" />
            <span className="text-white/70 text-sm">Filtrer par catégorie:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "Bonne qualité", "Non mûre", "Tachetée", "Fissurée", "Meurtrie", "Pourrie"].map((filter, index) => (
                <motion.button
                    key={filter}
                    className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                        activeFilter === filter
                            ? "bg-accent-primary text-background"
                            : "bg-background-light/50 text-white/80 hover:bg-background-light"
                    }`}
                    onClick={() => onFilterChange(filter)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {filter === "all" ? "Toutes" : filter}
                </motion.button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-background-light/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Confiance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-background-light/20">
            <AnimatePresence>
              {filteredImages.length > 0 ? (
                  filteredImages.map((image) => (
                      <motion.tr
                          key={image.id}
                          className="hover:bg-background-light/40 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <img
                                src={image.thumbnail || "/placeholder.svg"}
                                alt={`Prune ${image.id}`}
                                className="h-12 w-12 rounded-md object-cover border border-white/10"
                            />
                            <motion.div
                                className="absolute inset-0 border border-accent-primary/50 rounded-md"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${getCategoryColor(image.category)} mr-2`}></div>
                            <span>{image.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-background rounded-full h-2 mr-2 overflow-hidden">
                              <motion.div
                                  className="h-2 rounded-full"
                                  style={{
                                    background: "linear-gradient(90deg, #00e5ff, #7b2ff7)",
                                    width: `${image.confidence}%`,
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${image.confidence}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                            <span>{image.confidence}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/70">{image.date}</td>
                      </motion.tr>
                  ))
              ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <td colSpan={4} className="px-6 py-8 text-center text-white/50">
                      <div className="flex flex-col items-center">
                        <Search className="h-8 w-8 text-white/30 mb-2" />
                        <p>Aucune image ne correspond au filtre sélectionné</p>
                      </div>
                    </td>
                  </motion.tr>
              )}
            </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default RecentImagesTable
