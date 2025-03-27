'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const { hostname } = require('os');

// const dir = path.join(__dirname, '../');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
  // context: path.join(dir, 'src'),
  context: path.join(__dirname, 'src'),
  devtool: 'source-map',
  entry: './index.tsx',
  mode: prod ? 'production' : 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    symlinks: false,
  },
  output: {
    chunkFilename: '[name].[contenthash].js',
    filename: '[name].[contenthash].js',
    // path: path.join(dir, 'dist/frontend'),
    path: path.join(__dirname, 'dist'),
  },
  optimization: prod
    ? {
        minimize: true,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
        },
      }
    : {
        minimize: false,
      },
  devServer: {
    allowedHosts: ['localhost', hostname().toLowerCase(), 'host.docker.internal'],
    headers: {
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    port: 8080,
    hot: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  module: {
    rules: [
      {
        loader: 'ts-loader',
        options: {
          experimentalFileCaching: true,
          transpileOnly: true,
        },
        test: /\.tsx?$/,
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader',
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader',
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
