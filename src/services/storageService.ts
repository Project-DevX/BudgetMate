import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving data to storage:', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving data from storage:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from storage:', error);
      throw error;
    }
  }

  async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving object to storage:', error);
      throw error;
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving object from storage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      throw error;
    }
  }

  async multiGet(keys: string[]): Promise<readonly [string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Error getting multiple items from storage:', error);
      throw error;
    }
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Error setting multiple items in storage:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error removing multiple items from storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
