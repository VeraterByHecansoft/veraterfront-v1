// src/contexts/store/persistConfig.ts

const secureStore = {
  getItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      // Intenta decodificar en base64
      const decoded = atob(encrypted);
      return decodeURIComponent(escape(decoded));
    } catch (e) {
      console.warn(`🔐 secureStore: No se pudo decodificar la clave "${key}"`, e);
      return null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      const encoded = btoa(unescape(encodeURIComponent(value)));
      localStorage.setItem(key, encoded);
    } catch (e) {
      console.error('secureStore: error al guardar', e);
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('secureStore: error al eliminar', e);
    }
  }
};

export default secureStore;
