export function getDisplayImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'drive.google.com') return url;

    const pathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    const fileId = pathMatch?.[1] || parsed.searchParams.get('id');
    if (!fileId) return url;

    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1600`;
  } catch {
    return url;
  }
}