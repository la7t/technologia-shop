// Калькулятор доставки - упрощенная версия

document.addEventListener('DOMContentLoaded', function () {
    console.log('Delivery script is loading...');

    // Проверка, что DOM загружен
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOM fully loaded');

        // Проверка наличия элементов
        console.log('Calculate button:', document.getElementById('calculateDelivery'));
        console.log('Result div:', document.getElementById('deliveryResult'));
        console.log('City select:', document.getElementById('citySelect'));
    });
    console.log('Delivery script loaded'); // Для отладки

    const calculateBtn = document.getElementById('calculateDelivery');
    const citySelect = document.getElementById('citySelect');
    const deliveryTypeSelect = document.getElementById('deliveryTypeSelect');
    const resultDiv = document.getElementById('deliveryResult');

    if (!calculateBtn || !resultDiv) {
        console.error('Required elements not found!');
        return;
    }

    console.log('All elements found, setting up event listeners...');

    // Базы данных городов и сроков доставки
    const deliveryData = {
        cities: {
            'moscow': { name: 'Москва', standard: 1, express: 1, pickup: 0 },
            'saint-petersburg': { name: 'Санкт-Петербург', standard: 2, express: 1, pickup: 1 },
            'novosibirsk': { name: 'Новосибирск', standard: 5, express: 2, pickup: 2 },
            'ekaterinburg': { name: 'Екатеринбург', standard: 3, express: 2, pickup: 2 },
            'kazan': { name: 'Казань', standard: 2, express: 1, pickup: 1 },
            'nizhny-novgorod': { name: 'Нижний Новгород', standard: 2, express: 1, pickup: 1 },
            'chelyabinsk': { name: 'Челябинск', standard: 4, express: 2, pickup: 2 },
            'samara': { name: 'Самара', standard: 3, express: 2, pickup: 2 },
            'omsk': { name: 'Омск', standard: 5, express: 3, pickup: 3 },
            'rostov': { name: 'Ростов-на-Дону', standard: 3, express: 2, pickup: 2 },
            'ufa': { name: 'Уфа', standard: 4, express: 2, pickup: 2 },
            'krasnoyarsk': { name: 'Красноярск', standard: 6, express: 3, pickup: 3 },
            'voronezh': { name: 'Воронеж', standard: 2, express: 1, pickup: 1 },
            'perm': { name: 'Пермь', standard: 4, express: 2, pickup: 2 }
             },

        deliveryTypes: {
            'standard': { name: 'Стандартная доставка', price: 0 },
            'express': { name: 'Экспресс-доставка', price: 500 },
            'pickup': { name: 'Самовывоз', price: 0 }
        }
    };

    // Функция расчета даты доставки
    function calculateDeliveryDate(daysToAdd) {
        const now = new Date();
        const deliveryDate = new Date(now);

        // Добавляем дни (упрощенная версия без учета выходных)
        deliveryDate.setDate(deliveryDate.getDate() + Math.ceil(daysToAdd));

        return deliveryDate;
    }

    // Форматирование даты
    function formatDate(date) {
        const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const weekday = days[date.getDay()];

        return `${day} ${month} ${year} (${weekday})`;
    }

    // Функция получения текста для количества дней
    function getDaysText(days) {
        if (days === 0) return 'сегодня';
        if (days === 1) return '1 день';
        if (days >= 2 && days <= 4) return `${days} дня`;
        return `${days} дней`;
    }

    // Основная функция расчета
    function calculateDelivery() {
        console.log('Calculate button clicked!'); // Для отладки

        const cityId = citySelect.value;
        const deliveryType = deliveryTypeSelect.value;

        if (!cityId) {
            showMessage('Пожалуйста, выберите город для расчета доставки', 'info');
            return;
        }

        const city = deliveryData.cities[cityId];
        const delivery = deliveryData.deliveryTypes[deliveryType];

        if (!city || !delivery) {
            showMessage('Ошибка расчета. Пожалуйста, попробуйте еще раз.', 'error');
            return;
        }

        // Получаем количество дней для выбранного типа доставки
        const days = city[deliveryType];
        const deliveryDate = calculateDeliveryDate(days);
        const formattedDate = formatDate(deliveryDate);

        // Рассчитываем стоимость
        let price = delivery.price;
        if (deliveryType === 'standard' && days > 3) {
            price = 300;
        }

        // Показываем результат
        showResult(city, delivery, days, formattedDate, price);
    }

    // Функция показа сообщения
    function showMessage(message, type = 'info') {
        const icon = type === 'error' ? '⚠️' : 'ℹ️';
        const color = type === 'error' ? '#ef4444' : '#3b82f6';

        resultDiv.innerHTML = `
            <div class="delivery-result__content">
                <h3 class="delivery-result__title" style="color: ${color};">${icon} ${message}</h3>
            </div>
        `;
    }

    // Функция показа результата
    function showResult(city, delivery, days, date, price) {
        const daysText = getDaysText(days);

        resultDiv.innerHTML = `
            <div class="delivery-result__content">
                <h3 class="delivery-result__title">${city.name} - ${delivery.name}</h3>
                <div class="delivery-result__estimate">
                    Приблизительный срок: ${daysText}
                </div>
                
                <div class="delivery-result__details">
                    <p><strong>Дата доставки:</strong> ${date}</p>
                    <p><strong>Стоимость доставки:</strong> ${price === 0 ? 'Бесплатно' : price + ' ₽'}</p>
                    <p><strong>Тип доставки:</strong> ${delivery.name}</p>
                </div>
                
                <div class="delivery-result__date">
                    📅 ${date.split(' ')[0]} ${date.split(' ')[1]}
                </div>
            </div>
        `;
    }

    // Назначаем обработчик события на кнопку
    calculateBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем стандартное поведение
        calculateDelivery();
    });

    // Также рассчитываем при изменении выбора города
    citySelect.addEventListener('change', function () {
        if (this.value) {
            calculateDelivery();
        }
    });

    // И при изменении типа доставки
    deliveryTypeSelect.addEventListener('change', calculateDelivery);

    // Автоматически показываем расчет для Москвы при загрузке
    setTimeout(() => {
        citySelect.value = 'moscow';
        calculateDelivery();
    }, 500);

    console.log('Event listeners set up successfully');
});