const babelOptions = {
  presets: ['babel-preset-gatsby'],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], '@babel/plugin-proposal-optional-chaining']
};
module.exports = require('babel-jest').createTransformer(babelOptions);
