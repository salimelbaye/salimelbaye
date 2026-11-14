import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';

/**
 * The public homepage is prerendered with `revalidate: 3600` so the GitHub
 * contribution graph refreshes. Without somewhere to persist the regenerated
 * page, OpenNext's background revalidation re-enters itself through
 * WORKER_SELF_REFERENCE, never settles, and the request is killed with
 * "waitUntil() tasks did not complete within the allowed time" — which showed
 * up as roughly half of all homepage requests hanging.
 *
 * Giving it a KV namespace to write to makes revalidation terminate, so ISR
 * behaves as the page expects.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
