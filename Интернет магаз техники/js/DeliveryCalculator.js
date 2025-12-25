function calculateDelivery() {
    console.log('Кнопка нажата!'); // Это должно появиться в консоли при нажатии

    // Простой тест
    const testResult = `
        <div class="delivery-result__content">
            <h3 class="delivery-result__title">Тест расчета</h3>
            <div class="delivery-result__estimate">
                Доставка: 2-3 дня
            </div>
            <div class="delivery-result__details">
                <p>Это тестовый результат расчета</p>
                <p>Если это видно, значит кнопка работает!</p>
            </div>
        </div>
    `;

    resultDiv.innerHTML = testResult;
}