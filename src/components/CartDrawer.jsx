import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
      />

      {/* Slide Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={18} className="text-[#03204E]" />
            <h3 className="text-sm font-serif uppercase tracking-widest text-[#03204E]">Your Shopping Bag</h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-slate-400 hover:text-[#03204E] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-slate-300" />
              <p className="text-xs uppercase tracking-widest text-slate-400">Your bag is currently empty</p>
            </div>
          ) : (
            cart.map((item, idx) => {
              const product = item.product;
              const variant = item.variant;
              const imgUrl = product.images?.[0]?.url || '/img/product.png';

              return (
                <div key={idx} className="flex items-center space-x-4 border-b border-slate-100 pb-4">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover bg-slate-50 border border-slate-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/product.png';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-serif uppercase text-[#03204E]">{product.name}</h4>
                    <p className="text-[11px] text-slate-400">{variant?.size || '100ml'}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-5 h-5 border border-slate-200 text-xs flex items-center justify-center text-[#03204E]"
                      >
                        -
                      </button>
                      <span className="text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-5 h-5 border border-slate-200 text-xs flex items-center justify-center text-[#03204E]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <span className="text-xs font-semibold text-[#03204E]">
                      ${(variant?.price || 0) * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="block text-slate-300 hover:text-red-500 transition-colors ml-auto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="uppercase tracking-widest text-slate-500 text-xs">Subtotal</span>
              <span className="font-semibold text-[#03204E]">${cartSubtotal}</span>
            </div>
            <p className="text-[10px] text-slate-400">Taxes and shipping calculated at checkout.</p>
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-[#03204E] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-slate-800 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
