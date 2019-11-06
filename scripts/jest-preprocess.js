const babelOptions = {
  presets: ['babel-preset-gatsby'],
  plugins: ['@babel/plugin-proposal-optional-chaining', ['@babel/plugin-proposal-decorators', { legacy: true }]]
};
module.exports = require('babel-jest').createTransformer(babelOptions);
