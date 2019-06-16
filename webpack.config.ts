import { Configuration } from 'webpack';

type TNodeEnv = 'development' | 'production';

const nodeEnv: TNodeEnv = <TNodeEnv>process.env.NODE_ENV;

const webpackConfig: Configuration = {
  mode: nodeEnv || 'development',
  devtool: nodeEnv === 'development' ? 'source-map' : false,
  entry: './src/index.ts',
  output: {
    filename: './index.js'
  },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  }
};

export default webpackConfig;
