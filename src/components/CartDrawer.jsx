import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { trackInitiateCheckout } from '../utils/tracking';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, isCartOpen, setIsCartOpen } = useCart();
  const { t, formatPrice, translateProduct, isRTL } = useLanguage();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    trackInitiateCheckout({
      items: cart.map(i => ({
        productId: i.product?._id || i.product?.id,
        name: i.product?.name,
        price: i.variant?.price || i.price,
        quantity: i.quantity
      })),
      total: cartSubtotal
    });
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className={`fixed inset-0 z-50 flex ${isRTL ? 'justify-start' : 'justify-end'}`} role="dialog" aria-modal="true" aria-label="Shopping bag">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 transition-opacity duration-150" 
        onClick={() => setIsCartOpen(false)} 
      />

      {/* Slide Drawer */}
      <div className={`relative w-full max-w-md bg-white h-full ${isRTL ? 'border-r' : 'border-l'} border-slate-200 z-10 flex flex-col justify-between overlay-shadow`}>
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'}`}>
            <ShoppingBag size={18} strokeWidth={1.5} className="text-[#174F43]" />
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#174F43]">{t('cart.title', 'Shopping bag')}</h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-slate-500 hover:text-[#174F43] transition-colors duration-150 p-1 cursor-pointer"
            aria-label="Close cart"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items List */}
        <div className={`p-5 overflow-y-auto flex-1 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag size={32} strokeWidth={1.5} className="mx-auto text-slate-300" />
              <p className="text-xs uppercase tracking-widest text-slate-500">{t('cart.empty', 'Your bag is currently empty')}</p>
              <p className="text-xs text-slate-400 font-light">{t('cart.emptySub', 'Explore our catalog and find your signature fragrance.')}</p>
            </div>
          ) : (
            cart.map((item, idx) => {
              const product = translateProduct(item.product);
              const variant = item.variant;
              const imgUrl = product.images?.[0]?.url || '/img/product.png';

              return (
                <div key={idx} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} border-b border-slate-100 pb-3`}>
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-14 h-14 object-contain bg-slate-50/70 border border-slate-200 p-1 rounded-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/product.png';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-xs uppercase font-medium text-[#174F43]">{product.name}</h4>
                    <p className="text-[11px] text-slate-500">{variant?.size || '50ml'}</p>
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mt-1.5`}>
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-5 h-5 border border-slate-300 text-xs flex items-center justify-center text-[#174F43] hover:bg-slate-100 rounded-sm cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-medium px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-5 h-5 border border-slate-300 text-xs flex items-center justify-center text-[#174F43] hover:bg-slate-100 rounded-sm cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={`${isRTL ? 'text-left' : 'text-right'} space-y-2`}>
                    <span className="text-xs font-semibold text-[#174F43]">
                      {formatPrice((variant?.price || 0) * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className={`block text-slate-400 hover:text-red-700 transition-colors duration-150 ${isRTL ? 'mr-auto' : 'ml-auto'} p-1 cursor-pointer`}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className={`p-5 border-t border-slate-200 bg-slate-50/70 space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-widest text-slate-500">{t('cart.subtotal', 'Subtotal')}</span>
              <span className="font-semibold text-[#174F43] text-sm">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="text-[11px] text-slate-500">{t('cart.shippingNotice', 'Taxes and delivery fee calculated at checkout.')}</p>
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-[#174F43] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#0F3830] transition-colors duration-150 h-10 rounded-sm cursor-pointer shadow-sm active:scale-[0.99]"
            >
              {t('cart.checkoutBtn', 'Proceed to checkout')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
