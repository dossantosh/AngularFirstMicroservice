import 'zone.js';

/**
 * Async boundary for Module Federation:
 * - Ensures MF initializes shared scopes before Angular evaluates.
 * - Also resolves the RUNTIME-006 error about loadShareSync.
 */

import('./bootstrap').catch((err) => {
  console.error('[UsersManagement] main failed:', err);
});
