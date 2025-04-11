// Simple local storage service for persisting user preferences and session data

const STORAGE_PREFIX = 'plum_sorter_';

export const saveToStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

export const getFromStorage = (key, defaultValue = null) => {
    try {
        const serializedValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
        if (serializedValue === null) {
            return defaultValue;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
};

export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

export const clearAllStorage = () => {
    try {
        // Only clear items with our prefix
        Object.keys(localStorage)
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .forEach(key => localStorage.removeItem(key));
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

export default {
    saveToStorage,
    getFromStorage,
    removeFromStorage,
    clearAllStorage,
};
