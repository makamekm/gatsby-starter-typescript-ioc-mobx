import React from 'react';
import { Link } from 'gatsby';

const PageTwo = () => (
  <>
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <ul>
      <li>
        <Link to="/not_found/">Show me 404!</Link>
      </li>
      <li>
        <Link to="/">Take me back home.</Link>
      </li>
    </ul>
  </>
);

export default PageTwo;
