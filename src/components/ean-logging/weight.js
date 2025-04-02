export const extractWeightFromName = (name = '') => {
  const normalizedName = name.replace(/,/g, '.').toLowerCase();

  // Extract both piece count and weight if present (e.g., "10stk 300g")
  const combined = {};

  // Look for weight patterns (g, kg, ml, l)
  const weightMatch = normalizedName.match(
    /(\d{1,4}(\.\d{1,2})?)\s?(ml|g|kg|l)\b/
  );
  if (weightMatch) {
    combined.weightValue = parseFloat(weightMatch[1]);
    combined.weightUnit = weightMatch[3];
  }

  // Look for piece count patterns (stk, pk)
  const pieceMatch = normalizedName.match(/(\d+)\s?(stk|pk)/);
  if (pieceMatch) {
    combined.pieceCount = parseInt(pieceMatch[1], 10);
  }

  // If we have both piece count and weight, we can calculate weight per piece
  if (combined.pieceCount && combined.weightValue) {
    combined.weightPerPiece = combined.weightValue / combined.pieceCount;
  }

  // Return the fallback values with priority to pieces if available
  if (combined.pieceCount) {
    return {
      fallbackWeight: combined.pieceCount,
      fallbackUnit: 'stk',
      weightPerPiece: combined.weightPerPiece || null,
      totalProductWeight: combined.weightValue || null,
    };
  } else if (combined.weightValue) {
    return {
      fallbackWeight: combined.weightValue,
      fallbackUnit: combined.weightUnit,
      weightPerPiece: null,
      totalProductWeight: combined.weightValue,
    };
  }

  // Handle special case for liters
  const onlyLitersMatch = normalizedName.match(/(\d+(\.\d+)?)\s?l/);
  if (onlyLitersMatch) {
    return {
      fallbackWeight: parseFloat(onlyLitersMatch[1]),
      fallbackUnit: 'l',
      weightPerPiece: null,
      totalProductWeight: parseFloat(onlyLitersMatch[1]) * 1000,
    };
  }

  return {
    fallbackWeight: null,
    fallbackUnit: null,
    weightPerPiece: null,
    totalProductWeight: null,
  };
};

export const extractWeightFromNutrition = (nutrition = []) => {
  // If nutrition data is based on 100g, we can use that as a fallback
  if (Array.isArray(nutrition) && nutrition.length > 0) {
    // Check if we have any nutrition data, and assume it's based on 100g standard
    return { nutritionWeight: 100, nutritionUnit: 'g' };
  }

  return { nutritionWeight: null, nutritionUnit: null };
};

export const normalizeUnit = (weight, unit) => {
  if (!weight || !unit) return { normalizedWeight: null, normalizedUnit: null };

  const u = unit.toLowerCase();

  if (u === 'kg')
    return { normalizedWeight: weight * 1000, normalizedUnit: 'g' };
  if (u === 'l')
    return { normalizedWeight: weight * 1000, normalizedUnit: 'ml' };
  if (u === 'stk' || u === 'piece' || u === 'pieces')
    return { normalizedWeight: weight, normalizedUnit: 'stk' };

  return { normalizedWeight: weight, normalizedUnit: u };
};

// Calculate nutrition value based on logged amount
export const calculateNutritionValues = (
  nutrition = [],
  amount,
  unit,
  weightPerPiece = null,
  totalWeight = null
) => {
  if (!Array.isArray(nutrition) || nutrition.length === 0) {
    return [];
  }

  // Determine the scaling factor based on unit type
  let scaleFactor = amount / 100; // Default for weight-based (g, ml)

  // If unit is pieces and we know weight per piece, calculate based on total weight
  if ((unit === 'stk' || unit === 'piece') && weightPerPiece) {
    const effectiveWeight = amount * weightPerPiece;
    scaleFactor = effectiveWeight / 100;
  }

  return nutrition.map((item) => {
    const baseAmount =
      typeof item.amount === 'number'
        ? item.amount
        : parseFloat(String(item.amount).replace(',', '.')) || 0;

    const scaledAmount = (baseAmount * scaleFactor).toFixed(2);
    const unitStr = item.unit || '';

    return {
      name: item.display_name || item.name || 'Ukjent næringsstoff',
      value: `${scaledAmount}${unitStr ? ' ' + unitStr : ''}`.trim(),
      // Include raw values for calculations
      rawAmount: parseFloat(scaledAmount),
      rawUnit: unitStr,
    };
  });
};
