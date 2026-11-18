/**
 * Pre-order helpers. A product is a pre-order when an admin enables `preOrder.enabled`
 * on it in the dashboard. The backend also flags each order item (`isPreOrder`).
 */
export const isPreOrder = (product) => !!product?.preOrder?.enabled;

export const getPreOrderInfo = (product, lang = 'en') => {
  if (!isPreOrder(product)) return null;
  const p = product.preOrder;
  const note = (lang === 'ar' ? p.noteAr : p.noteEn) || '';
  let dateLabel = '';
  if (p.expectedDate) {
    const d = new Date(p.expectedDate);
    if (!Number.isNaN(d.getTime())) {
      dateLabel = d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
  return { note, dateLabel };
};
