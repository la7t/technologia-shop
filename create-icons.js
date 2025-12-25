// Скрипт для создания иконок всех размеров
console.log(`
🎯 СОЗДАНИЕ ИКОНОК ДЛЯ ТЕХНОЛОГИИ:

1. Основные файлы:
   - images/icons/logo.svg          (основной логотип)
   - images/icons/favicon.ico       (иконка вкладки 32x32)
   - images/icons/apple-touch-icon.png (для iOS 180x180)

2. Дополнительные размеры для PWA:
   - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

3. Рекомендуемые инструменты:
   - Для создания: https://www.canva.com/
   - Для конвертации: https://convertio.co/
   - Для оптимизации: https://squoosh.app/

4. Инструкция:
   а) Создайте логотип в Canva или другом редакторе
   б) Экспортируйте как SVG
   в) Конвертируйте в нужные форматы
   г) Разместите в папке images/icons/
   
5. Альтернатива - используйте готовые иконки:
   📱 Можно скачать готовый набор иконок по ссылке:
   https://www.flaticon.com/packs/technology-267/
`);

// Автоматическая проверка структуры
const fs = require('fs');
const path = require('path');

function checkIconStructure() {
    const basePath = './images/icons/';
    const requiredIcons = [
        'logo.svg',
        'favicon.ico',
        'apple-touch-icon.png',
        'icon-192x192.png',
        'icon-512x512.png'
    ];

    console.log('Проверка структуры иконок:');
    console.log('=========================');

    requiredIcons.forEach(icon => {
        const iconPath = path.join(basePath, icon);
        if (fs.existsSync(iconPath)) {
            console.log(`✅ ${icon}`);
        } else {
            console.log(`❌ ${icon} - отсутствует`);
        }
    });
}

// Если запускается в Node.js
if (typeof window === 'undefined') {
    checkIconStructure();
}