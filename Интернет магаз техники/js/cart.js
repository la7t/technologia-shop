// Корзина
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    addItem(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);

        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            if (existingItem.quantity > product.stock) {
                existingItem.quantity = product.stock;
            }
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }

        this.save();
        this.updateCartCount();
        this.updateCartModal();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartCount();
        this.updateCartModal();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);

        if (item && product) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else if (quantity <= product.stock) {
                item.quantity = quantity;
                this.save();
                this.updateCartCount();
                this.updateCartModal();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.save();
        this.updateCartCount();
        this.updateCartModal();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getCount();
        }
    }

    updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartItems) return;

        cartItems.innerHTML = '';

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Корзина пуста</p>';
            if (cartTotal) cartTotal.textContent = '0 ₽';
            return;
        }

        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
            `;

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.5rem;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.25rem 0; font-size: 1rem;">${item.name}</h4>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button class="cart-item-decrease" data-id="${item.id}" style="background: none; border: none; cursor: pointer; font-size: 1.25rem;">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="${products.find(p => p.id === item.id)?.stock || 10}" class="cart-item-quantity" data-id="${item.id}" style="width: 50px; text-align: center; border: 1px solid #cbd5e1; border-radius: 0.25rem; padding: 0.25rem;">
                        <button class="cart-item-increase" data-id="${item.id}" style="background: none; border: none; cursor: pointer; font-size: 1.25rem;">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${formatPrice(item.price * item.quantity)} ₽</div>
                    <button class="cart-item-remove" data-id="${item.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.875rem;">Удалить</button>
                </div>
            `;

            cartItems.appendChild(cartItem);
        });

        if (cartTotal) {
            cartTotal.textContent = `${formatPrice(this.getTotal())} ₽`;
        }

        // Добавляем обработчики событий для элементов корзины
        cartItems.querySelectorAll('.cart-item-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const item = this.items.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });

        cartItems.querySelectorAll('.cart-item-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const item = this.items.find(item => item.id === id);
                const product = products.find(p => p.id === id);
                if (item && product && item.quantity < product.stock) {
                    this.updateQuantity(id, item.quantity + 1);
                }
            });
        });

        cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.removeItem(id);
            });
        });

        cartItems.querySelectorAll('.cart-item-quantity').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const quantity = parseInt(e.target.value);
                this.updateQuantity(id, quantity);
            });
        });
    }

    setupEventListeners() {
        // Открытие корзины
        const cartButton = document.getElementById('cartButton');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.getElementById('closeCart');

        if (cartButton && cartModal) {
            cartButton.addEventListener('click', () => {
                cartModal.classList.add('active');
                this.updateCartModal();
            });
        }

        if (closeCart && cartModal) {
            closeCart.addEventListener('click', () => {
                cartModal.classList.remove('active');
            });
        }

        // Закрытие корзины при клике вне её
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.classList.remove('active');
                }
            });
        }

        // Оформление заказа
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (this.items.length === 0) {
                    alert('Корзина пуста');
                    return;
                }

                cartModal.classList.remove('active');
                document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}

// Глобальный экземпляр корзины
const cart = new Cart();

// Функция для добавления в корзину (используется в main.js)
function addToCart(productId, quantity = 1) {
    cart.addItem(productId, quantity);
}