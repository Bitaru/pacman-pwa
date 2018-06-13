const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';

const outputPath = path.resolve(__dirname, 'dist');
const assetsPath = path.resolve(__dirname, 'assets');

const phaserRoot = path.join(__dirname, 'node_modules/phaser/build/custom/');

const phaserPath = path.join(phaserRoot, 'phaser-split.js');
const pixiPath = path.join(phaserRoot, 'pixi.js');
const p2Path = path.join(phaserRoot, 'p2.js');


function exposeRules(modulePath, name) {
  return {
    test: (path) => modulePath === path,
    loader: 'expose-loader',
    options: name
  };
}

module.exports = {
  devtool: IS_PROD ? null : 'cheap-source-map',
  entry: {
    pacman: path.resolve(__dirname, 'src/index.ts')
  },
  context: path.resolve(__dirname, 'src'),
  output: {
    path: outputPath,
    filename: `[name]${IS_PROD ? '.[chunkhash]' : ''}.bundle.js`,
    publicPath: ''
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js'],
    alias: {
      pixi: pixiPath,
      phaser: phaserPath,
      p2: p2Path
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    stats: 'minimal',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader']
      },
      exposeRules(pixiPath, 'PIXI'),
      exposeRules(p2Path, 'p2'),
      exposeRules(phaserPath, 'Phaser')
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'assets/**/*'),
        to: path.join(__dirname, 'dist/assets/')
      },
      {
        from: path.join(__dirname, 'src/*.{json,ico,png,svg,xml}'),
        to: path.join(__dirname, 'dist/')
      }
    ]),
    new HtmlWebpackPlugin({
      hash: true,
      template:  path.resolve(__dirname, 'src/index.html'),
      inject: 'head'
    }),
  ],
};
