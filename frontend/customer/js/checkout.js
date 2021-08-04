(async () => {
  const productContainer = document.querySelector('.products');
  const products = JSON.parse(localStorage.getItem('cart')) || [];

  if (!products.length || !(await isTokenValid())) {
    location.href = '/shop';
    return;
  }

  productContainer.innerHTML = products
    .map((p) => _mountProductElement(p.id, p.image, p.name, p.size, p.price, p.quantity))
    .join('');
})();

async function generateOrder() {
  const token = localStorage.getItem('token');

  const productsFromLocalStorage = JSON.parse(localStorage.getItem('cart'));

  if (!token || !productsFromLocalStorage) {
    location.href = '/shop';
    return;
  }

  const products = productsFromLocalStorage.map((p) => {
    return {
      product_id: parseInt(p.id),
      size: parseInt(p.size),
      quantity: parseInt(p.quantity),
    };
  });

  const response = await fetch(`${BASE_URL}/orders/create.php`, {
    method: 'POST',
    body: JSON.stringify({ token, products }),
  });

  if (response.status === 401) {
    location.href = '/login';
  }
}

function _mountProductElement(id, image, name, size, price, quantity) {
  return `<div class="product_item">
  <div class="image_product">
    <img src="${image}">
  </div>
  <div class="information_product">
    <p>${name}</p>
    <p>Tamanho: <strong>${size}</strong></p>
    <p>R$ ${price}</p>
    <p id="quantity-id-${id}${size}">Quant. ${quantity}</p>
    <div>
    <button onclick="changeQuantity('remove', '${id}', '${size}')"><i class="fas fa-minus fa-xs"></i></button>
    <button onclick="changeQuantity('add', '${id}', '${size}')"><i class="fas fa-plus fa-xs"></i></button>
    </div>
  </div>
</div>
`;
}
