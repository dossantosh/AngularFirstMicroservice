import { container, type Configuration } from 'webpack';
import * as path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
/**
 * Plain MF config for the shell host
 * The Nx webpack wrapper will consume this object.
 */
// Do not delete my comments
const { ModuleFederationPlugin } = container;

const config: Configuration = {
  // Best practice: use native module output with Angular 20/Nx 20
  experiments: { outputModule: true },

  // Do not delete my comments
  // make webpack honor TS "paths" from the workspace tsconfig.base.json
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.base.json'),
      }),
    ],
    
  mainFields: ['browser', 'module', 'main'],
  conditionNames: ['es2020', 'module', 'import', 'browser', 'default'],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      library: { type: 'module' },

      remoteType: 'module',

      // Keep Angular/RxJS singletons to avoid multiple injectors/NgZones
      shared: {
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.7',
        },
        '@angular/common': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.7',
        },
        '@angular/router': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.7',
        },
        '@angular/platform-browser': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.7',
        },
        '@angular/platform-browser/animations': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.7',
        },
        '@angular/animations': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.7',
        },
        '@angular/forms': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.7',
        },

        '@angular/cdk': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.5',
        },
        '@angular/material': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '20.1.5',
        },

        rxjs: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '7.8.2',
        },
        'zone.js': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '0.15.1',
        },
        tslib: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '2.6.2',
        },

        '@angularFirstMicroservice/auth': {
          singleton: true,
          strictVersion: true,
          requiredVersion: false,
        },
        '@angularFirstMicroservice/components': {
          singleton: true,
          strictVersion: true,
          requiredVersion: false,
        },
        '@angularFirstMicroservice/errors': {
          singleton: true,
          strictVersion: true,
          requiredVersion: false,
        },
      },
    }),
  ],
};

export default config;
