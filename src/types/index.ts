export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'farmer' | 'technician' | 'admin';
  email_verified: boolean;
  profile_image?: string;
  phone_number?: string;
  organization?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: number;
  name: string;
  location: string;
  size: number;
  owner: number;
  owner_details?: User;
  description?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface PlumBatch {
  id: number;
  name: string;
  description?: string;
  farm: number;
  farm_details?: Farm;
  created_by: number;
  created_by_details?: User;
  status: 'pending' | 'classified' | 'archived';
  status_display?: string;
  classification_summary: ClassificationSummary;
  total_plums: number;
  quality_distribution: QualityDistribution;
  classifications_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClassificationSummary {
  total_plums: number;
  quality_distribution: QualityDistribution;
  average_confidence: number;
  last_updated?: string;
}

export interface QualityDistribution {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

export interface PlumClassification {
  id: number;
  image_path: string;
  original_filename?: string;
  uploaded_by: number;
  uploaded_by_details?: User;
  farm?: number;
  farm_details?: Farm;
  batch?: number;
  classification_result: ClassificationResult;
  class_name: 'bonne_qualite' | 'non_mure' | 'tachetee' | 'fissuree' | 'meurtrie' | 'pourrie';
  class_name_display?: string;
  confidence_score: number;
  is_plum: boolean;
  processing_time?: number;
  device_info?: string;
  geo_location?: GeoLocation;
  created_at: string;
}

export interface ClassificationResult {
  class_name: string;
  confidence: number;
  est_prune: boolean;
  all_probabilities: {
    [key: string]: number;
  };
  processing_time?: number;
  tta_used?: boolean;
  error?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ModelVersion {
  id: number;
  name: string;
  version: string;
  file_path: string;
  metadata_path?: string;
  model_type: string;
  num_classes: number;
  input_shape: number[];
  confidence_threshold: number;
  accuracy?: number;
  f1_score?: number;
  precision?: number;
  recall?: number;
  training_date?: string;
  training_duration?: number;
  dataset_size?: number;
  is_active: boolean;
  is_production: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user_id: number;
  username: string;
  email: string;
  role: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface StatisticsResponse {
  total_classifications: number;
  class_counts: Record<string, number>;
  class_percentages: Record<string, number>;
  average_confidence: number;
  period: {
    start_date: string | null;
    end_date: string | null;
  };
}

export interface FarmStatistics {
  farm_id: number;
  farm_name: string;
  total_classifications: number;
  class_counts: Record<string, number>;
  class_percentages: Record<string, number>;
  average_confidence: number;
  batches: BatchStatistics[];
}

export interface BatchStatistics {
  batch_id: number;
  batch_name: string;
  total_classifications: number;
  quality_distribution: QualityDistribution;
}

export interface UserSettings {
  id: number;
  user: number;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications_enabled: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  content_type?: string;
  object_id?: number;
  created_at: string;
}
