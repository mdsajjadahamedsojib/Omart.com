// Function to switch main product image via thumbnails
function changeImage(element) {
    document.getElementById('main-product-image').src = element.src;
    let thumbnails = document.querySelectorAll('.thumb-img');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// Function to select product color variant
let selectedColor = '#3b82f6';
function selectColor(element) {
    let colors = document.querySelectorAll('.color-dot');
    colors.forEach(color => color.classList.remove('selected'));
    element.classList.add('selected');
    selectedColor = element.style.backgroundColor;
}

// Function to select product size variant
let selectedSize = 'M';
function selectSize(element) {
    let sizes = document.querySelectorAll('.size-btn');
    sizes.forEach(size => size.classList.remove('selected'));
    element.classList.add('selected');
    selectedSize = element.innerText;
}

// Global variable to track current product & unit price
let currentProduct = null;
let unitPriceBDT = 0;

// Quantity counter & Total Price Update
function updateQuantity(change) {
    let qtyInput = document.getElementById('qty-count');
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
        totalPriceEl.innerText = `${unitPriceBDT * qty} Tk`;
    }
}

// ---------------- CART SLIDER & LOCAL STORAGE LOGIC ---------------- //

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

function addToCart() {
    if (!currentProduct) return;

    let qty = parseInt(document.getElementById('qty-count').value) || 1;
    let cart = getCart();

    const existingIndex = cart.findIndex(item => item.id === currentProduct.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({
            id: currentProduct.id,
            title: currentProduct.title,
            price: unitPriceBDT,
            thumbnail: currentProduct.thumbnail || currentProduct.image,
            quantity: qty
        });
    }

    saveCart(cart);
    openCartSlider();
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateCartItemQty(index, change) {
    let cart = getCart();
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
}

// 1st Image এর মতো কার্ট আইটেম রেন্ডার করার লজিক
function renderCartDrawer() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal-price');
    const cartCountTitle = document.getElementById('cart-count-title');
    const headerCartCount = document.querySelector('.cart-section .cart-count');

    let totalCount = 0;
    let totalPrice = 0;

    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: #666;">Your cart is empty.</p>';
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
                        
                        <!-- Product Image -->
                        <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <img src="${imgSrc}" alt="${item.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>

                        <!-- Product Title & Controls -->
                        <div style="flex: 1;">
                            <h4 style="font-size: 14px; font-weight: 700; color: #2563eb; margin: 0 0 6px 0; line-height: 1.2;">
                                ${item.title}
                            </h4>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <button onclick="updateCartItemQty(${index}, -1)" 
                                    style="width: 22px; height: 22px; border-radius: 50%; background-color: #00adef; color: white; border: none; font-size: 14px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1;">
                                    -
                                </button>
                                <span style="font-size: 13px; font-weight: 600; color: #111;">${item.quantity}</span>
                                <button onclick="updateCartItemQty(${index}, 1)" 
                                    style="width: 22px; height: 22px; border-radius: 50%; background-color: #00adef; color: white; border: none; font-size: 14px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1;">
                                    +
                                </button>
                            </div>
                        </div>

                        <!-- Price -->
                        <div style="font-size: 13px; font-weight: 700; color: #111; white-space: nowrap;">
                            ${item.price} TK
                        </div>

                        <!-- Blue Trash Icon -->
                        <button onclick="removeFromCart(${index})" 
                            style="background: none; border: none; color: #2563eb; cursor: pointer; font-size: 16px; padding: 4px; display: flex; align-items: center;">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>
                `;
            }).join('');
        }
    }

    if (subtotalEl) subtotalEl.innerText = `${totalPrice} TK`;
    if (cartCountTitle) cartCountTitle.innerText = `(${totalCount})`;
    if (headerCartCount) headerCartCount.innerText = totalCount;
}

// ---------------- EVENT LISTENERS FOR CART DRAWER ---------------- //

document.addEventListener('DOMContentLoaded', () => {
    renderCartDrawer();

    const cartBtn = document.querySelector('.cart-section a.nav-btn');
    const closeBtn = document.getElementById('cart-close-id');
    const backdrop = document.getElementById('cart-backdrop');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartSlider();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCartSlider);
    if (backdrop) backdrop.addEventListener('click', closeCartSlider);
});

// ---------------- DATA FETCHING ---------------- //

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || 1;

fetch(`https://dummyjson.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        currentProduct = product;
        displayProductDetails(product);
        fetchRelatedProducts(product.category, product.id);
    })
    .catch(err => console.error("Error fetching product details:", err));

function displayProductDetails(product) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) mainImg.src = product.thumbnail;
    
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    if (thumbnailContainer && product.images) {
        thumbnailContainer.innerHTML = '';
        product.images.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.className = `thumb-img ${index === 0 ? 'active' : ''}`;
            img.src = imgUrl;
            img.alt = product.title;
            img.onclick = function() { changeImage(this); };
            thumbnailContainer.appendChild(img);
        });
    }
    
    unitPriceBDT = Math.round(product.price * 60);
    document.querySelector('.product-title').innerText = product.title;
    document.querySelector('.brand-name').innerText = product.brand || "PREMIUM BRAND";
    document.querySelector('.price-tag').innerText = `${unitPriceBDT} Tk`;
    document.querySelector('.product-desc').innerText = product.description;

    document.getElementById('qty-count').value = 1;
    updateTotalPrice(1);

    const positiveReviews = product.reviews ? product.reviews.filter(rev => rev.rating >= 4) : [];

    const ratingSummary = document.querySelector('.rating-summary');
    if (ratingSummary) {
        let stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
        ratingSummary.innerHTML = `
            <span class="stars" style="color: #f59e0b;">${stars}</span>
            <span class="review-count">(${positiveReviews.length} Top Reviews)</span>
        `;
    }

    const specsTable = document.querySelector('.specs-table');
    if (specsTable) {
        specsTable.innerHTML = `
            <tr>
                <td class="specs-label">Category</td>
                <td class="specs-value">${product.category.toUpperCase()}</td>
            </tr>
            <tr>
                <td class="specs-label">Stock Status</td>
                <td class="specs-value">${product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</td>
            </tr>
            <tr>
                <td class="specs-label">Rating</td>
                <td class="specs-value">${product.rating} / 5</td>
            </tr>
            <tr>
                <td class="specs-label">Warranty</td>
                <td class="specs-value">${product.warrantyInformation || '6 Months Warranty'}</td>
            </tr>
        `;
    }

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
            reviewsContainer.innerHTML += '<p class="no-reviews-text">No positive reviews available for this product.</p>';
        }
    }
}

function fetchRelatedProducts(category, currentId) {
    const sliderContainer = document.getElementById('related-product-list');
    if (!sliderContainer) return;

    fetch(`https://dummyjson.com/products/category/${category}`)
        .then(res => res.json())
        .then(data => {
            let relatedList = data.products.filter(item => item.id !== currentId);

            if (relatedList.length === 0) {
                fetch('https://dummyjson.com/products?limit=10')
                    .then(r => r.json())
                    .then(d => renderSlider(d.products.filter(item => item.id !== currentId)));
            } else {
                renderSlider(relatedList);
            }
        })
        .catch(err => console.error("Error loading related products:", err));
}

function renderSlider(products) {
    const slider = document.getElementById('related-product-list');
    if (!slider) return;

    slider.innerHTML = products.map(item => {
        const bdtPrice = Math.round(item.price * 60);
        return `
            <div class="related-card" onclick="goToProduct(${item.id})">
                <div class="related-img-holder">
                    <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                </div>
                <div class="related-info">
                    <h3 class="related-title" title="${item.title}">${item.title}</h3>
                    <div class="related-meta">
                        <span class="related-price">${bdtPrice} TK</span>
                        <span class="related-rating"><i class="fa-solid fa-star"></i> ${item.rating}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function goToProduct(id) {
    window.location.href = `ProductDetails.html?id=${id}`;
}

const prevBtn = document.getElementById('slide-prev');
const nextBtn = document.getElementById('slide-next');
const slider = document.getElementById('related-product-list');

if (nextBtn && slider) {
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 240, behavior: 'smooth' });
    });
}

if (prevBtn && slider) {
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -240, behavior: 'smooth' });
    });
}