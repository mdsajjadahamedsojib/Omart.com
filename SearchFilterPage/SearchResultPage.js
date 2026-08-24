const productContainer = document.getElementById('product-container');
const searchInput = document.getElementById('searchInput');
const searchTitle = document.getElementById('search-title');

let allProducts = [];

// URL parameter (?q=keyword) পড়া
const urlParams = new URLSearchParams(window.location.search);
let currentQuery = urlParams.get('q') || '';

if (searchInput && currentQuery) {
    searchInput.value = currentQuery;
}

async function loadAndFilterProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=0');
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        allProducts = data.products;

        executeSearch(currentQuery);

    } catch (error) {
        console.error('Error:', error);
        if (productContainer) {
            productContainer.innerHTML = `<p style="color: red; text-align: center; width: 100%;">Problem loading products!</p>`;
        }
    }
}

function executeSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTitle) {
        searchTitle.innerText = searchTerm ? `Search Results for: "${query}"` : 'All Products';
    }

    if (searchTerm === '') {
        renderProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm) || 
        (p.description && p.description.toLowerCase().includes(searchTerm))
    );

    renderProducts(filtered);
}

function renderProducts(products) {
    if (!productContainer) return;

    if (products.length === 0) {
        productContainer.innerHTML = `<p style="padding: 20px; text-align: center; width:100%;">No products found!</p>`;
        return;
    }

    productContainer.innerHTML = products.map(product => {
        let rating = product.rating;
        const integerPart = Math.floor(rating); 
        const decimalPart = rating - integerPart; 

        if (decimalPart > 0.5) {
            rating = integerPart + 0.5;
        } else {
            rating = parseFloat(rating.toFixed(1));
        }

        const floorRating = Math.floor(rating);
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < floorRating) {
                starsHTML += '<i class="fa-solid fa-star icon1"></i>';
            } else if (i === floorRating && (rating % 1) >= 0.5) {
                starsHTML += '<i class="fa-solid fa-star-half-stroke icon1"></i>'; 
            } else {
                starsHTML += '<i class="fa-regular fa-star icon1"></i>'; 
            }
        }

        const priceInBDT = Math.round(product.price * 60);
        const discountPercentage = Math.round(product.discountPercentage || 10);

        return `
            <div class="product-card" onclick="goToProductDetails(${product.id})">
                <div class="card-badges">
                    <span class="badge flash-sale">🔥 Flash Sale</span>
                    <span class="badge discount">${discountPercentage}% off</span>
                </div>

                <div class="card-img-box">
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>

                <div class="card-content">
                    <h3 class="product-title" title="${product.title}">${product.title}</h3>
                    
                    <div class="rating-price-row">
                        <div class="rating">
                            <span class="stars">${starsHTML}</span>
                            <span class="rating-score">${rating}</span>
                        </div>
                        <div class="price">Price : ${priceInBDT} TK</div>
                    </div>

                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">Add to cart</button>
                </div>
            </div>
        `;
    }).join('');
}

function goToProductDetails(productId) {
    window.location.href = `../ProductDetailsPage/ProductDetails.html?id=${productId}`;
}

function addToCart(productId) {
    console.log(`Product ${productId} added to cart!`);
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        executeSearch(e.target.value);
    });
}

loadAndFilterProducts();