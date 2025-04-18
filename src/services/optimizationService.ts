// optimizationService.ts - Service pour les optimisations de performance
import api from './api';

// Types pour les optimisations
export interface CacheConfig {
  key: string;
  ttl?: number; // Durée de vie en secondes
}

// Service pour les optimisations de performance
class OptimizationService {
  // Cache local pour stocker les résultats
  private static cache: Record<string, { data: any; timestamp: number; ttl: number }> = {};

  // Récupérer des données avec mise en cache
  static async getCachedData<T>(url: string, params = {}, cacheConfig?: CacheConfig): Promise<T> {
    // Si pas de configuration de cache, faire un appel normal
    if (!cacheConfig) {
      const response = await api.get(url, { params });
      return response.data;
    }

    // Générer une clé de cache
    const cacheKey = cacheConfig.key || `${url}:${JSON.stringify(params)}`;
    const ttl = cacheConfig.ttl || 300; // 5 minutes par défaut
    const now = Date.now();

    // Vérifier si les données sont en cache et valides
    if (
      this.cache[cacheKey] &&
      now - this.cache[cacheKey].timestamp < this.cache[cacheKey].ttl * 1000
    ) {
      return this.cache[cacheKey].data;
    }

    // Sinon, faire l'appel API et mettre en cache
    try {
      const response = await api.get(url, { params });
      this.cache[cacheKey] = {
        data: response.data,
        timestamp: now,
        ttl
      };
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des données pour ${url}:`, error);
      throw error;
    }
  }

  // Vider le cache
  static clearCache(keyPattern?: string): void {
    if (!keyPattern) {
      this.cache = {};
      return;
    }

    // Supprimer les entrées qui correspondent au pattern
    Object.keys(this.cache).forEach(key => {
      if (key.includes(keyPattern)) {
        delete this.cache[key];
      }
    });
  }

  // Traitement par lots pour les uploads multiples
  static async batchUpload(
    url: string,
    files: File[],
    batchSize: number = 3,
    onProgress?: (progress: number) => void
  ): Promise<any[]> {
    const results: any[] = [];
    let processed = 0;

    // Traiter les fichiers par lots
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      });

      // Attendre que tous les fichiers du lot soient traités
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.map(response => response.data));

      // Mettre à jour la progression
      processed += batch.length;
      if (onProgress) {
        onProgress(Math.round((processed / files.length) * 100));
      }
    }

    return results;
  }

  // Récupérer des classifications optimisées
  static async getOptimizedClassifications(params = {}) {
    try {
      // Utiliser l'endpoint optimisé du backend
      const response = await api.get('/plum-classifier/optimized-classifications/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des classifications optimisées:', error);
      throw error;
    }
  }

  // Mesurer le temps d'exécution d'une fonction
  static async measureExecutionTime<T>(
    fn: () => Promise<T>,
    label: string
  ): Promise<{ result: T; executionTime: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const executionTime = end - start;

    console.log(`[Performance] ${label}: ${executionTime.toFixed(2)}ms`);

    return { result, executionTime };
  }
}

export default OptimizationService;
