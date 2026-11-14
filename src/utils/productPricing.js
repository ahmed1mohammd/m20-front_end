/**
 * Shared product variant sorting and price-range helpers.
 */

export const parseVariantSizeMl = (sizeStr) => {
  const match = String(sizeStr || '').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : Number.MAX_SAFE_INTEGER;
};

export const sortVariantsBySize = (variants = []) => {
  if (!Array.isArray(variants)) return [];
  return [...variants].sort((a, b) => parseVariantSizeMl(a?.size) - parseVariantSizeMl(b?.size));
};

export const getProductPriceSummary = (product) => {
  const sorted = sortVariantsBySize(product?.variants || []);
  const pricedVariants = sorted.filter(
    (v) => v && v.price !== undefined && v.price !== null && Number(v.price) > 0
  );

  const fallbackPrice = Number(product?.price) || 0;

  if (pricedVariants.length === 0) {
    return {
      sortedVariants: sorted,
      defaultVariant: sorted[0] || { size: '50ml', price: fallbackPrice, compareAtPrice: null, oldPrice: null },
      minPrice: fallbackPrice,
      maxPrice: fallbackPrice,
      isRange: false,
      smallestSize: sorted[0]?.size || '',
      largestSize: sorted[sorted.length - 1]?.size || '',
    };
  }

  const prices = pricedVariants.map((v) => Number(v.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const defaultVariant =
    pricedVariants.find((v) => String(v.size).toLowerCase() === '50ml') || pricedVariants[0];

  return {
    sortedVariants: sorted,
    defaultVariant,
    minPrice,
    maxPrice,
    isRange: minPrice !== maxPrice,
    smallestSize: pricedVariants[0]?.size || '',
    largestSize: pricedVariants[pricedVariants.length - 1]?.size || '',
  };
};
