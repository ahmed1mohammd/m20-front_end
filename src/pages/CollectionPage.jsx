import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const FULL_CATALOG = [
  {
    _id: 'prod-noir',
    name: 'ÉLAN NOIR',
    slug: 'elan-noir',
    fragranceFamily: 'Woody & Amber',
    gender: 'Men',
    shortDescription: 'Black Cardamom, Velvet Oud, and Smoked Amber engineered for long endurance.',
    price: 599,
    variants: [{ _id: 'v1', size: '50ml', price: 599, stock: 15, SKU: 'ELN-50' }, { _id: 'v2', size: '100ml', price: 899, stock: 10, SKU: 'ELN-100' }],
    images: [{ url: '/img/product.png', alt: 'ÉLAN Noir' }]
  },
  {
    _id: 'prod-vetiver',
    name: 'ROYAL VETIVER',
    slug: 'royal-vetiver',
    fragranceFamily: 'Fresh Earthy',
    gender: 'Men',
    shortDescription: 'Haitian Vetiver, Italian Bergamot, and Pink Pepper for a refined masculine aura.',
    price: 549,
    variants: [{ _id: 'v3', size: '50ml', price: 549, stock: 20, SKU: 'RV-50' }, { _id: 'v4', size: '100ml', price: 829, stock: 12, SKU: 'RV-100' }],
    images: [{ url: '/img/product.png', alt: 'Royal Vetiver' }]
  },
  {
    _id: 'prod-soleil',
    name: 'SOLEIL BLANC',
    slug: 'soleil-blanc',
    fragranceFamily: 'Floral Citrus',
    gender: 'Women',
    shortDescription: 'Neroli Blossom, White Amber, and Cashmere Wood crafted for distinction.',
    price: 579,
    variants: [{ _id: 'v5', size: '50ml', price: 579, stock: 18, SKU: 'SB-50' }, { _id: 'v6', size: '100ml', price: 859, stock: 8, SKU: 'SB-100' }],
    images: [{ url: '/img/product.png', alt: 'Soleil Blanc' }]
  },
  {
    _id: 'prod-iris',
    name: 'VELVET IRIS',
    slug: 'velvet-iris',
    fragranceFamily: 'Powdery Floral',
    gender: 'Women',
    shortDescription: 'Florentine Iris, White Musk, and Vanilla Accord creating a sensual veil.',
    price: 599,
    variants: [{ _id: 'v7', size: '50ml', price: 599, stock: 14, SKU: 'VI-50' }, { _id: 'v8', size: '100ml', price: 899, stock: 6, SKU: 'VI-100' }],
    images: [{ url: '/img/product.png', alt: 'Velvet Iris' }]
  },
  {
    _id: 'prod-oud',
    name: 'IMPERIAL OUD',
    slug: 'imperial-oud',
    fragranceFamily: 'Rich Amber Oud',
    gender: 'Men',
    shortDescription: 'Rare Cambodian Oud, Saffron, and Leather formulated at 20% concentration.',
    price: 649,
    variants: [{ _id: 'v9', size: '50ml', price: 649, stock: 10, SKU: 'IO-50' }, { _id: 'v10', size: '100ml', price: 949, stock: 5, SKU: 'IO-100' }],
    images: [{ url: '/img/product.png', alt: 'Imperial Oud' }]
  },
  {
    _id: 'prod-rose',
    name: 'ROSE MAJESTÉ',
    slug: 'rose-majeste',
    fragranceFamily: 'Rose & Vanilla',
    gender: 'Women',
    shortDescription: 'Damask Rose, Bourbon Vanilla, and Warm Amber for an unforgettable presence.',
    price: 589,
    variants: [{ _id: 'v11', size: '50ml', price: 589, stock: 16, SKU: 'RM-50' }, { _id: 'v12', size: '100ml', price: 879, stock: 9, SKU: 'RM-100' }],
    images: [{ url: '/img/product.png', alt: 'Rose Majesté' }]
  }
];

const CollectionPage = ({ category = 'All', title = 'Fragrance Collection' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCatalog = async () => {
      setLoading(true);
      let fetched = await getProducts();
      
      let baseList = (fetched && fetched.length > 0) ? fetched : FULL_CATALOG;

      // Category Filtering
      if (category === 'Men') {
        const filtered = baseList.filter(p => 
          p.gender === 'Men' || p.category === 'Men' || 
          p.name.toLowerCase().includes('noir') || 
          p.name.toLowerCase().includes('vetiver') || 
          p.name.toLowerCase().includes('oud') || 
          p.name.toLowerCase().includes('him')
        );
        setProducts(filtered.length > 0 ? filtered : FULL_CATALOG.filter(p => p.gender === 'Men'));
      } else if (category === 'Women') {
        const filtered = baseList.filter(p => 
          p.gender === 'Women' || p.category === 'Women' || 
          p.name.toLowerCase().includes('soleil') || 
          p.name.toLowerCase().includes('iris') || 
          p.name.toLowerCase().includes('rose') || 
          p.name.toLowerCase().includes('her')
        );
        setProducts(filtered.length > 0 ? filtered : FULL_CATALOG.filter(p => p.gender === 'Women'));
      } else {
        setProducts(baseList);
      }

      setLoading(false);
    };

    fetchCatalog();
  }, [category]);

  return (
    <div className="bg-white py-12 md:py-20 border-b border-slate-100 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Collection Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-medium">
            Signature Haute Parfumerie
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#03204E] tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-light text-slate-500 max-w-md mx-auto leading-relaxed">
            Explore the complete range of ÉLAN luxury compositions. Crafted with rare essences for exceptional longevity.
          </p>
          <div className="w-12 h-[1px] bg-[#03204E] mx-auto pt-2 opacity-50"></div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs tracking-widest text-slate-400 uppercase">
            Loading Catalog Fragrances...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CollectionPage;
