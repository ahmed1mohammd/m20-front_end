import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const productId = product._id || product.id || 'prod-1';
  const variant = product.variants?.[0] || { price: product.price || 599, size: '50ml' };
  const priceVal = variant.price || product.price || 599;
  const imgUrl = product.images?.[0]?.url || product.imageUrl || '/img/product.png';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, variant, 1);
  };

  return (
    <div className="group flex flex-col justify-between bg-white text-left transition-all duration-300">
      <div>
        {/* Product Photography Container - Clickable Link */}
        <Link 
          to={`/product/${productId}`} 
          className="block bg-[#FAFAFA] rounded-md aspect-square overflow-hidden relative mb-4 p-4 flex items-center justify-center"
        >
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/product.png';
            }}
          />
        </Link>

        {/* Fragrance Family Badge */}
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-medium block mb-1">
          {product.fragranceFamily || 'Eau de Parfum'}
        </span>

        {/* Product Title - Clickable Link */}
        <h3 className="text-base font-serif text-[#03204E] tracking-wide mb-1.5 uppercase font-medium">
          <Link to={`/product/${productId}`} className="hover:opacity-75 transition-opacity">
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 font-light leading-relaxed mb-4 line-clamp-2">
          {product.shortDescription || product.description || 'Exclusive signature formulation created for distinction.'}
        </p>
      </div>

      {/* Footer: Price & Add to Cart */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-[#03204E]">
            EGP {priceVal}
          </span>
          <span className="text-[10px] text-slate-400 font-normal ml-1">
            / {variant.size || '50ml'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="inline-flex items-center space-x-1.5 border border-[#03204E] text-[#03204E] px-3.5 py-2 text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-[#03204E] hover:text-white transition-colors"
        >
          <ShoppingBag size={12} />
          <span>ADD</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
