export const extractWeightFromName = (name = '') => {
  const normalizedName = name.replace(/,/g, '.').toLowerCase();

  const match = normalizedName.match(/(\d{1,4}(\.\d{1,2})?)\s?(ml|g|kg|l)\b/);
  if (match) {
    const value = parseFloat(match[1]);
    let unit = match[3];

    return { fallbackWeight: value, fallbackUnit: unit };
  }

  const onlyLitersMatch = normalizedName.match(/(\d+(\.\d+)?)\s?l/);
  if (onlyLitersMatch) {
    return {
      fallbackWeight: parseFloat(onlyLitersMatch[1]),
      fallbackUnit: 'l',
    };
  }

  return { fallbackWeight: null, fallbackUnit: null };
};

export const normalizeUnit = (weight, unit) => {
  if (!weight || !unit) return { normalizedWeight: null, normalizedUnit: null };

  const u = unit.toLowerCase();

  if (u === 'kg')
    return { normalizedWeight: weight * 1000, normalizedUnit: 'g' };
  if (u === 'l')
    return { normalizedWeight: weight * 1000, normalizedUnit: 'ml' };

  return { normalizedWeight: weight, normalizedUnit: u };
};
