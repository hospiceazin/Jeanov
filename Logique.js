// script.js
const productsContainer = document.getElementById('products');
const cartCountEl = document.getElementById('cart-count');

function formatCurrency(amount, currency){
  // simple formatting
  return new Intl.NumberFormat('fr-FR', { style:'currency', currency: currency || 'XOF', maximumFractionDigits:0 }).format(amount);
}

function renderProducts(){
  productsContainer.innerHTML = '';
  for(const p of PRODUCTS){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.title)}" onerror="this.src='images/placeholder.jpg'"/>
      <div class="title">${escapeHtml(p.title)}</div>
      <div class="desc">${escapeHtml(p.description)}</div>
      <div class="price">${formatCurrency(p.price, p.currency)}</div>
      <div style="display:flex;gap:8px">
        <button data-id="${p.id}" class="add-btn">Ajouter au panier</button>
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn" style="background:#eee;color:var(--accent);text-decoration:none;padding:8px 12px;border-radius:6px">Voir</a>
      </div>
    `;
    productsContainer.appendChild(card);
  }
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m] }); }

function getCart(){
  try{
    return JSON.parse(localStorage.getItem('jeanova_cart')||'[]');
  }catch(e){ return []; }
}
function saveCart(c){ localStorage.setItem('jeanova_cart', JSON.stringify(c)); updateCartCount(); }
function addToCart(id){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty++;
  else{
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    cart.push({ id: p.id, title: p.title, price: p.price, currency: p.currency, qty: 1 });
  }
  saveCart(cart);
  alert('Ajouté au panier');
}

function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  cartCountEl.textContent = count;
}

document.addEventListener('click', (e)=>{
  if(e.target.matches('.add-btn')){
    addToCart(e.target.dataset.id);
  }
});

document.getElementById('newsletter-form')?.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  alert('Merci ! ' + email + ' ajouté à la newsletter (simulé).');
  ev.target.reset();
});

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();
  document.getElementById('year').textContent = new Date().getFullYear();
});
