// Shared fallback product catalog: used when backend is unreachable or product not found by ID
export const FALLBACK_CATALOG = [
  {
    _id: '6ab695802ed8800c05888aad',
    name: 'M20 Signature Noir',
    slug: 'm20-noir',
    fragranceFamily: 'Woody & Amber',
    gender: 'Men',
    shortDescription: 'Black Cardamom, Velvet Oud, and Smoked Amber engineered for long endurance.',
    description: 'M20 NOIR is an assertive oriental fragrance built for those who command attention. Opening with spiced black cardamom and saffron, evolving into velvety oud, and settling into smoked amber and cedarwood for all-day intensity.',
    fragranceNotes: { top: ['Black Cardamom', 'Saffron'], heart: ['Velvet Oud', 'Rose'], base: ['Smoked Amber', 'Cedarwood', 'Musk'] },
    notes: { top: ['Black Cardamom', 'Saffron'], heart: ['Velvet Oud', 'Rose'], base: ['Smoked Amber', 'Cedarwood', 'Musk'] },
    price: 850,
    variants: [
      { _id: '6ad6c20df85ebdef384f8921', size: '30ml', price: 850, stock: 999, SKU: 'M20-SIGNA-30ML' },
      { _id: '6ad6c20df85ebdef384f8922', size: '50ml', price: 1450, stock: 999, SKU: 'M20-SIGNA-50ML' },
      { _id: '6ad6c20df85ebdef384f8923', size: '100ml', price: 2200, stock: 999, SKU: 'M20-SIGNA-100ML' }
    ],
    images: [
      { url: '/img/زجاجة عطر نوار الفاخرة.png', alt: 'M20 Noir' },
      { url: '/img/عطر نوار بالقهوة والفانيليا والعنبر.png', alt: 'M20 Noir Ingredients' }
    ],
    hoverImage: '/img/عطر نوار بالقهوة والفانيليا والعنبر.png'
  },
  {
    _id: '6addcf4b487de52deff3d3c7',
    name: 'ROYAL VETIVER',
    slug: 'royal-vetiver',
    fragranceFamily: 'Fresh Earthy',
    gender: 'Men',
    shortDescription: 'Haitian Vetiver, Italian Bergamot, and Pink Pepper for a refined masculine aura.',
    description: 'ROYAL VETIVER captures the essence of confident presence. Fresh bergamot and pepper open the composition, while rare Haitian vetiver forms the soul of this fragrance: earthy, smoky, and endlessly refined.',
    notes: { top: ['Italian Bergamot', 'Pink Pepper'], heart: ['Haitian Vetiver', 'Geranium'], base: ['Sandalwood', 'White Musk'] },
    price: 850,
    variants: [
      { _id: 'rv-v1', size: '30ml', price: 850, stock: 999, SKU: 'M20-RV-30ML' },
      { _id: 'rv-v2', size: '50ml', price: 1450, stock: 999, SKU: 'M20-RV-50ML' },
      { _id: 'rv-v3', size: '100ml', price: 2200, stock: 999, SKU: 'M20-RV-100ML' }
    ],
    images: [{ url: '/img/product.png', alt: 'Royal Vetiver' }]
  },
  {
    _id: '6ac6a65ca971095058f391be',
    name: 'SOLEIL BLANC',
    slug: 'soleil-blanc',
    fragranceFamily: 'Floral Citrus',
    gender: 'Women',
    shortDescription: 'Neroli Blossom, White Amber, and Cashmere Wood crafted for distinction.',
    description: 'SOLEIL BLANC is a luminous, sun-drenched composition. Delicate neroli and jasmine bloom over a base of white amber and cashmere wood for a feminine signature.',
    notes: { top: ['Neroli', 'Grapefruit'], heart: ['White Jasmine', 'Tuberose'], base: ['White Amber', 'Cashmere Wood', 'Vanilla'] },
    price: 900,
    variants: [
      { _id: '6ad6c20bf85ebdef384f8918', size: '30ml', price: 900, stock: 999, SKU: 'M20-SOLEIL-30ML' },
      { _id: '6ad6c20bf85ebdef384f8919', size: '50ml', price: 1550, stock: 999, SKU: 'M20-SOLEIL-50ML' },
      { _id: '6ad6c20bf85ebdef384f891a', size: '100ml', price: 2350, stock: 999, SKU: 'M20-SOLEIL-100ML' }
    ],
    images: [{ url: '/img/product.png', alt: 'Soleil Blanc' }]
  },
  {
    _id: '6addcf4b487de52deff3d3cd',
    name: 'VELVET IRIS',
    slug: 'velvet-iris',
    fragranceFamily: 'Powdery Floral',
    gender: 'Women',
    shortDescription: 'Florentine Iris, White Musk, and Vanilla Accord creating a sensual veil.',
    description: 'VELVET IRIS wraps you in a powdery warmth. Florentine iris merges with white musk and a deep vanilla accord to create a fragrance that feels like a second skin.',
    notes: { top: ['Aldehydes', 'Peach'], heart: ['Florentine Iris', 'Violet'], base: ['White Musk', 'Vanilla', 'Sandalwood'] },
    price: 850,
    variants: [
      { _id: 'vi-v1', size: '30ml', price: 850, stock: 999, SKU: 'M20-VI-30ML' },
      { _id: 'vi-v2', size: '50ml', price: 1450, stock: 999, SKU: 'M20-VI-50ML' },
      { _id: 'vi-v3', size: '100ml', price: 2200, stock: 999, SKU: 'M20-VI-100ML' }
    ],
    images: [{ url: '/img/product.png', alt: 'Velvet Iris' }]
  },
  {
    _id: '6addcf4b487de52deff3d3d3',
    name: 'IMPERIAL OUD',
    slug: 'imperial-oud',
    fragranceFamily: 'Rich Amber Oud',
    gender: 'Men',
    shortDescription: 'Rare Cambodian Oud, Saffron, and Leather crafted for deep intensity.',
    description: 'IMPERIAL OUD is a statement of heritage. Rare Cambodian oud intertwines with Persian saffron and supple leather, anchored by a resinous base of amber and labdanum.',
    notes: { top: ['Persian Saffron', 'Cardamom'], heart: ['Cambodian Oud', 'Leather'], base: ['Amber', 'Labdanum', 'Incense'] },
    price: 950,
    variants: [
      { _id: 'io-v1', size: '30ml', price: 950, stock: 999, SKU: 'M20-IO-30ML' },
      { _id: 'io-v2', size: '50ml', price: 1650, stock: 999, SKU: 'M20-IO-50ML' },
      { _id: 'io-v3', size: '100ml', price: 2450, stock: 999, SKU: 'M20-IO-100ML' }
    ],
    images: [{ url: '/img/product.png', alt: 'Imperial Oud' }]
  },
  {
    _id: '6addcf4c487de52deff3d3d9',
    name: 'ROSE MAJESTÉ',
    slug: 'rose-majeste',
    fragranceFamily: 'Rose & Vanilla',
    gender: 'Women',
    shortDescription: 'Damask Rose, Bourbon Vanilla, and Warm Amber for an unforgettable presence.',
    description: 'ROSE MAJESTÉ is a timeless composition. Bulgarian Damask rose, deepened by Bourbon vanilla and wrapped in warm amber for lasting presence.',
    notes: { top: ['Bulgarian Rose', 'Lychee'], heart: ['Damask Rose', 'Peony'], base: ['Bourbon Vanilla', 'Warm Amber', 'Musk'] },
    price: 850,
    variants: [
      { _id: 'rm-v1', size: '30ml', price: 850, stock: 999, SKU: 'M20-RM-30ML' },
      { _id: 'rm-v2', size: '50ml', price: 1450, stock: 999, SKU: 'M20-RM-50ML' },
      { _id: 'rm-v3', size: '100ml', price: 2200, stock: 999, SKU: 'M20-RM-100ML' }
    ],
    images: [{ url: '/img/product.png', alt: 'Rose Majesté' }]
  }
];

export const getFallbackProductById = (id) => {
  return FALLBACK_CATALOG.find(p => p._id === id || p.slug === id) || null;
};
