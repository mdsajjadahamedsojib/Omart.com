// ProductDetailsPage/ProductDetails.js

let currentProduct = null;
let unitPriceBDT = 0;
let selectedColor = '#3b82f6';
let selectedSize = 'M';

// ১. পেজ লোড হওয়া মাত্র URL থেকে ID নিয়ে ডেটা ফেচ
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId);
    } else {
        // যদি সরাসরি কেউ পেজে আসে তবে ডিফল্ট ১ নম্বর প্রোডাক্ট দেখাবে
        fetchProductDetails(1);
    }

    renderCartDrawer();
    setupCartEvents();
});

// ২. DummyJSON থেকে প্রোডাক্ট ডেটা লোড
async function fetchProductDetails(id) {
    try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error("Product fetch failed!");
        
        const product = await res.json();
        currentProduct = product;

        displayProductDetails(product);
        fetchRelatedProducts(product.category, product.id);
    } catch (err) {
        console.error("Error fetching product details:", err);
    }
}

// ৩. ডিটেইলস পেজের UI-তে ডেটা প্রদর্শন (Safety Check সহ)
function displayProductDetails(product) {
    // মেইন ইমেজ
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) {
        mainImg.src = product.thumbnail || (product.images && product.images[0]) || '';
    }
    
    // থাম্বনেইল গ্যালারি
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    if (thumbnailContainer && product.images && product.images.length > 0) {
        thumbnailContainer.innerHTML = '';
        product.images.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.className = `thumb-img ${index === 0 ? 'active' : ''}`;
            img.src = imgUrl;
            img.alt = product.title;
            img.style.cursor = 'pointer';
            img.onclick = function() { changeImage(this); };
            thumbnailContainer.appendChild(img);
        });
    }
    
    // ফ্যাশন পেজের সাথে মিল রেখে প্রাইস হিসাব (BDT)
    const originalPrice = product.price; 
    const discountPercentage = product.discountPercentage || 0; 
    const discountedPriceInUSD = originalPrice - (originalPrice * (discountPercentage / 100));
    unitPriceBDT = Math.round(discountedPriceInUSD * 120);

    // টাইটেল, প্রাইস, ব্র্যান্ড, ডেসক্রিপশন সেট করা
    const titleEl = document.querySelector('.product-title');
    const brandEl = document.querySelector('.brand-name');
    const priceEl = document.querySelector('.price-tag');
    const descEl = document.querySelector('.product-desc');
    const qtyInput = document.getElementById('qty-count');

    if (titleEl) titleEl.innerText = product.title;
    if (brandEl) brandEl.innerText = product.brand || (product.category ? product.category.toUpperCase() : "PREMIUM");
    if (priceEl) priceEl.innerText = `${unitPriceBDT} TK`;
    if (descEl) descEl.innerText = product.description;
    if (qtyInput) qtyInput.value = 1;

    updateTotalPrice(1);

    // স্টার ও রিভিউ
    const positiveReviews = product.reviews ? product.reviews.filter(rev => rev.rating >= 4) : [];
    const ratingSummary = document.querySelector('.rating-summary');
    if (ratingSummary) {
        let stars = '★'.repeat(Math.round(product.rating || 5)) + '☆'.repeat(5 - Math.round(product.rating || 5));
        ratingSummary.innerHTML = `
            <span class="stars" style="color: #f59e0b;">${stars}</span>
            <span class="review-count">(${positiveReviews.length} Top Reviews)</span>
        `;
    }

    // স্পেসিফিকেশন টেবিল
    const specsTable = document.querySelector('.specs-table');
    if (specsTable) {
        specsTable.innerHTML = `
            <tr><td class="specs-label">Category</td><td class="specs-value">${(product.category || '').toUpperCase()}</td></tr>
            <tr><td class="specs-label">Stock Status</td><td class="specs-value">${product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</td></tr>
            <tr><td class="specs-label">Rating</td><td class="specs-value">${product.rating} / 5</td></tr>
            <tr><td class="specs-label">Warranty</td><td class="specs-value">${product.warrantyInformation || '6 Months Warranty'}</td></tr>
        `;
    }

    // রিভিউ সেকশন
    const reviewsContainer = document.querySelector('.reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '<h2 class="section-title">Customer Reviews</h2>';
        if (positiveReviews.length > 0) {
            positiveReviews.forEach(review => {
                let stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                const card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML = `
                    <div class="reviewer-info">
                        <span class="reviewer-name">${review.reviewerName} <span class="review-stars" style="color: #f59e0b;">${stars}</span></span>
                        <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <p class="review-text">${review.comment}</p>
                `;
                reviewsContainer.appendChild(card);
            });
        } else {
            reviewsContainer.innerHTML += '<p class="no-reviews-text">No reviews available for this product.</p>';
        }
    }
}

// ৪. ইমেজ থাম্বনেইল পরিবর্তন
function changeImage(element) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) mainImg.src = element.src;
    document.querySelectorAll('.thumb-img').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// কালার ও সাইজ সিলেক্ট
function selectColor(element) {
    document.querySelectorAll('.color-dot').forEach(color => color.classList.remove('selected'));
    element.classList.add('selected');
    selectedColor = element.style.backgroundColor;
}

function selectSize(element) {
    document.querySelectorAll('.size-btn').forEach(size => size.classList.remove('selected'));
    element.classList.add('selected');
    selectedSize = element.innerText;
}

// কোয়ান্টিটি পরিবর্তন
function updateQuantity(change) {
    let qtyInput = document.getElementById('qty-count');
    if (!qtyInput) return;
    let currentQty = parseInt(qtyInput.value) || 1;
    let newQty = currentQty + change;
    
    if (newQty >= 1) {
        qtyInput.value = newQty;
        updateTotalPrice(newQty);
    }
}

function updateTotalPrice(qty) {
    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl && unitPriceBDT > 0) {
        totalPriceEl.innerText = `${unitPriceBDT * qty} TK`;
    }
}

// ৫. কার্ট হ্যান্ডলার (Local Storage সিঙ্ক)
function getCart() {
    return JSON.parse(localStorage.getItem('omart_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('omart_cart', JSON.stringify(cart));
    renderCartDrawer();
}

function openCartSlider() {
    const slider = document.getElementById('cart-slider');
    const backdrop = document.getElementById('cart-backdrop');
    if (slider) slider.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
}

function closeCartSlider() {
    const slider = document.getElementById('cart-slider');
    const backdrop = document.getElementById('cart-backdrop');
    if (slider) slider.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
}

function addToCart(buyNow = false) {
    if (!currentProduct) return;

    const qtyInput = document.getElementById('qty-count');
    let qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    let cart = getCart();

    const existingIndex = cart.findIndex(item => item.title === currentProduct.title);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({
            id: currentProduct.id,
            title: currentProduct.title,
            price: unitPriceBDT,
            thumbnail: currentProduct.thumbnail || (currentProduct.images ? currentProduct.images[0] : ''),
            quantity: qty,
            color: selectedColor,
            size: selectedSize
        });
    }

    saveCart(cart);
    openCartSlider();

    if (buyNow) {
        const checkoutBtn = document.getElementById('checkout-btn-id');
        if (checkoutBtn) checkoutBtn.click();
    }
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateCartItemQty(index, change) {
    let cart = getCart();
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart);
}

// কার্ট স্লাইডারের ডেটা রেন্ডার
function renderCartDrawer() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal-price');
    const cartCountTitle = document.getElementById('cart-count-title');
    const navBtn = document.querySelector('.cart-section .nav-btn');
    let navBadge = document.getElementById('nav-cart-count');

    let totalCount = 0;
    let totalPrice = 0;

    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align:center; padding: 30px; color: #666;">Your cart is empty.</p>';
        } else {
            cartContainer.innerHTML = cart.map((item, index) => {
                totalCount += item.quantity;
                totalPrice += item.price * item.quantity;
                
                let imgSrc = item.thumbnail || item.image;
                if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('../') && !imgSrc.startsWith('./')) {
                    imgSrc = `../${imgSrc}`;
                }

                return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 2px solid #00adef; gap: 10px;">
                        <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <img src="${imgSrc}" alt="${item.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <div style="flex: 1;">
                            <h4 style="font-size: 14px; font-weight: 700; color: #2563eb; margin: 0 0 6px 0; line-height: 1.2;">${item.title.substring(0, 18)}...</h4>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <button onclick="updateCartItemQty(${index}, -1)" style="width: 22px; height: 22px; border-radius: 50%; background-color: #00adef; color: white; border: none; cursor: pointer;">-</button>
                                <span style="font-size: 13px; font-weight: 600;">${item.quantity}</span>
                                <button onclick="updateCartItemQty(${index}, 1)" style="width: 22px; height: 22px; border-radius: 50%; background-color: #00adef; color: white; border: none; cursor: pointer;">+</button>
                            </div>
                        </div>
                        <div style="font-size: 13px; font-weight: 700;">${item.price} TK</div>
                        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #2563eb; cursor: pointer; font-size: 16px;">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                `;
            }).join('');
        }
    }

    if (subtotalEl) subtotalEl.innerText = `${totalPrice} TK`;
    if (cartCountTitle) cartCountTitle.innerText = `(${totalCount})`;
    
    if (navBtn) {
        if (!navBadge) {
            navBadge = document.createElement('span');
            navBadge.id = 'nav-cart-count';
            navBtn.style.position = 'relative';
            navBtn.appendChild(navBadge);
        }
        navBadge.innerText = totalCount;
        navBadge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }
}

function setupCartEvents() {
    const cartBtn = document.querySelector('.cart-section');
    const closeBtn = document.getElementById('cart-close-id');
    const backdrop = document.getElementById('cart-backdrop');
    const checkoutBtn = document.getElementById('checkout-btn-id');

    if (cartBtn) cartBtn.addEventListener('click', (e) => { e.preventDefault(); openCartSlider(); });
    if (closeBtn) closeBtn.addEventListener('click', closeCartSlider);
    if (backdrop) backdrop.addEventListener('click', closeCartSlider);

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Proceeding to Checkout!');
        });
    }
}

// ৬. রিলেটেড প্রোডাক্ট লোড
async function fetchRelatedProducts(category, currentId) {
    const sliderContainer = document.getElementById('related-product-list');
    if (!sliderContainer) return;

    try {
        const res = await fetch(`https://dummyjson.com/products/category/${category}`);
        const data = await res.json();
        let relatedList = data.products.filter(item => item.id !== currentId);
        
        sliderContainer.innerHTML = relatedList.map(item => {
            const bdtPrice = Math.round((item.price - (item.price * ((item.discountPercentage || 0) / 100))) * 120);
            return `
                <div class="related-card" onclick="goToProduct(${item.id})" style="cursor: pointer;">
                    <div class="related-img-holder">
                        <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                    </div>
                    <div class="related-info">
                        <h3 class="related-title" style="font-size:13px;">${item.title.substring(0, 16)}...</h3>
                        <div class="related-meta">
                            <span class="related-price" style="font-weight:bold; color:#2563eb;">${bdtPrice} TK</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Related product error:", e);
    }
}

// ডিটেইলস পেজের রিলেটেড প্রোডাক্ট ক্লিক হ্যান্ডলার
function goToProduct(id) {
    window.location.href = `ProductDetails.html?id=${id}`;
}