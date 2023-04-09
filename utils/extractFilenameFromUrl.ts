export function extractFilenameFromUrl(url: string): string {
  const filename = url.split("%2F").pop();
  return filename ? filename.replace(/\?.*$/, "") : "";
}
