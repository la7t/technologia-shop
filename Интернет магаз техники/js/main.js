// Основной JavaScript файл

document.addEventListener('DOMContentLoaded', function () {
    // Инициализация мобильного меню
    initMobileMenu();

    // Инициализация продуктов
    initProducts();

    // Инициализация галереи (если есть на странице)
    if (document.querySelector('.gallery-grid')) {
        initGallery();
    }

    // Инициализация формы
    if (document.getElementById('orderForm')) {
        initOrderForm();
    }
});

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// Продукты
const products = [
    {
        id: 1,
        name: "Смартфон iPhone 15 Pro",
        description: "Новый флагманский смартфон с процессором A17 Pro",
        price: 99990,
        image: "images/products/iphone15.webp",
        category: "smartphones",
        stock: 15
    },
    {
        id: 2,
        name: "Ноутбук MacBook Air M2",
        description: "Ультратонкий ноутбук с чипом Apple M2",
        price: 129990,
        image: "images/products/macbook.webp",
        category: "laptops",
        stock: 8
    },
    {
        id: 3,
        name: "Наушники Sony WH-1000XM5",
        description: "Беспроводные наушники с активным шумоподавлением",
        price: 34990,
        image: "images/products/sony-headphones.webp",
        category: "headphones",
        stock: 25
    },
    {
        id: 4,
        name: "Планшет iPad Pro 12.9",
        description: "Мощный планшет с дисплеем Liquid Retina XDR",
        price: 119990,
        image: "images/products/ipad-pro.webp",
        category: "tablets",
        stock: 12
    },
    {
        id: 5,
        name: "Часы Apple Watch Series 9",
        description: "Умные часы с функцией Always-On дисплея",
        price: 42990,
        image: "images/products/apple-watch.webp",
        category: "wearables",
        stock: 30
    },
    {
        id: 6,
        name: "Игровая консоль PlayStation 5",
        description: "Новейшая игровая консоль от Sony",
        price: 64990,
        image: "images/products/ps5.webp",
        category: "gaming",
        stock: 5
    }
];

function initProducts() {
    const productsGrid = document.getElementById('productsGrid');

    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
        <div class="product-card__content">
            <h3 class="product-card__title">${product.name}</h3>
            <p class="product-card__description">${product.description}</p>
            <div class="product-card__footer">
                <div class="product-card__price">${formatPrice(product.price)} ₽</div>
                <div class="quantity-selector">
                    <button class="quantity-btn minus" data-action="decrease">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="${product.stock}">
                    <button class="quantity-btn plus" data-action="increase">+</button>
                </div>
            </div>
            <button class="btn btn--primary add-to-cart" style="width: 100%; margin-top: 1rem;">
                Добавить в корзину
            </button>
            <div class="stock-info" style="margin-top: 0.5rem; font-size: 0.875rem; color: #666;">
                В наличии: ${product.stock} шт.
            </div>
        </div>
    `;

    // Обработчики для счётчика
    const quantityInput = card.querySelector('.quantity-input');
    const minusBtn = card.querySelector('.minus');
    const plusBtn = card.querySelector('.plus');

    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < product.stock) {
            quantityInput.value = value + 1;
        }
    });

    // Обработчик добавления в корзину
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity);
        showNotification(`${product.name} добавлен в корзину!`);
    });

    return card;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавьте эти стили в CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);