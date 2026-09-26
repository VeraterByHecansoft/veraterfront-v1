import { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useLoaders } from '@/providers';
import { AppRoutingSetup } from '.';

const AppRouting = (): ReactElement => {
  const { setProgressBarLoader } = useLoaders();
  const [previousLocation, setPreviousLocation] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const location = useLocation();
  const path = location.pathname.trim();

  useEffect(() => {
    if (firstLoad) {
        setFirstLoad(false);
    }
  });

  useEffect(() => {
    if (!firstLoad) {
      setProgressBarLoader(true);
      setTimeout(() => {
        setPreviousLocation(path);
        setProgressBarLoader(false);
        if (path === previousLocation) {
          setPreviousLocation('');
        }
      }, 500)
    }
  }, [location]);

  useEffect(() => {
    if (!CSS.escape(window.location.hash)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [previousLocation]);

  return <AppRoutingSetup />;
};

export { AppRouting };
