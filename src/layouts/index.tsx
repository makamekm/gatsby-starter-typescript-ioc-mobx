import React from 'react';
import Helmet from 'react-helmet';
import { provider } from 'react-ioc';

import { observer } from 'mobx-react';
import { Loading } from '../components/loading';
import { useRootHook } from '../libs/root';
import { services } from '../libs/root.services.dict';

const IndexLayout: React.FC = ({ children, ...props }) => {
  const loading = useRootHook(props);

  return (
    <>
      <Helmet
        title="App Name"
        meta={[
          { name: 'description', content: 'Desctiption' },
          { name: 'keywords', content: 'keyword' }
        ]}
      />
      {children}
      <Loading active={loading} />
      <style global jsx>{`
        body {
          padding: 0;
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
