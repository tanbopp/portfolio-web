// Next.js allows importing assets with a "?url" suffix (returns the asset URL).
// This declares that pattern so TypeScript stops complaining about e.g.
// `import worker from "pdfjs-dist/build/pdf.worker.min.mjs?url"`.
declare module "*?url" {
  const src: string;
  export default src;
}
