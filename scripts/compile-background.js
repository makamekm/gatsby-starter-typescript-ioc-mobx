const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');

const bundler = browserify({
  entries: ['src/background/index.ts'],
  debug: process.env.NODE_ENV === 'production' ? false : true,
  extensions: ['.ts', '.js'],
  cache: {},
  packageCache: {}
});

bundler.transform(babelify, {
  extensions: ['.ts', '.js'],
  presets: ['@babel/env', '@babel/typescript'],
  plugins: [
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

bundler.bundle().pipe(fs.createWriteStream('public/background.js', { flags: 'w' }));
