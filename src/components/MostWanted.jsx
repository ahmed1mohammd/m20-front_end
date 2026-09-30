import React from 'react';
import ProductCard from './ProductCard';

const MostWanted = ({ products = [] }) => {
  // Selected products for home grid
  const fallbackProducts = [
    {
      _id: 'prod-noir',
      name: 'ÉLAN NOIR',
      slug: 'elan-noir',
      fragranceFamily: 'Woody & Amber',
      shortDescription: 'Black Cardamom, Velvet Oud, and Smoked Amber engineered for long endurance.',
      price: 599,
      variants: [{ _id: 'v1', size: '50ml', price: 599, stock: 15, SKU: 'ELN-50' }],
      images: [{ url: '/img/product.png', alt: 'Élan Noir' }]
    },
    {
      _id: 'prod-vetiver',
      name: 'ROYAL VETIVER',
      slug: 'royal-vetiver',
      fragranceFamily: 'Fresh Earthy',
      shortDescription: 'Haitian Vetiver, Italian Bergamot, and Pink Pepper for a refined masculine aura.',
      price: 549,
      variants: [{ _id: 'v3', size: '50ml', price: 549, stock: 20, SKU: 'RV-50' }],
      images: [{ url: '/img/product.png', alt: 'Royal Vetiver' }]
    },
    {
      _id: 'prod-soleil',
      name: 'SOLEIL BLANC',
      slug: 'soleil-blanc',
      fragranceFamily: 'Floral Citrus',
      shortDescription: 'Neroli Blossom, White Amber, and Cashmere Wood crafted for distinction.',
      price: 579,
      variants: [{ _id: 'v5', size: '50ml', price: 579, stock: 18, SKU: 'SB-50' }],
      images: [{ url: '/img/product.png', alt: 'Soleil Blanc' }]
    }
  ];

  const displayProducts = (products && products.length > 0) ? products.slice(0, 3) : fallbackProducts;

  return (
    <section className="bg-white py-14 border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-medium block">
            Curated Selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03204E] tracking-tight uppercase">
            MOST WANTED
          </h2>
        </div>

        {/* 3-Column Clean Grid using ProductCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {displayProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default MostWanted;
