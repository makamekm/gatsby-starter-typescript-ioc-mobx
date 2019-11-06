const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');

const bundler = browserify({
  entries: ['src/client-script/index.tsx'],
  debug: process.env.NODE_ENV === 'production' ? false : true,
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  cache: {},
  packageCache: {}
});

bundler.transform(babelify, {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  presets: ['@babel/env', '@babel/react', '@babel/typescript'],
  plugins: [
    'styled-jsx/babel',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ]
  ]
});

if (process.env.NODE_ENV === 'production') {
  bundler.plugin('minifyify', { uglify: true, map: false });
}

bundler.bundle().pipe(fs.createWriteStream('public/client-content.js', { flags: 'w' }));
