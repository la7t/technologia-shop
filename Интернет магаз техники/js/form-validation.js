// Валидация формы заказа

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('orderForm')) {
        initOrderForm();
    }
});

function initOrderForm() {
    const form = document.getElementById('orderForm');
    const deliverySelect = document.getElementById('deliveryType');
    const addressFields = document.getElementById('addressFields');
    const successModal = document.getElementById('successModal');
    const closeSuccess = document.getElementById('closeSuccess');

    // Генерация HTML для формы
    form.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="firstName" class="form-label">Имя *</label>
                <input type="text" id="firstName" name="firstName" class="form-input" required>
                <div class="error-message" id="firstNameError">Введите имя</div>
            </div>
            
            <div class="form-group">
                <label for="lastName" class="form-label">Фамилия *</label>
                <input type="text" id="lastName" name="lastName" class="form-input" required>
                <div class="error-message" id="lastNameError">Введите фамилию</div>
            </div>
        </div>
        
        <div class="form-group">
            <label for="phone" class="form-label">Телефон *</label>
            <input type="tel" id="phone" name="phone" class="form-input" 
                   pattern="[+]?[0-9\\s\\-\\(\\)]+" 
                   placeholder="+7 (999) 123-45-67" required>
            <div class="error-message" id="phoneError">Введите корректный номер телефона</div>
        </div>
        
        <div class="form-group">
            <label for="email" class="form-label">Email *</label>
            <input type="email" id="email" name="email" class="form-input" required>
            <div class="error-message" id="emailError">Введите корректный email</div>
        </div>
        
        <div class="form-group">
            <label for="deliveryType" class="form-label">Способ получения *</label>
            <select id="deliveryType" name="deliveryType" class="form-select" required>
                <option value="">Выберите способ</option>
                <option value="pickup">Самовывоз</option>
                <option value="delivery">Доставка</option>
            </select>
        </div>
        
        <div id="addressFields" class="hidden">
            <div class="form-group">
                <label for="address" class="form-label">Адрес доставки *</label>
                <input type="text" id="address" name="address" class="form-input">
                <div class="error-message" id="addressError">Введите адрес доставки</div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="city" class="form-label">Город *</label>
                    <input type="text" id="city" name="city" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="zipCode" class="form-label">Индекс</label>
                    <input type="text" id="zipCode" name="zipCode" class="form-input">
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <label for="productSelect" class="form-label">Товар</label>
            <select id="productSelect" name="productSelect" class="form-select">
                <option value="">Выберите товар из корзины</option>
                ${products.map(p => `<option value="${p.id}">${p.name} - ${formatPrice(p.price)} ₽</option>`).join('')}
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">Дополнительные услуги</label>
            <div class="checkbox-group">
                <input type="checkbox" id="giftWrap" name="giftWrap" class="checkbox-input">
                <label for="giftWrap" class="checkbox-label">Подарочная упаковка (+500 ₽)</label>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="insurance" name="insurance" class="checkbox-input">
                <label for="insurance" class="checkbox-label">Страховка (+1000 ₽)</label>
            </div>
        </div>
        
        <div class="form-group">
            <label for="quantity" class="form-label">Количество *</label>
            <div class="quantity-selector">
                <button type="button" class="quantity-btn" id="decreaseQty">-</button>
                <input type="number" id="quantity" name="quantity" class="quantity-input" value="1" min="1" max="10">
                <button type="button" class="quantity-btn" id="increaseQty">+</button>
            </div>
        </div>
        
        <div class="form-group">
            <label for="comment" class="form-label">Комментарий к заказу</label>
            <textarea id="comment" name="comment" class="form-textarea" rows="4" 
                      placeholder="Дополнительные пожелания..."></textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">Загрузить файл (необязательно)</label>
            <div class="file-input-wrapper">
                <input type="file" id="file" name="file" class="file-input" accept=".jpg,.jpeg,.png,.pdf">
                <label for="file" class="file-input-label">
                    📎 Перетащите файл или нажмите для выбора
                </label>
            </div>
        </div>
        
        <div class="form-group">
            <div class="checkbox-group">
                <input type="checkbox" id="privacyPolicy" name="privacyPolicy" class="checkbox-input" required>
                <label for="privacyPolicy" class="checkbox-label">
                    Я согласен на обработку персональных данных в соответствии с 
                    <a href="#" style="color: var(--color-primary);">Политикой конфиденциальности</a> *
                </label>
            </div>
            <div class="error-message" id="privacyError">Необходимо согласие на обработку данных</div>
        </div>
        
        <div class="form-group">
            <div class="checkbox-group">
                <input type="checkbox" id="newsletter" name="newsletter" class="checkbox-input">
                <label for="newsletter" class="checkbox-label">
                    Хочу получать информацию о новых товарах и акциях
                </label>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="submit" class="btn btn--primary">Оформить заказ</button>
            <button type="button" class="btn" id="clearCart">Очистить корзину</button>
        </div>
    `;

    // Обработчик выбора способа доставки
    deliverySelect.addEventListener('change', function () {
        if (this.value === 'delivery') {
            addressFields.classList.remove('hidden');
            document.getElementById('address').required = true;
        } else {
            addressFields.classList.add('hidden');
            document.getElementById('address').required = false;
        }
    });

    // Обработчик счётчика количества
    document.getElementById('increaseQty').addEventListener('click', function () {
        const input = document.getElementById('quantity');
        let value = parseInt(input.value);
        if (value < 10) {
            input.value = value + 1;
        }
    });

    document.getElementById('decreaseQty').addEventListener('click', function () {
        const input = document.getElementById('quantity');
        let value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
        }
    });

    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.id}Error`);
            if (errorElement) {
                errorElement.classList.remove('show');
                input.classList.remove('error');
            }
        });
    });

    // Обработчик отправки формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            const orderData = collectFormData();
            submitOrder(orderData);
        }
    });

    // Очистка корзины
    document.getElementById('clearCart').addEventListener('click', function () {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            cart.clear();
            showNotification('Корзина очищена');
        }
    });

    // Закрытие модального окна успеха
    if (closeSuccess && successModal) {
        closeSuccess.addEventListener('click', () => {
            successModal.classList.remove('active');
        });

        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }
}

// Валидация поля
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Проверка обязательных полей
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }

    // Проверка email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный email';
        }
    }

    // Проверка телефона
    if (field.id === 'phone' && value) {
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
        const digitsOnly = value.replace(/\D/g, '');
        if (!phoneRegex.test(value) || digitsOnly.length < 10) {
            isValid = false;
            errorMessage = 'Введите корректный номер телефона';
        }
    }

    // Обновление состояния поля
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.classList.add('error');
        } else {
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
    }

    return isValid;
}

// Валидация всей формы
function validateForm() {
    const form = document.getElementById('orderForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });

    // Проверка чекбокса согласия
    const privacyCheckbox = document.getElementById('privacyPolicy');
    if (!privacyCheckbox.checked) {
        document.getElementById('privacyError').classList.add('show');
        isValid = false;
    }

    return isValid;
}

// Сбор данных формы
function collectFormData() {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Добавляем товары из корзины
    data.cartItems = cart.items;
    data.totalAmount = cart.getTotal();

    // Генерация номера заказа
    const now = new Date();
    const orderNumber = `TECH-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    data.orderNumber = orderNumber;
    data.orderDate = now.toISOString();

    return data;
}

// Отправка заказа
function submitOrder(orderData) {
    // Здесь обычно отправка на сервер
    // Для демонстрации просто показываем модальное окно

    // Обновляем номер заказа в модальном окне
    document.getElementById('orderNumber').textContent = orderData.orderNumber;

    // Показываем модальное окно успеха
    document.getElementById('successModal').classList.add('active');

    // Очищаем корзину
    cart.clear();

    // Сбрасываем форму
    document.getElementById('orderForm').reset();
    document.getElementById('addressFields').classList.add('hidden');

    // Можно добавить отправку на сервер:
    /*
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showSuccessModal(data.orderNumber);
        cart.clear();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка при оформлении заказа');
    });
    */
}