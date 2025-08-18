import { container, type Configuration } from 'webpack';
import * as path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'; // <-- ADDED

/**
 * Users Management remote Module Federation config (global container).
 * Exposes './Routes' as 'UsersManagement/Routes'.
 */

const { ModuleFederationPlugin } = container;

const config: Configuration = {
  output: { uniqueName: 'UsersManagement', publicPath: 'auto', clean: true },
  experiments: { outputModule: true },

  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../../tsconfig.base.json'),
      }),
    ],
    mainFields: ['browser', 'module', 'main'],
    conditionNames: ['es2020', 'module', 'import', 'browser', 'default'],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'UsersManagement',
      filename: 'remoteEntry.mjs',
      library: { type: 'module' },
      exposes: {
        // If your routes file is actually under src/app/, change this path accordingly.
        './Routes': path.resolve(__dirname, 'src/libs/app.routes.ts'),
      },
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
