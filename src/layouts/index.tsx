import * as React from 'react';
import Helmet from 'react-helmet';
import { provider, useInstance } from 'react-ioc';

import { observer } from 'mobx-react';
import Loading from '../components/loading';

import { IRootService } from '../services/root-sevice.interface';
import { UserService } from '../services/user.service';

const services: Array<(new () => IRootService) | (new () => object)> = [UserService];

// Fox mobile devices & electron apps to get real height
const updateVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

const useRootHook = (props: any) => {
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
      loading = loading || instance.loading;
    }
  });

  return loading;
};

const IndexLayout: React.FC = ({ children, ...props }) => {
  const loading = useRootHook(props);

  return (
    <>
      <Helmet title="App Name" meta={[{ name: 'description', content: 'Desctiption' }, { name: 'keywords', content: 'keyword' }]} />
      {children}
      <Loading active={loading} />
      <style global jsx>{`
        body {
          position: fixed;
          margin: 0;
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, Helvetica, sans-serif;
          background-color: #f3f7fa;
          color: #4a4a4a;
          max-width: 100vw;
          min-width: 100vw;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default provider(...services)(observer(IndexLayout));
