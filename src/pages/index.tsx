import React from 'react';
import { Link } from 'gatsby';

import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react';
import { Panel } from '../components/panel';
import { UserService } from '../services/user.service';

const IndexPage = () => {
  const userService = useInstance(UserService);
  return (
    <>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <Link to="/page-2/">Go to page 2</Link>
      <Panel style={{ margin: '20px' }}>The service username is: {userService.user && userService.user.email}</Panel>
    </>
  );
};

export default observer(IndexPage);
