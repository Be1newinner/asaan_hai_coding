export const titleToSlug = (title: string, id: string | number): string => {
  const cleanString = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trimStart()
      .trimEnd();
  };
  const combinedString = `${cleanString(title)}_${id}`;
  return combinedString;
};

export const slugToId = (slug: string): string | null => {
  const parts = slug.split("_");
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }
  return null;
};
