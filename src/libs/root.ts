import * as React from 'react';
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

  const instances: IRootService[] = services.map(service => useInstance(Array.isArray(service) ? service[0] : service));

  let loading = false;
  console.log('init');

  React.useEffect(() => {
    instances.forEach(instance => {
      if (instance.onMount) {
        instance.onMount();
      }
    });
    return () => {
      instances.forEach(instance => {
        if (instance.onUnMount) {
          instance.onUnMount();
        }
      });
    }
  }, []);

  instances.forEach(instance => {
    if (instance.useHook) {
      instance.useHook();
    }
    loading = loading || instance.loading;
  });

  // setTimeout(async () => {
  //   // console.log(await (instances[1] as any).left);
  //   console.log(await (instances[1] as any).add('test'));
  // }, 0);

  return loading;
};
