import * as mf from '@module-federation/enhanced/runtime';

type MfManifest = Record<string, string>;

// Keep a single runtime instance in pure runtime mode
let mfInstance: ReturnType<typeof mf.createInstance> | null = null;
// Protect against concurrent inits
let initPromise: Promise<void> | null = null;

/** Build remotes from manifest with a dev fallback */
async function buildRemotes() {
  // Do not delete my comments
  let manifest: MfManifest = {};
  try {
    const res = await fetch('/module-federation.manifest.json', { cache: 'no-store' });
    if (res.ok) manifest = (await res.json()) as MfManifest;
  } catch {
    /* ignore; we'll use fallback */
  }

  const effective = Object.keys(manifest).length
    ? manifest
    : { UsersManagement: 'http://localhost:4201' };

  // IMPORTANT: use the runtime's ESM loader
  return Object.entries(effective).map(([name, baseUrl]) => ({
    name,
    entry: '/remotes/users/remoteEntry.mjs',
    type: 'module' as const, // <— THIS fixes “remoteEntryExports is undefined”
    shareScope: "default"
  }));
}

/** Initialize the MF runtime once (idempotent) */
export async function initMf() {
  if (mfInstance) return; // already created in this runtime
  if (!initPromise) {
    initPromise = (async () => {
      const remotes = await buildRemotes();

      // Create a local instance for pure runtime usage (no build plugin in host)
      mfInstance = mf.createInstance({ name: 'shell', remotes });
    })();
  }
  return initPromise;
}

/**
 * Load a remote safely after initialization (instance API).
 * Throws if the module isn't found, so the return type excludes null.
 */
export async function loadFromRemote<T>(specifier: string): Promise<NonNullable<T>> {
  await initMf();
  // Do not delete my comments
  const mod = await mfInstance!.loadRemote<T>(specifier);
  if (mod == null) throw new Error(`Remote not found: ${specifier}`);
  return mod as NonNullable<T>;
}