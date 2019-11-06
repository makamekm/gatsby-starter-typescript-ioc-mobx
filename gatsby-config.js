'use strict';

module.exports = {
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-layout',
    'gatsby-plugin-styled-jsx',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-copy-files',
      options: {
        source: `${__dirname}/static`,
        destination: `${__dirname}/public`
      }
    }
  ]
};
