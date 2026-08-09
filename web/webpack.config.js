const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const port = process.env.PORT ?? 3004;

module.exports = () => ({
  entry: {
    main: './src/bootstrapApp.ts',
  },
  mode: 'development',
  output: {
    publicPath: 'auto',
    filename: '[name].js',
  },
  devServer: {
    port,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      chunks: ['main'],
    }),
    new webpack.DefinePlugin({
      process: { env: {} },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
});
