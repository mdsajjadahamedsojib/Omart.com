//---------- LOGIN POPUP SECTION ----------//

let popup = document.getElementById("popup");
let backdrop = document.getElementById("backdrop");

function openPopup() {
    popup.classList.add("open-popup");
    backdrop.classList.add("open-backdrop");
}

function closePopup() {
    popup.classList.remove("open-popup");
    backdrop.classList.remove("open-backdrop");
}


//---------- NAVLIST ELEMENT COLOR CHENGER ----------//

const currentPath = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll('.nav-list-element li a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    } else if (currentPath === "" && link.getAttribute('href') === "index.html") {
        link.classList.add('active');
    }
});






//---------- NAVLIST POPUP SECTION ----------//

let navlistPopup = document.getElementById("navlist-popup");

function openNavlistPopup() {
    navlistPopup.classList.add("open-navlist-popup");
}

function closeNavlistPopup() {
    navlistPopup.classList.remove("open-navlist-popup");
}








//---------- OMART UNIVERSAL CART SYSTEM WITH FLY ANIMATION ----------//

(function () {
    let cart = JSON.parse(localStorage.getItem('omart_cart')) || [];

    // ১. কার্ট স্লাইডার ওপেন / ক্লোজ
    function toggleCart(forceState = null) {
        const slider = document.getElementById('cart-slider');
        const backdrop = document.getElementById('cart-backdrop');
        if (slider) {
            slider.classList.toggle('active', forceState !== null ? forceState : undefined);
        }
        if (backdrop) {
            backdrop.classList.toggle('active', forceState !== null ? forceState : undefined);
        }
    }

    // ২. Fly to Cart Animation Function
    function animateFlyToCart(imgElement) {
        const cartIcon = document.querySelector('.cart-section');
        if (!cartIcon || !imgElement) return;

        // প্রোডাক্ট ছবি এবং হেডার কার্ট আইকনের পজিশন নির্ণয়
        const imgRect = imgElement.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        // ডুপ্লিকেট ফ্লাইং ইমেজ তৈরি
        const flyingImg = document.createElement('img');
        flyingImg.src = imgElement.src;
        flyingImg.className = 'fly-to-cart-img';

        // প্রাথমিক পজিশন সেট (প্রোডাক্ট ছবির গায়ে)
        flyingImg.style.top = `${imgRect.top}px`;
        flyingImg.style.left = `${imgRect.left}px`;
        flyingImg.style.width = `${imgRect.width}px`;
        flyingImg.style.height = `${imgRect.height}px`;

        document.body.appendChild(flyingImg);

        // অ্যানিমেশন ট্রিগার (পরের ফ্রেমে পজিশন পরিবর্তন)
        requestAnimationFrame(() => {
            flyingImg.style.top = `${cartRect.top + (cartRect.height / 2) - 15}px`;
            flyingImg.style.left = `${cartRect.left + (cartRect.width / 2) - 15}px`;
            flyingImg.style.width = '30px';
            flyingImg.style.height = '30px';
            flyingImg.style.opacity = '0.3';
        });

        // অ্যানিমেশন শেষে ফ্লাইং এলিমেন্ট ডিলিট এবং কার্ট আইকনে Bounce ইফেক্ট
        setTimeout(() => {
            flyingImg.remove();
            cartIcon.classList.add('cart-icon-bounce');
            setTimeout(() => {
                cartIcon.classList.remove('cart-icon-bounce');
            }, 400);
        }, 800);
    }

    // ৩. কার্ট UI ও হেডার ব্যাজ আপডেট
    function updateCartUI() {
        localStorage.setItem('omart_cart', JSON.stringify(cart));

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        // হেডার কার্ট কাউন্ট ব্যাজ
        const navBtn = document.querySelector('.cart-section .nav-btn');
        if (navBtn) {
            let badge = document.getElementById('nav-cart-count');
            if (!badge) {
                badge = document.createElement('span');
                badge.id = 'nav-cart-count';
                navBtn.style.position = 'relative';
                navBtn.appendChild(badge);
            }
            badge.innerText = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }

        const countTitle = document.getElementById('cart-count-title');
        const subtotal = document.getElementById('cart-subtotal-price');
        const container = document.getElementById('cart-items-container');

        if (countTitle) countTitle.innerText = `(${totalItems})`;
        if (subtotal) subtotal.innerText = `${totalPrice} TK`;

        if (container) {
            if (cart.length === 0) {
                container.innerHTML = `<p style="text-align:center; padding:40px 0; color:#888;">Your cart is empty!</p>`;
                return;
            }

            container.innerHTML = cart.map((item, index) => {
                let imgSrc = item.thumbnail || item.image || '';
                return `
                    <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 2px solid #00adef; gap: 10px;">
                        <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <img src="${imgSrc}" alt="${item.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <div style="flex: 1;">
                            <h4 style="font-size: 14px; font-weight: 700; color: #2563eb; margin: 0 0 6px 0; line-height: 1.2;">${item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}</h4>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <button class="q-minus" data-index="${index}" style="width: 22px; height: 22px; border-radius: 50%; background-color: #00adef; color: white; border: none; cursor: pointer;">-</button>
                                <span style="font-size: 13px; font-weight: 600;">${item.quantity}</span>
                                <button class="q-plus" data-index="${index}" style="width: 22px; height: 22px; border-radius: 50%; background-color: #00adef; color: white; border: none; cursor: pointer;">+</button>
                            </div>
                        </div>
                        <div style="font-size: 13px; font-weight: 700;">${item.price} TK</div>
                        <button class="delete-item-btn" data-index="${index}" style="background: none; border: none; color: #2563eb; cursor: pointer; font-size: 16px;">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                `;
            }).join('');
        }
    }

    // ৪. গ্লোবাল ইভেন্ট লিসেনার
    document.addEventListener('click', function (e) {
        // কার্ট ওপেন (হেডার কার্ট আইকনে ক্লিক)
        if (e.target.closest('.cart-section')) {
            e.preventDefault();
            toggleCart(true);
            return;
        }

        // কার্ট ক্লোজ
        if (e.target.closest('#cart-close-id') || e.target.closest('#cart-backdrop')) {
            toggleCart(false);
            return;
        }

        // চেকআউট বাটন
        if (e.target.closest('#checkout-btn-id')) {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                alert('Proceeding to Checkout!');
            }
            return;
        }

        // কার্টের ভেতরের +, - ও ডিলিট বাটন
        const actionBtn = e.target.closest('.q-plus, .q-minus, .delete-item-btn');
        if (actionBtn && e.target.closest('#cart-items-container')) {
            const index = parseInt(actionBtn.getAttribute('data-index'), 10);
            if (actionBtn.classList.contains('q-plus')) {
                cart[index].quantity += 1;
            } else if (actionBtn.classList.contains('q-minus')) {
                cart[index].quantity -= 1;
                if (cart[index].quantity <= 0) cart.splice(index, 1);
            } else if (actionBtn.classList.contains('delete-item-btn')) {
                cart.splice(index, 1);
            }
            updateCartUI();
            return;
        }

        // Add to Cart বাটন হ্যান্ডলার
        const addBtn = e.target.closest('.add-to-cart .btn, .add-to-cart, #add-to-cart-btn, .add-cart-btn');
        if (addBtn) {
            e.preventDefault();
            e.stopPropagation();

            const productContainer = addBtn.closest(
                '.product-container, .flash-sale-product-container, .fashion-product-container, .search-filter-product-container, .product-card, main, body'
            );
            if (!productContainer) return;

            const titleEl = productContainer.querySelector(
                '.product-title, .flash-sale-product-details p, .fashion-product-details p, .search-filter-product-details p, h1, h2, h3'
            );
            const titleFull = titleEl ? titleEl.innerText : 'Product';
            const title = titleFull.length > 35 ? titleFull.substring(0, 35) + '...' : titleFull.split(' - ')[0].trim();

            const priceEl = productContainer.querySelector(
                '.price-tag, .flash-sale-product-ratings h4, .fashion-product-ratings h4, .search-filter-product-ratings h4, .price, #product-price'
            );
            const priceText = priceEl ? priceEl.innerText : '0';
            const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

            const imgEl = productContainer.querySelector(
                '#main-product-image, .flash-sale-product-offer img, .fashion-product-offer img, .search-filter-product-offer img, img'
            );
            const thumbnail = imgEl ? imgEl.src : '';

            const qtyInput = productContainer.querySelector('#qty-count, .qty-input, input[type="number"]');
            const qtyToAdd = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

            // ফ্লাই অ্যানিমেশন ট্রিগার
            if (imgEl) {
                animateFlyToCart(imgEl);
            }

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += qtyToAdd;
            } else {
                cart.push({ title, price, thumbnail, quantity: qtyToAdd });
            }

            // অ্যানিমেশন চলাকালীন কিছুটা সময় পর ব্যাকগ্রাউন্ডে কার্ট ও কাউন্ট আপডেট হবে
            setTimeout(() => {
                updateCartUI();
            }, 750);
        }
    });

    document.addEventListener('DOMContentLoaded', updateCartUI);
    updateCartUI();
})();









//---------- DARK MODE TOGGLE ----------//

let darkModeBtn = document.getElementById("dark-mode");
let sunIcon = document.getElementById("sunicon");
let moonIcon = document.getElementById("moonicon");

if (localStorage.getItem("theme") === "dark") {
    enableDarkMode();
} else {
    disableDarkMode();
}

darkModeBtn.onclick = function() {
    if (document.body.classList.contains("dark-theme")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add("dark-theme");
    moonIcon.style.display = "none";
    sunIcon.style.display = "inline-block";
    localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
    document.body.classList.remove("dark-theme");
    moonIcon.style.display = "inline-block";
    sunIcon.style.display = "none";
    localStorage.setItem("theme", "light");
}

