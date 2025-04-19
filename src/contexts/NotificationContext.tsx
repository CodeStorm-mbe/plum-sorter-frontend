import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Notification } from '../types';
import { notifications } from '../utils/notifications';

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  notificationOptions?: any[];
  toggleNotificationOption?: (id: string) => void;
  saveNotificationPreferences?: () => Promise<boolean | void>;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  notificationOptions: [],
  toggleNotificationOption: () => {},
  saveNotificationPreferences: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [notificationOptions, setNotificationOptions] = useState<any[]>([
    { id: 'email_updates', enabled: true },
    { id: 'app_notifications', enabled: true },
    { id: 'analysis_complete', enabled: true },
    { id: 'new_features', enabled: false }
  ]);

  // Charger les notifications depuis le localStorage au démarrage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotificationList(parsedNotifications);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    }
    
    // Charger les préférences de notification
    const storedOptions = localStorage.getItem('notification_options');
    if (storedOptions) {
      try {
        const parsedOptions = JSON.parse(storedOptions);
        setNotificationOptions(parsedOptions);
      } catch (error) {
        console.error('Erreur lors du chargement des préférences de notification:', error);
      }
    }
  }, []);

  // Sauvegarder les notifications dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notificationList));
  }, [notificationList]);
  
  // Sauvegarder les préférences de notification dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('notification_options', JSON.stringify(notificationOptions));
  }, [notificationOptions]);
  
  // Basculer l'état d'une option de notification
  const toggleNotificationOption = (id: string) => {
    setNotificationOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, enabled: !option.enabled } 
          : option
      )
    );
  };
  
  // Sauvegarder les préférences de notification
  const saveNotificationPreferences = async () => {
    try {
      // Simuler un appel API pour sauvegarder les préférences
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dans une implémentation réelle, on ferait un appel API ici
      // await api.post('/users/notification-preferences/', { options: notificationOptions });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences de notification:', error);
      throw error;
    }
  };

  // Ajouter une notification
  const addNotification = (notification: Notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now().toString(),
      read: false,
      createdAt: notification.createdAt || new Date(),
    };
    
    setNotificationList(prev => [newNotification, ...prev]);
    
    // Afficher une notification visuelle
    notifications.show({
      title: notification.title,
      message: notification.message,
      color: notification.type === 'error' ? 'red' : 
             notification.type === 'warning' ? 'yellow' : 
             notification.type === 'success' ? 'green' : 'blue',
    });
  };

  // Supprimer une notification
  const removeNotification = (id: string) => {
    setNotificationList(prev => prev.filter(notification => notification.id !== id));
  };

  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: notificationList,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        notificationOptions,
        toggleNotificationOption,
        saveNotificationPreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
