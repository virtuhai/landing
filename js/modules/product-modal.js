/** Opens the matching infographic for each product card. */

export function initProductModal() {
  const dialog = document.querySelector('[data-product-modal]');
  const image = dialog?.querySelector('[data-product-modal-image]');
  const title = dialog?.querySelector('[data-product-modal-title]');
  const close = dialog?.querySelector('[data-product-modal-close]');
  const cards = document.querySelectorAll('[data-product-card]');

  if (!dialog || !image || !title || !close || cards.length === 0) return;

  const open = (card) => {
    const productTitle = card.dataset.productTitle || 'VIRTUHAI';
    image.src = card.dataset.productImage || '';
    image.alt = `${productTitle} infographic`;
    title.textContent = productTitle;
    dialog.showModal();
    close.focus();
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(card);
      }
    });
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
