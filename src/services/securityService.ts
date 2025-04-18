// securityService.ts - Service pour les fonctionnalités de sécurité et validation
import api from './api';

// Types pour la validation
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  message?: string;
}

export interface FileValidationOptions {
  maxSize?: number; // en bytes
  allowedTypes?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

// Service pour la sécurité et validation
class SecurityService {
  // Valider une image avant upload
  static validateImage(file: File, options: FileValidationOptions = {}): ValidationResult {
    // Vérifier le type de fichier
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        errors: [`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`]
      };
    }

    // Vérifier la taille du fichier
    const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB par défaut
    if (file.size > maxSize) {
      return {
        isValid: false,
        errors: [`Fichier trop volumineux. Taille maximale: ${maxSize / (1024 * 1024)}MB`]
      };
    }

    // Pour les vérifications de dimensions, nous devons créer une image
    if (options.minWidth || options.minHeight || options.maxWidth || options.maxHeight) {
      return {
        isValid: true,
        message: "Dimensions non vérifiées côté client. La validation complète sera effectuée côté serveur."
      };
    }

    return { isValid: true };
  }

  // Valider les coordonnées géographiques
  static validateCoordinates(latitude: number, longitude: number): ValidationResult {
    // Vérifier la latitude (-90 à 90)
    if (latitude < -90 || latitude > 90) {
      return {
        isValid: false,
        errors: ['Latitude invalide. La valeur doit être entre -90 et 90.']
      };
    }

    // Vérifier la longitude (-180 à 180)
    if (longitude < -180 || longitude > 180) {
      return {
        isValid: false,
        errors: ['Longitude invalide. La valeur doit être entre -180 et 180.']
      };
    }

    return { isValid: true };
  }

  // Sanitiser le contenu HTML
  static sanitizeHtml(html: string): string {
    // Version simple de sanitisation
    // Dans un cas réel, on utiliserait une bibliothèque comme DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '');
  }

  // Valider un formulaire côté client
  static validateForm(formData: Record<string, any>, rules: Record<string, any>): ValidationResult {
    const errors: string[] = [];

    // Parcourir toutes les règles
    Object.entries(rules).forEach(([field, fieldRules]) => {
      const value = formData[field];

      // Vérifier si le champ est requis
      if (fieldRules.required && (value === undefined || value === null || value === '')) {
        errors.push(`Le champ ${field} est requis.`);
      }

      // Vérifier la longueur minimale
      if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
        errors.push(`Le champ ${field} doit contenir au moins ${fieldRules.minLength} caractères.`);
      }

      // Vérifier la longueur maximale
      if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
        errors.push(`Le champ ${field} ne doit pas dépasser ${fieldRules.maxLength} caractères.`);
      }

      // Vérifier le format email
      if (fieldRules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`Le champ ${field} doit être une adresse email valide.`);
        }
      }

      // Vérifier les valeurs numériques
      if (fieldRules.numeric && value !== undefined && value !== null) {
        if (isNaN(Number(value))) {
          errors.push(`Le champ ${field} doit être un nombre.`);
        } else {
          // Vérifier la valeur minimale
          if (fieldRules.min !== undefined && Number(value) < fieldRules.min) {
            errors.push(`Le champ ${field} doit être supérieur ou égal à ${fieldRules.min}.`);
          }
          // Vérifier la valeur maximale
          if (fieldRules.max !== undefined && Number(value) > fieldRules.max) {
            errors.push(`Le champ ${field} doit être inférieur ou égal à ${fieldRules.max}.`);
          }
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

export default SecurityService;
