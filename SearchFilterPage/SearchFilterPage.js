// document.addEventListener('DOMContentLoaded', () => {

//     // -------------------------------------------------------------
//     // 1. GLOBAL HEADER SEARCH LOGIC
//     // -------------------------------------------------------------
//     function handleHeaderSearch(inputElement) {
//         const query = inputElement.value.trim();
//         if (query) {
//             window.location.href = `../SearchFilterPage/SearchFilterPage.html?q=${encodeURIComponent(query)}`;
//         }
//     }

//     // হেডারের সার্চ আইকন ক্লিক ইভেন্ট
//     document.addEventListener('click', (e) => {
//         const searchIcon = e.target.closest('.search-icon');
//         if (searchIcon) {
//             const navSearchBox = searchIcon.closest('.nav-search');
//             if (navSearchBox) {
//                 const searchInput = navSearchBox.querySelector('.search-input');
//                 if (searchInput) {
//                     handleHeaderSearch(searchInput);
//                 }
//             }
//         }
//     });

//     // হেডারের ইনপুট বক্সে Enter চাপলে
//     document.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter' && e.target.classList.contains('search-input')) {
//             handleHeaderSearch(e.target);
//         }
//     });


//     // -------------------------------------------------------------
//     // 2. FETCH (CATEGORY + TITLE/DESC) & RENDER LOGIC
//     // -------------------------------------------------------------
//     const productContainer = document.querySelector('.flash-sale-product-section') || document.getElementById('flash-sale-section');
//     const searchTitle = document.getElementById('search-title');

//     if (productContainer) {
//         const urlParams = new URLSearchParams(window.location.search);
//         const searchQuery = urlParams.get('q') || '';

//         // হেডারের ইনপুট বক্সে টেক্সট ধরে রাখা
//         const headerSearchInput = document.querySelector('.search-input');
//         if (headerSearchInput && searchQuery) {
//             headerSearchInput.value = searchQuery;
//         }

//         if (searchQuery) {
//             if (searchTitle) searchTitle.textContent = `Search Results for: "${searchQuery}"`;
//             fetchProductsByCategoryOrQuery(searchQuery);
//         } else {
//             if (searchTitle) searchTitle.textContent = "Please enter a search term.";
//         }
//     }

//     // স্মার্ট ক্যাটাগরি এবং জেনারেল সার্চ ফাংশন
//     async function fetchProductsByCategoryOrQuery(query) {
//         try {
//             productContainer.innerHTML = '<p style="text-align:center; width:100%; color:#555;">Loading products...</p>';
            
//             const cleanQuery = query.toLowerCase().trim();

//             // ১. ক্যাটাগরি সার্চ ট্রাই করা
//             const categoryRes = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(cleanQuery)}`);
            
//             if (categoryRes.ok) {
//                 const categoryData = await categoryRes.json();
//                 if (categoryData.products && categoryData.products.length > 0) {
//                     renderProducts(categoryData.products);
//                     return;
//                 }
//             }

//             // ২. ক্যাটাগরি না মিললে বা ফাঁকা আসলে নরমাল টাইটেল/সার্চ এনডপয়েন্টে ফলব্যাক করা
//             const searchRes = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
//             const searchData = await searchRes.json();

//             renderProducts(searchData.products);

//         } catch (error) {
//             console.error('Error fetching data:', error);
//             productContainer.innerHTML = '<p style="text-align:center; color:red; width:100%;">Failed to load products. Try again later.</p>';
//         }
//     }

//     // Flash Sale HTML Structure অনুযায়ী প্রডাক্ট রেন্ডার
//     function renderProducts(products) {
//         productContainer.innerHTML = '';

//         if (!products || products.length === 0) {
//             productContainer.innerHTML = '<p style="text-align:center; width:100%;">No products found matching your search.</p>';
//             return;
//         }

//         products.forEach(product => {
//             const card = document.createElement('div');
//             card.classList.add('flash-sale-product-container');

//             const starsHTML = generateRatingStars(product.rating);

//             card.innerHTML = `
//                 <div class="flash-sale-product-offer">
//                     <p class="flex"> <i class="fa-solid fa-fire-flame-curved"></i> Flash Sale</p>
//                     <span class="flex">${Math.round(product.discountPercentage)}% off</span>
//                     <img src="${product.thumbnail}" alt="${product.title}">
//                 </div>

//                 <div class="flash-sale-product-details">
//                     <p>${product.title}</p>
//                 </div>

//                 <div class="flash-sale-product-ratings flex">
//                     <div class="product-ratings flex">
//                         ${starsHTML}
//                         <p>${product.rating}</p>
//                     </div>
//                     <h4>Price : $${product.price}</h4>
//                 </div>

//                 <div class="add-to-cart flex">
//                     <button class="btn" type="button">
//                         <h4>Add to cart</h4>
//                     </button>
//                 </div>
//             `;

//             productContainer.appendChild(card);
//         });
//     }

//     // স্টার রেটিং জেনারেটর
//     function generateRatingStars(rating) {
//         let stars = '';
//         const fullStars = Math.floor(rating);
//         const hasHalfStar = (rating % 1) >= 0.5;

//         for (let i = 1; i <= 5; i++) {
//             if (i <= fullStars) {
//                 stars += '<i class="fa-solid fa-star icon1"></i>';
//             } else if (i === fullStars + 1 && hasHalfStar) {
//                 stars += '<i class="fa-solid fa-star-half-stroke icon1"></i>';
//             } else {
//                 stars += '<i class="fa-regular fa-star icon1"></i>';
//             }
//         }
//         return stars;
//     }
// });






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
    // মূল সেকশন কন্টেইনার সিলেক্ট করা
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

    // আপনার দেওয়া HTML Structure পুরোপুরি অনুকরণ করে ডাইনামিক কার্ড রেন্ডারিং
    function renderProducts(products) {
        productSection.innerHTML = '';

        if (!products || products.length === 0) {
            productSection.innerHTML = '<p style="text-align:center; width:100%;">No products found matching your search.</p>';
            return;
        }

        products.forEach(product => {
            // প্রতিটি প্রডাক্ট কার্ডের মূল ডিভ
            const card = document.createElement('div');
            card.classList.add('search-filter-product-container');

            const starsHTML = generateRatingStars(product.rating);

            // হুবহু আপনার চিহ্নিত HTML মার্কআপ অনুযায়ী ডাইনামিক ডেটা সেট
            card.innerHTML = `
                <div class="search-filter-product-offer">
                    <span class="flex">${Math.round(product.discountPercentage)}% off</span>
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>

                <div class="search-filter-product-details">
                    <p>${product.title}</p>
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
});