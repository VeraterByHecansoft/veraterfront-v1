import { useContext } from 'react';
import { APIContext } from '../contexts/api/APIProvider';

export const useAPIContext = () => {
  const context = useContext(APIContext);
  if (!context) throw new Error('useAPIContext must be used within APIProvider');
  return context;
};
