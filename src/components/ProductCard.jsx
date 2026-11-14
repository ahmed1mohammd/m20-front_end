import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getProductPriceSummary } from '../utils/productPricing';
import { ShoppingBag } from 'lucide-react';
import { trackAddToCart } from '../utils/tracking';

const ProductCard = ({ product: rawProduct }) => {
  const { addToCart } = useCart();
  const { t, formatPrice, translateProduct, isRTL } = useLanguage();
  const [touchActive, setTouchActive] = useState(false);

  const product = rawProduct ? translateProduct(rawProduct) : null;

  const hoverImg = product
    ? (product.hoverImage?.url ||
       (typeof product.hoverImage === 'string' ? product.hoverImage : null) ||
       product.images?.find((i) => i.role === 'hover')?.url ||
       (product.images && product.images.length > 1 ? product.images[1].url : null))
    : null;

  // Preload hover image to ensure instant, smooth transition on first hover
  useEffect(() => {
    if (hoverImg) {
      const img = new Image();
      img.src = hoverImg;
    }
  }, [hoverImg]);

  if (!product) return null;

  const productId = product._id || product.id || product.slug || 'prod-1';
  const {
    defaultVariant,
    minPrice,
    maxPrice,
    isRange,
  } = getProductPriceSummary(product);

  const oldPriceVal = defaultVariant?.compareAtPrice || defaultVariant?.oldPrice;
  const hasSingleDiscount = !isRange && oldPriceVal && Number(oldPriceVal) > Number(minPrice);

  // Extract explicit Main image
  const primaryImg = product.mainImage?.url ||
                     product.images?.find((i) => i.role === 'main')?.url ||
                     product.images?.[0]?.url ||
                     product.imageUrl ||
                     '/img/product.png';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, defaultVariant, 1);
    trackAddToCart({
      id: rawProduct?._id || rawProduct?.id || product?.id || productId,
      name: rawProduct?.name || product?.name,
      price: defaultVariant?.price || minPrice,
      quantity: 1,
      size: defaultVariant?.size || '50ml',
      category: rawProduct?.category || 'Fragrance'
    });
  };

  return (
    <article
      className={`group flex flex-col justify-between bg-transparent ${
        isRTL ? 'text-right' : 'text-left'
      } transition-colors duration-200`}
    >
      <div className="flex flex-col">
        {/* Product image container - Pure, minimal, seamless, no borders, frames, or shadows */}
        <Link
          to={`/product/${productId}`}
          className="relative block w-full aspect-square overflow-hidden mb-3 bg-transparent select-none cursor-pointer"
          aria-label={`View details for ${product.name}`}
          onTouchStart={() => setTouchActive(true)}
          onTouchEnd={() => setTimeout(() => setTouchActive(false), 2500)}
        >
          <div className="relative w-full h-full">
            {/* Primary Main Image */}
            <img
              src={primaryImg}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply pointer-events-none transition-opacity duration-500 ease-in-out ${
                hoverImg
                  ? (touchActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0')
                  : 'opacity-100'
              }`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/product.png';
              }}
            />

            {/* Hover Composition / Ingredients Image */}
            {hoverImg && (
              <img
                src={hoverImg}
                alt={`${product.name} ingredients`}
                className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply pointer-events-none transition-opacity duration-500 ease-in-out ${
                  touchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
            )}
          </div>
        </Link>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-serif text-[#174F43] tracking-wide uppercase font-medium leading-snug mb-1">
          <Link to={`/product/${productId}`} className="hover:text-[#0F3830] transition-colors">
            {product.name}
          </Link>
        </h3>
      </div>

      {/* Footer: Min–Max Bottle Price Range & Add to Cart */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-1.5">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          {hasSingleDiscount && (
            <span className="text-xs text-slate-400 line-through font-light">
              {formatPrice(oldPriceVal)}
            </span>
          )}
          {isRange ? (
            <span className="inline-flex items-baseline gap-1 text-sm sm:text-base font-semibold text-[#174F43]">
              <span>{minPrice.toLocaleString()}</span>
              <span>–</span>
              <span>{maxPrice.toLocaleString()}</span>
              <span className="text-xs font-medium">{t('common.currency', 'EGP')}</span>
            </span>
          ) : (
            <span className="text-sm sm:text-base font-semibold text-[#174F43]">
              {formatPrice(minPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center w-8 h-8 text-[#174F43] border border-[#174F43] hover:bg-[#174F43] hover:text-white rounded-sm transition-all duration-200 cursor-pointer shrink-0"
          aria-label={`Add ${product.name} to cart`}
          title={t('productCard.addToCart', 'Add to Bag')}
        >
          <ShoppingBag size={15} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
