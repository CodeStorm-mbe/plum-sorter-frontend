import { camelCase, snakeCase } from 'lodash';

/**
 * Normalise les réponses de l'API en convertissant les propriétés snake_case en camelCase
 * @param data Les données à normaliser
 * @returns Les données normalisées
 */
export function normalizeResponse(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => normalizeResponse(item));
  }
  if (typeof data === 'object' && data !== null) {
    const normalized: Record<string, any> = {};
    
    Object.keys(data).forEach(key => {
      const camelKey = camelCase(key);
      normalized[camelKey] = normalizeResponse(data[key]);
    });
    
    return normalized;
  }
  return data;
}

/**
 * Convertit les propriétés camelCase en snake_case pour les requêtes API
 * @param data Les données à convertir
 * @returns Les données converties
 */
export function prepareApiRequest(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => prepareApiRequest(item));
  }
  if (typeof data === 'object' && data !== null) {
    const prepared: Record<string, any> = {};
    
    Object.keys(data).forEach(key => {
      const snakeKey = snakeCase(key);
      prepared[snakeKey] = prepareApiRequest(data[key]);
    });
    
    return prepared;
  }
  return data;
}

/**
 * Gère les réponses paginées de l'API de manière uniforme
 * @param response La réponse de l'API
 * @returns Les résultats de la réponse paginée ou la réponse complète si non paginée
 */
export function handlePaginatedResponse(response: any): any {
  // Vérifier si la réponse contient des résultats paginés
  if (response && response.data && response.data.results !== undefined) {
    return response.data.results;
  }
  
  // Si la réponse n'est pas paginée, retourner les données directement
  return response.data;
}

/**
 * Vérifie si une propriété existe dans un objet, en tenant compte des variations de casse
 * @param obj L'objet à vérifier
 * @param prop La propriété à rechercher
 * @returns La valeur de la propriété si elle existe, undefined sinon
 */
export function getPropertySafely(obj: any, prop: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  
  // Vérifier la propriété exacte
  if (obj[prop] !== undefined) return obj[prop];
  
  // Vérifier la version camelCase
  const camelProp = camelCase(prop);
  if (obj[camelProp] !== undefined) return obj[camelProp];
  
  // Vérifier la version snake_case
  const snakeProp = snakeCase(prop);
  if (obj[snakeProp] !== undefined) return obj[snakeProp];
  
  return undefined;
}

/**
 * Formate une date selon la locale française
 * @param dateString La chaîne de date à formater
 * @param options Options de formatage
 * @returns La date formatée
 */
export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  
  return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(date);
}

/**
 * Formate un nombre selon la locale française
 * @param value Le nombre à formater
 * @param options Options de formatage
 * @returns Le nombre formaté
 */
export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('fr-FR', options).format(value);
}

/**
 * Obtient la couleur associée à une qualité de prune
 * @param quality La qualité de la prune
 * @returns La couleur associée
 */
export function getQualityColor(quality: string): string {
  const colors: Record<string, string> = {
    'bonne_qualite': '#05ffa1',
    'non_mure': '#ffe202',
    'tachetee': '#ff9e00',
    'fissuree': '#ff2a6d',
    'meurtrie': '#b537f2',
    'pourrie': '#ff3860'
  };
  
  return colors[quality] || '#cccccc';
}

/**
 * Obtient le libellé d'une qualité à partir de sa clé
 * @param key La clé de la qualité
 * @returns Le libellé de la qualité
 */
export function getQualityLabel(key: string): string {
  const labels: Record<string, string> = {
    'bonne_qualite': 'Bonne qualité',
    'non_mure': 'Non mûre',
    'tachetee': 'Tachetée',
    'fissuree': 'Fissurée',
    'meurtrie': 'Meurtrie',
    'pourrie': 'Pourrie'
  };
  
  return labels[key] || key;
}
