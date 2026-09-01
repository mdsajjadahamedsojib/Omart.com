document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // 1. GLOBAL HEADER SEARCH LOGIC
    // -------------------------------------------------------------
    function handleHeaderSearch(inputElement) {
        const query = inputElement.value.trim();
        if (query) {
            window.location.href = `../SearchFilterPage/SearchFilterPage.html?q=${encodeURIComponent(query)}`;
        }
    }

    // হেডারের সার্চ আইকন ক্লিক ইভেন্ট
    document.addEventListener('click', (e) => {
        const searchIcon = e.target.closest('.search-icon');
        if (searchIcon) {
            const navSearchBox = searchIcon.closest('.nav-search');
            if (navSearchBox) {
                const searchInput = navSearchBox.querySelector('.search-input');
                if (searchInput) {
                    handleHeaderSearch(searchInput);
                }
            }
        }
    });

    // হেডারের ইনপুট বক্সে Enter চাপলে
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('search-input')) {
            handleHeaderSearch(e.target);
        }
    });


    // -------------------------------------------------------------
    // 2. FETCH & RENDER FOR SEARCH FILTER SECTION
    // -------------------------------------------------------------
    const productSection = document.querySelector('.search-filter-product-section') || document.getElementById('search-filter-section');
    const searchTitle = document.getElementById('search-title');

    if (productSection) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q') || '';

        // হেডারের ইনপুট বক্সে সার্চ করার টেক্সট ধরে রাখা
        const headerSearchInput = document.querySelector('.search-input');
        if (headerSearchInput && searchQuery) {
            headerSearchInput.value = searchQuery;
        }

        if (searchQuery) {
            if (searchTitle) searchTitle.textContent = `Search Results for: "${searchQuery}"`;
            fetchProductsByCategoryOrQuery(searchQuery);
        } else {
            if (searchTitle) searchTitle.textContent = "Please enter a search term.";
        }
    }

    // স্মার্ট ক্যাটাগরি ও সাধারণ সার্চ ফাংশন
    async function fetchProductsByCategoryOrQuery(query) {
        try {
            productSection.innerHTML = '<p style="text-align:center; width:100%; color:#555;">Loading products...</p>';
            
            const cleanQuery = query.toLowerCase().trim();

            // ১. ক্যাটাগরি হিসেবে সার্চ করার চেষ্টা
            const categoryRes = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(cleanQuery)}`);
            
            if (categoryRes.ok) {
                const categoryData = await categoryRes.json();
                if (categoryData.products && categoryData.products.length > 0) {
                    renderProducts(categoryData.products);
                    return;
                }
            }

            // ২. ক্যাটাগরি না মিললে স্বাভাবিক টাইটেল/সার্চ এনডপয়েন্টে ফলব্যাক করা
            const searchRes = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
            const searchData = await searchRes.json();

            renderProducts(searchData.products);

        } catch (error) {
            console.error('Error fetching data:', error);
            productSection.innerHTML = '<p style="text-align:center; color:red; width:100%;">Failed to load products. Try again later.</p>';
        }
    }

    // ডাইনামিক কার্ড রেন্ডারিং (Product Details Link সহ)
    function renderProducts(products) {
        productSection.innerHTML = '';

        if (!products || products.length === 0) {
            productSection.innerHTML = '<p style="text-align:center; width:100%;">No products found matching your search.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('search-filter-product-container');
            // প্রোডাক্ট আইডি সেট করা হলো
            card.setAttribute('data-id', product.id);

            const starsHTML = generateRatingStars(product.rating);
            // Product Details Page Relative URL
            const detailsUrl = `../ProductDetailsPage/ProductDetails.html?id=${product.id}`;

            card.innerHTML = `
                <div class="search-filter-product-offer">
                    <span class="flex">${Math.round(product.discountPercentage)}% off</span>
                    <a href="${detailsUrl}">
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </a>
                </div>

                <div class="search-filter-product-details">
                    <a href="${detailsUrl}" style="text-decoration:none; color:inherit;">
                        <p>${product.title}</p>
                    </a>
                </div>

                <div class="search-filter-product-ratings flex">
                    <div class="product-ratings flex">
                        ${starsHTML}
                        <p>${product.rating}</p>
                    </div>
                    <h4>Price : $${product.price}</h4>
                </div>

                <div class="add-to-cart flex">
                    <button class="btn" type="button">
                        <h4>Add to cart</h4>
                    </button>
                </div>
            `;

            productSection.appendChild(card);
        });
    }

    // হাফ-স্টার সহ dynamic rating generator
    function generateRatingStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = (rating % 1) >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fa-solid fa-star icon1"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fa-solid fa-star-half-stroke icon1"></i>';
            } else {
                stars += '<i class="fa-regular fa-star icon1"></i>';
            }
        }
        return stars;
    }

    // -------------------------------------------------------------
    // 3. PRODUCT CLICK EVENT DELEGATION (CARD CLICK FALLBACK)
    // -------------------------------------------------------------
    document.addEventListener('click', (e) => {
        // Add to Cart বাটনে ক্লিক করলে ডিটেইলস পেজে রিডাইরেক্ট হবে না
        if (e.target.closest('.add-to-cart, .btn')) return;

        const productCard = e.target.closest('.search-filter-product-container');
        if (productCard) {
            const productId = productCard.getAttribute('data-id');
            if (productId) {
                window.location.href = `../ProductDetailsPage/ProductDetails.html?id=${productId}`;
            }
        }
    });

});