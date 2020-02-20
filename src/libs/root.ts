import React from 'react';
import { useInstance } from 'react-ioc';

import { services } from './root.services.dict';
import { IRootService } from '../services/root-sevice.interface';

// Fox mobile devices & electron apps to get real height
const updateVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

export const useRootHook = (props: any) => {
  React.useEffect(() => {
    updateVH();
    window.addEventListener('resize', updateVH);
    return () => window.removeEventListener('resize', updateVH);
  }, []);

  const instances: IRootService[] = services.map(service => useInstance(service));

  let loading = false;

  instances.forEach(instance => {
    if (instance.useHook) {
      instance.useHook(props);
    }
    loading = loading || instance.loading;
  });

  return loading;
};
