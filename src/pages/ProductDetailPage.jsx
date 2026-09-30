import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="font-semibold text-gray-900 tracking-wide text-sm uppercase">{title}</span>
        <span className="text-gray-500">{isOpen ? <Minus size={18} /> : <Plus size={18} />}</span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Fetch related products
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p._id !== data._id && p.category === data.category)
          .slice(0, 3);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const pImages = product.images || [];
      const vImages = selectedVariant?.images || [];
      
      const combined = [...pImages, ...vImages];
      // Deduplicate by URL
      const uniqueImages = [];
      const urls = new Set();
      combined.forEach(img => {
        if (img && img.url && !urls.has(img.url)) {
          urls.add(img.url);
          uniqueImages.push(img);
        }
      });
      
      // If no images at all, add a placeholder or fallback
      if (uniqueImages.length === 0) {
        if (product.imageUrl) {
          uniqueImages.push({ url: product.imageUrl, alt: product.name });
        }
      }

      setGallery(uniqueImages);
      if (uniqueImages.length > 0) {
        // Only set main image if the current main image is not in the new gallery, 
        // or if it's the initial load
        if (!mainImage || !uniqueImages.find(img => img.url === mainImage.url)) {
          setMainImage(uniqueImages[0]);
        }
      } else {
        setMainImage(null);
      }
      setQuantity(1); // Reset quantity when variant changes
    }
  }, [product, selectedVariant]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03204E]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif mb-4 text-[#03204E]">{error || 'Product not found'}</h2>
        <Link to="/products" className="text-sm underline hover:text-[#03204E]">
          Return to All Fragrances
        </Link>
      </div>
    );
  }

  const price = selectedVariant?.price || product.price || 0;
  const stock = selectedVariant?.stock || 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > stock && stock > 0) return stock;
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      
      {/* Breadcrumbs */}
      <nav className="text-xs tracking-wider uppercase mb-8 text-gray-500">
        <Link to="/" className="hover:text-[#03204E]">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-[#03204E]">Fragrances</Link>
        <span className="mx-2">/</span>
        <span className="text-[#03204E] font-medium">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
        
        {/* LEFT COLUMN - Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-16 h-16 border bg-[#FAFAFA] transition-colors ${
                    mainImage?.url === img.url ? 'border-[#03204E]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Main Image */}
          <div className="flex-1 aspect-square bg-[#FAFAFA] relative overflow-hidden">
            <img
              src={mainImage?.url || product.images?.[0]?.url || product.imageUrl || '/img/product.png'}
              alt={mainImage?.alt || product.name}
              className="w-full h-full object-contain p-8 lg:p-12 transition-opacity duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/product.png';
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN - Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {product.fragranceFamily && (
            <p className="text-sm tracking-widest text-gray-500 uppercase mb-3">
              {product.fragranceFamily}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-serif uppercase text-[#03204E] mb-4">
            {product.name}
          </h1>
          
          <div className="text-2xl font-semibold text-gray-900 mb-6">
            EGP {price.toLocaleString()}
          </div>
          
          <div className="text-gray-600 text-sm leading-relaxed mb-8">
            {product.shortDescription || product.description}
          </div>

          {/* Size Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <span className="block text-sm font-semibold uppercase tracking-wider text-gray-900 mb-3">
                Size
              </span>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 text-sm tracking-widest uppercase transition-colors ${
                      selectedVariant?._id === variant._id
                        ? 'bg-[#03204E] text-white border-2 border-[#03204E]'
                        : 'bg-white text-gray-700 border border-slate-200 hover:border-gray-400'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 h-12 w-32 shrink-0">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={isOutOfStock}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <div className="flex-1 text-center font-medium">
                {quantity}
              </div>
              <button 
                onClick={() => handleQuantityChange(1)}
                disabled={isOutOfStock}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 h-12 bg-[#03204E] text-white text-sm font-medium tracking-widest uppercase hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 h-12 border border-[#03204E] text-[#03204E] text-sm font-medium tracking-widest uppercase hover:bg-gray-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-auto border-t border-gray-200">
            {product.notes && (product.notes.top || product.notes.heart || product.notes.base) && (
              <AccordionItem title="Fragrance Notes" defaultOpen={true}>
                <div className="space-y-2">
                  {product.notes.top && <p><strong>Top Notes:</strong> {Array.isArray(product.notes.top) ? product.notes.top.join(', ') : product.notes.top}</p>}
                  {product.notes.heart && <p><strong>Heart Notes:</strong> {Array.isArray(product.notes.heart) ? product.notes.heart.join(', ') : product.notes.heart}</p>}
                  {product.notes.base && <p><strong>Base Notes:</strong> {Array.isArray(product.notes.base) ? product.notes.base.join(', ') : product.notes.base}</p>}
                </div>
              </AccordionItem>
            )}
            
            <AccordionItem title="About this Fragrance">
              <p>{product.description || 'Experience the essence of luxury with our signature fragrance.'}</p>
            </AccordionItem>
            
            <AccordionItem title="Shipping & Delivery">
              <p>Complimentary express shipping across Egypt on orders over 1000 EGP. Standard delivery takes 2–4 business days.</p>
            </AccordionItem>
            
            <AccordionItem title="Returns & Exchange">
              <p>Unopened fragrance bottles in original packaging may be returned within 14 days of receipt.</p>
            </AccordionItem>
          </div>

        </div>
      </div>

      {/* Related Fragrances */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-gray-200 pt-16">
          <h2 className="text-2xl md:text-3xl font-serif text-center uppercase text-[#03204E] mb-12">
            Related Fragrances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {relatedProducts.map(related => {
              const relImage = related.images?.[0]?.url || related.imageUrl;
              const relPrice = related.variants?.[0]?.price || related.price;
              
              return (
                <Link key={related._id} to={`/product/${related._id}`} className="group block text-center">
                  <div className="aspect-square bg-[#FAFAFA] mb-6 overflow-hidden relative">
                    {relImage ? (
                      <img 
                        src={relImage} 
                        alt={related.name}
                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <h3 className="font-serif uppercase text-[#03204E] text-lg mb-2">{related.name}</h3>
                  {related.fragranceFamily && (
                    <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">{related.fragranceFamily}</p>
                  )}
                  <p className="text-sm font-medium">EGP {relPrice?.toLocaleString()}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ProductDetailPage;
