/**
 * One-off migration: ensure the public `projects` bucket exists in Supabase
 * Storage and upload legacy media from legacy-laravel/storage/app/public.
 *
 * Run: node scripts/migrate-storage.mjs
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (or process.env).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

// tiny .env parser (avoids a dotenv dependency)
function loadEnv(file) {
  const out = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}
const env = { ...process.env, ...loadEnv(".env.local") };

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env vars");

const bucket = "projects";
const admin = createClient(url, key, { auth: { persistSession: false } });

const base = join(process.cwd(), "legacy-laravel", "storage", "app", "public");

async function ensureBucket() {
  const { data: buckets } = await admin.storage.listBuckets();
  if ((buckets ?? []).some((b) => b.name === bucket)) {
    console.log(`bucket "${bucket}" already exists`);
    return;
  }
  const { error } = await admin.storage.createBucket(bucket, { public: true });
  if (error) throw new Error(`createBucket: ${error.message}`);
  console.log(`created public bucket "${bucket}"`);
}

async function uploadDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await uploadDir(full);
    } else if (entry.isFile()) {
      const rel = relative(base, full).replace(/\\/g, "/");
      // strip the "projects/" bucket-prefix segment to match storageUrl()
      const storagePath = rel.startsWith(`${bucket}/`) ? rel.slice(bucket.length + 1) : rel;
      const buf = readFileSync(full);
      const { error } = await admin.storage
        .from(bucket)
        .upload(storagePath, buf, { upsert: true, contentType: "application/octet-stream" });
      console.log(`${error ? "ERR " : "OK  "}${storagePath}${error ? " -> " + error.message : ""}`);
    }
  }
}

await ensureBucket();
await uploadDir(base);
console.log("done.");
