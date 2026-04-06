import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'propnest_favorites';

export const getFavorites = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
};

export const toggleFavorite = (id: string): string[] => {
  const favs = getFavorites();
  const updated = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('favorites-changed'));
  return updated;
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(getFavorites);

  const refresh = useCallback(() => setFavorites(getFavorites()), []);

  useEffect(() => {
    window.addEventListener('favorites-changed', refresh);
    return () => window.removeEventListener('favorites-changed', refresh);
  }, [refresh]);

  return {
    favorites,
    isFavorite: (id: string) => favorites.includes(id),
    toggle: (id: string) => {
      const updated = toggleFavorite(id);
      setFavorites(updated);
    },
  };
};
