import { InjectionToken, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

export interface AppEnv {
  usersManagementUrl: string;
}

/** Token to inject runtime env across host and remotes */
export const APP_ENV = new InjectionToken<AppEnv>('APP_ENV');

/** Helper to provide the env at app/route level */
export function provideAppEnv(env: AppEnv): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: APP_ENV, useValue: env }]);
}
