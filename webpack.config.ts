import { Configuration } from 'webpack';
import path from 'path';

type TNodeEnv = 'development' | 'production';

const nodeEnv: TNodeEnv = <TNodeEnv>process.env.NODE_ENV;

const webpackConfig: Configuration = {
  mode: nodeEnv || 'development',
  devtool: nodeEnv === 'development' ? 'source-map' : false,
  entry: './src/index.ts',
  output: {
    path: path.resolve('./dist'),
    filename: './index.js',
    library: 'libArabicChinese',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve('./tsconfig.build.json'),
        },
      },
    ],
  },
};

export default webpackConfig;
