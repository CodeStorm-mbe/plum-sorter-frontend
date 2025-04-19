// Types pour l'application
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Farm {
  id: number;
  name: string;
  description: string;
  location: string;
  size: number;
  owner: number;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  owner_details?: {
    id: number;
    username: string;
  };
  quality_score?: number;
  batches_count?: number;
  totalBatches?: number;
  recent_quality?: string;
  quality_trend?: string;
  is_active: boolean;
}

export interface PlumBatch {
  id: number;
  name: string;
  description: string;
  farm: number;
  status: string;
  created_at: string;
  updated_at: string;
  total_plums?: number;
  status_display?: string;
  farm_details?: {
    id: number;
    name: string;
  };
  quality_distribution?: QualityDistribution;
}

export interface QualityDistribution {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

export interface PlumClassification {
  id: number;
  image: string;
  class_name: string;
  confidence_score: number;
  is_plum: boolean;
  processing_time?: number;
  created_at: string;
  farm?: number;
  batch?: number;
}

export interface ModelVersion {
  id: number;
  name: string;
  version: string;
  model_type: string;
  num_classes: number;
  input_shape: number[];
  confidence_threshold: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  training_date: string;
  training_duration: number;
  dataset_size: number;
  is_active: boolean;
  is_production: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;
  clearError?: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface LocationState {
  from?: string;
  passwordReset?: boolean;
  emailVerified?: boolean;
  token?: string;
  email?: string;
}

export interface StatisticsResponse {
  total_classifications: number;
  average_confidence: number;
  class_counts: Record<string, number>;
  class_percentages: Record<string, number>;
  farms_statistics: FarmStatistics[];
  recent_classifications: PlumClassification[];
}

export interface FarmStatistics {
  id: number;
  name: string;
  total_classifications: number;
  average_confidence: number;
  class_counts: Record<string, number>;
  class_percentages: Record<string, number>;
  batches: BatchStatistics[];
}

export interface BatchStatistics {
  batch_id: number;
  batch_name: string;
  total_classifications: number;
  quality_distribution: QualityDistribution;
}
