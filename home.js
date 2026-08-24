//---------- HERO SECTION IMAGE SLIDER ----------//

const imageList = document.querySelector('.image-list');
const slideLeft = document.getElementById('slide-btn-left');
const slideRight = document.getElementById('slide-btn-right');

let currentIndex = 0;
let totalImages = 0;
let autoSlideInterval;

function slideImage(index) {
    const imageWidth = imageList.clientWidth;
    imageList.scrollLeft = index * imageWidth;
}

function nextSlide() {
    if (totalImages === 0) return;

    if (currentIndex < totalImages - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    slideImage(currentIndex);
}

function prevSlide() {
    if (totalImages === 0) return;

    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalImages - 1;
    }
    slideImage(currentIndex);
}

function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 3000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

async function loadHeroImages() {
    try {
        const response = await fetch('heroImg.json');
        if (!response.ok) throw new Error('Network error!');

        const imagesData = await response.json();

        imageList.innerHTML = imagesData.map(img => `
            <div class="image-item">
                <img src="${img.url}" alt="${img.alt}" class="responsive-img" />
            </div>
        `).join('');

        totalImages = imagesData.length;

        startAutoSlide();
    } catch (error) {
        console.error('Error fetching the hero images:', error);
    }
}

// Event Listeners

slideRight.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

slideLeft.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

window.addEventListener('resize', () => {
    slideImage(currentIndex);
});

loadHeroImages();




//---------- FETCHING DATA (1 product per category) ----------//

const productContainer = document.getElementById('product-container');
let allProducts = [];

async function loadEcomProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=0');
        if (!response.ok) throw new Error('Data could not be loaded from the API!');

        const data = await response.json();
        const rawProducts = data.products;

        // প্রতিটি ক্যাটাগরি ট্র্যাক করার জন্য Set
        const seenCategories = new Set();

        // শুধু যে ক্যাটাগরিগুলো আগে দেখা যায়নি, সেগুলোর প্রথম প্রোডাক্ট নেওয়া হচ্ছে
        allProducts = rawProducts.filter(product => {
            if (!seenCategories.has(product.category)) {
                seenCategories.add(product.category);
                return true; // নতুন ক্যাটাগরি হলে ১টি প্রোডাক্ট যোগ হবে
            }
            return false; // ক্যাটাগরি ইতোমধ্যে থাকলে স্কিপ করবে
        });

        renderProducts(allProducts);

    } catch (error) {
        console.error('Error:', error);
        if (productContainer) {
            productContainer.innerHTML = `<p style="color: red; padding: 20px;">
            There was a problem loading the products.</p>`;
        }
    }
}

// Function to render the product
function renderProducts(products) {
    if (!productContainer) return;

    if (products.length === 0) {
        productContainer.innerHTML = `<p style="padding: 20px; color: black; text-align:center; width:100%;">
        connection error 404...!</p>`;
        return;
    }

    productContainer.innerHTML = products.map(product => {

        // Rating Logic
        let rating = product.rating;
        const integerPart = Math.floor(rating);
        const decimalPart = rating - integerPart;

        if (decimalPart > 0.5) {
            rating = integerPart + 0.5;
        } else {
            rating = parseFloat(rating.toFixed(1));
        }

        // Star Generation Logic
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

        const halfPriceInBDT = Math.round(product.price * 60);

        return `
            <div class="card-product" onclick="goToProductDetails(${product.id})">

                <div class="card-heading flex">
                    <h1>${product.title}</h1>
                </div>

                <div class="card-img flex">
                    <img src="${product.thumbnail}" alt="${product.title}" />
                </div>

                <div class="product-category flex">
                    <p>${product.category.toUpperCase()}</p>
                </div>

                <div class="card-description">
                    <span class="flex">
                        ${starsHTML}
                        <p>${rating}</p>
                    </span>
                    <h4>Price: ${halfPriceInBDT} Tk</h4>
                </div>

                <div class="cart-btn flex">
                    <a href="javascript:void(0)">See more</a>
                </div>

            </div>
        `;
    }).join('');
}

// Product details navigation
function goToProductDetails(productId) {
    window.location.href = `ProductDetailsPage/ProductDetails.html?id=${productId}`;
}

loadEcomProducts();




//---------- PRODUCT SLIDER JS CODE ----------//

(function () {
    const proImgContainer = document.querySelector('.product-slider-img-container');
    const proBtnLeft = document.querySelector('.slider-btn-left');
    const proBtnRight = document.querySelector('.slider-btn-right');

    const slideAmount = 250;

    if (proBtnRight && proImgContainer) {
        proBtnRight.addEventListener('click', () => {
            proImgContainer.scrollBy({
                left: slideAmount,
                behavior: 'smooth'
            });
        });
    }

    if (proBtnLeft && proImgContainer) {
        proBtnLeft.addEventListener('click', () => {
            proImgContainer.scrollBy({
                left: -slideAmount,
                behavior: 'smooth'
            });
        });
    }
})();




//---------- BACK TO TOP BUTTON JS CODE ----------//

const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}