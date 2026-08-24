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








//---------- OMART UNIVERSAL CART SYSTEM ----------//

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

    // ২. কার্ট UI ও হেডার ব্যাজ আপডেট
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
        }

        const countTitle = document.getElementById('cart-count-title');
        const subtotal = document.getElementById('cart-subtotal-price');
        const container = document.getElementById('cart-items-container');

        if (countTitle) countTitle.innerText = totalItems;
        if (subtotal) subtotal.innerText = `${totalPrice} TK`;

        if (container) {
            if (cart.length === 0) {
                container.innerHTML = `<p style="text-align:center; padding:40px 0; color:#888;">Your cart is empty!</p>`;
                return;
            }

            container.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.thumbnail}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>${item.price} TK</p>
                        <div class="quantity-controls">
                            <button class="q-minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="q-plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="delete-item-btn" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // ৩. গ্লোবাল ইভেন্ট লিসেনার
    document.addEventListener('click', function (e) {
        // কার্ট ওপেন
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

        // Add to Cart বাটন হ্যান্ডলার (Flash Sale, Fashion, Search-Filter ইত্যাদি সব পেজের জন্য)
        const addBtn = e.target.closest('.add-to-cart .btn, .add-to-cart');
        if (addBtn) {
            e.preventDefault();
            e.stopPropagation();

            // সব ধরনের প্রোডাক্ট কন্টেইনার সিলেক্টর
            const productContainer = addBtn.closest(
                '.flash-sale-product-container, .fashion-product-container, .search-filter-product-container, .product-card'
            );
            if (!productContainer) return;

            // ১. টাইটেল সংগ্রহ
            const titleEl = productContainer.querySelector(
                '.flash-sale-product-details p, .fashion-product-details p, .search-filter-product-details p, .product-title, h3, h4'
            );
            const titleFull = titleEl ? titleEl.innerText : 'Product';
            const title = titleFull.length > 35 ? titleFull.substring(0, 35) + '...' : titleFull.split(' - ')[0].trim();

            // ২. প্রাইস সংগ্রহ
            const priceEl = productContainer.querySelector(
                '.flash-sale-product-ratings h4, .fashion-product-ratings h4, .search-filter-product-ratings h4, .price'
            );
            const priceText = priceEl ? priceEl.innerText : '0';
            const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

            // ৩. ইমেজ সংগ্রহ
            const imgEl = productContainer.querySelector(
                '.flash-sale-product-offer img, .fashion-product-offer img, .search-filter-product-offer img, img'
            );
            const thumbnail = imgEl ? imgEl.src : '';

            // একই প্রোডাক্ট কি না যাচাই
            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ title, price, thumbnail, quantity: 1 });
            }

            updateCartUI();
            toggleCart(true);
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

