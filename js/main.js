// ===== SHOPZONE MAIN JS =====

// ===== CART FUNCTIONS =====
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); updateBadges(); }
function getFavorites(){ return JSON.parse(localStorage.getItem('favorites')||'[]'); }
function saveFavorites(favs){ localStorage.setItem('favorites', JSON.stringify(favs)); updateBadges(); }

function addToCart(productId, qty=1){
  $.getJSON(`https://api.escuelajs.co/api/v1/products/${productId}`, function(product){
    let cart = getCart();
    const existing = cart.find(i=>i.id===product.id);
    if(existing){ existing.qty += qty; }
    else { cart.push({...product, qty}); }
    saveCart(cart);
    showToast(`✓ "${product.title.substring(0,30)}..." added to cart`, 'success');
    updateBadges();
  });
}

function addToCartDirect(product, qty=1){
  let cart = getCart();
  const existing = cart.find(i=>i.id===product.id);
  if(existing){ existing.qty += qty; }
  else { cart.push({...product, qty}); }
  saveCart(cart);
  showToast(`✓ "${product.title.substring(0,30)}..." added to cart`, 'success');
}

function removeFromCart(productId){
  let cart = getCart().filter(i=>i.id!==productId);
  saveCart(cart);
  showToast('Item removed from cart');
}

function updateCartQty(productId, qty){
  let cart = getCart();
  const item = cart.find(i=>i.id===productId);
  if(item){ item.qty = Math.max(1, qty); }
  saveCart(cart);
}

function toggleFavorite(productId){
  $.getJSON(`https://api.escuelajs.co/api/v1/products/${productId}`, function(product){
    let favs = getFavorites();
    const idx = favs.findIndex(f=>f.id===product.id);
    if(idx>-1){
      favs.splice(idx,1);
      showToast('Removed from favorites');
      $(`.fav-btn[onclick*="${productId}"]`).removeClass('active');
    } else {
      favs.push(product);
      showToast('❤ Added to favorites!', 'success');
      $(`.fav-btn[onclick*="${productId}"]`).addClass('active');
    }
    saveFavorites(favs);
    $('#favCount').text(favs.length||'');
  });
}

function toggleFavoriteDirect(product){
  let favs = getFavorites();
  const idx = favs.findIndex(f=>f.id===product.id);
  if(idx>-1){
    favs.splice(idx,1);
    showToast('Removed from favorites');
    return false;
  } else {
    favs.push(product);
    showToast('❤ Added to favorites!', 'success');
    return true;
  }
  saveFavorites(favs);
}

function updateBadges(){
  const cart = getCart();
  const favs = getFavorites();
  const cartTotal = cart.reduce((s,i)=>s+i.qty,0);
  $('#cartCount').text(cartTotal||'');
  $('#favCount').text(favs.length||'');
}

// ===== TOAST =====
function showToast(msg, type=''){
  const toast = $('#toast');
  toast.text(msg).removeClass('success error').addClass(type).addClass('show');
  setTimeout(()=>toast.removeClass('show'),3000);
}

// ===== PRODUCT CARD BUILDER =====
function buildProductCard(p, discount=0, oldPrice=0){
  const fav = getFavorites();
  const isFav = fav.some(f=>f.id===p.id);
  const rating = p.rating ? p.rating.rate : 4.0;
  const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5-Math.round(rating));
  return `<div class="product-card" data-id="${p.id}">
    ${discount ? `<span class="badge-sale">-${discount}%</span>` : ''}
    <button class="fav-btn ${isFav?'active':''}" onclick="toggleFavorite(${p.id})"><i class="fa fa-heart"></i></button>
    <a href="product-detail.html?id=${p.id}">
      <div class="product-img"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.title.substring(0,45)}${p.title.length>45?'...':''}</h3>
        <div class="product-rating">${stars} <span>(${p.rating?.count||0})</span></div>
        <div class="product-price">
          $${p.price.toFixed(2)}
          ${discount ? `<span class="old-price">$${oldPrice}</span>` : ''}
        </div>
      </div>
    </a>
    <button class="btn-add-cart" onclick="addToCart(${p.id})"><i class="fa fa-cart-plus"></i> Add to Cart</button>
  </div>`;
}

// ===== MISC =====
function toggleMenu(){
  $('#mobileMenu').toggleClass('open');
}

$(window).scroll(function(){
  if($(this).scrollTop()>300){ $('#backToTop').addClass('visible'); }
  else { $('#backToTop').removeClass('visible'); }
});

$(document).ready(function(){ updateBadges(); });
