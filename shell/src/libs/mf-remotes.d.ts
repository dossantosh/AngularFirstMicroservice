/* Ambient module for the remote exposed routes.
 * This removes TS2307 and gives strong typing to loadRemote<typeof import('UsersManagement/Routes')>
 */
declare module 'UsersManagement/Routes' {
  import type { Routes } from '@angular/router';

  export const remoteRoutes: Routes;
}