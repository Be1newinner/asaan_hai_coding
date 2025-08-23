export const titleToSlug = (title: string, id: string | number): string => {
  const combinedString = `${title}-${id}`;
  return combinedString
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trimStart()
    .trimEnd();
};

export const slugToTitle = (slug: string): string => {
  if (!slug.includes("_")) return slug;
  return slug.split("_")[1];
};

export const slugToId = (slug: string): string | null => {
  const parts = slug.split('-');
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    // Check if the last part is a number
    if (!isNaN(Number(lastPart))) {
      return lastPart;
    }
  }
  return null;
};