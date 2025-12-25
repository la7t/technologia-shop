// Галерея с переходами между изображениями

document.addEventListener('DOMContentLoaded', function () {
    console.log('Gallery script loaded');

    // Массив изображений галереи (обновленный с вашими путями)
    const galleryImages = [
        // Смартфоны
        {
            id: 1,
            src: "images/products/iphone15.webp",
            fallback: "images/products/iphone15.jpg",
            alt: "iPhone 15 Pro - фронтальный вид",
            title: "iPhone 15 Pro",
            description: "Новый флагманский смартфон с процессором A17 Pro и камерой 48 МП",
            category: "smartphones"
        },
        {
            id: 2,
            src: "images/products/iphone15-3.webp", // Замените на другое фото iPhone
            fallback: "images/products/iphone15-3.jpg",
            alt: "iPhone 15 Pro - вид сбоку",
            title: "iPhone 15 Pro - Вид сбоку",
            description: "Титановый корпус и динамический остров",
            category: "smartphones"
        },
        {
            id: 3,
            src: "images/products/iphone15-2.webp", // Замените на третье фото iPhone
            fallback: "images/products/iphone15-2.jpg",
            alt: "iPhone 15 Pro - задняя панель",
            title: "iPhone 15 Pro - Задняя панель",
            description: "Система камер Pro с телеобъективом",
            category: "smartphones"
        },

        // Ноутбуки
        {
            id: 4,
            src: "images/products/macbook.webp",
            fallback: "images/products/macbook.jpg",
            alt: "MacBook Air M2 - открытый вид",
            title: "MacBook Air M2",
            description: "Ультратонкий ноутбук с чипом Apple M2 и дисплеем Liquid Retina",
            category: "laptops"
        },
        {
            id: 5,
            src: "images/products/macbook-2.webp", // Замените на другое фото MacBook
            fallback: "images/products/macbook-2.jpg",
            alt: "MacBook Air M2 - профиль",
            title: "MacBook Air M2 - Профиль",
            description: "Толщина всего 1.13 см, вес 1.24 кг",
            category: "laptops"
        },

        // Наушники
        {
            id: 6,
            src: "images/products/sony-headphones.webp",
            fallback: "images/products/sony-headphones.jpg",
            alt: "Sony WH-1000XM5 - фронтальный вид",
            title: "Sony WH-1000XM5",
            description: "Беспроводные наушники с активным шумоподавлением 8 микрофонами",
            category: "headphones"
        },
        {
            id: 7,
            src: "images/products/sony-headphones-2.webp", // Замените на другое фото
            fallback: "images/products/sony-headphones-2.jpg",
            alt: "Sony WH-1000XM5 - в сложенном виде",
            title: "Sony WH-1000XM5 - В сложенном виде",
            description: "Компактное хранение в чехле",
            category: "headphones"
        },

        // Планшеты
        {
            id: 8,
            src: "images/products/ipad-pro.webp",
            fallback: "images/products/ipad-pro.jpg",
            alt: "iPad Pro 12.9 - с Apple Pencil",
            title: "iPad Pro 12.9",
            description: "Планшет с дисплеем Liquid Retina XDR и поддержкой Apple Pencil 2",
            category: "tablets"
        },
        {
            id: 9,
            src: "images/products/ipad-pro-2.webp", // Замените на другое фото
            fallback: "images/products/ipad-pro-2.jpg",
            alt: "iPad Pro 12.9 - боковой профиль",
            title: "iPad Pro 12.9 - Профиль",
            description: "Тонкий алюминиевый корпус",
            category: "tablets"
        },

        // Часы
        {
            id: 10,
            src: "images/products/apple-watch.webp",
            fallback: "images/products/apple-watch.jpg",
            alt: "Apple Watch Series 9 - на руке",
            title: "Apple Watch Series 9",
            description: "Умные часы с функцией Always-On дисплея и датчиком кислорода в крови",
            category: "wearables"
        },
        {
            id: 11,
            src: "images/products/apple-watch-2.webp", // Замените на другое фото
            fallback: "images/products/apple-watch-2.jpg",
            alt: "Apple Watch Series 9 - разные ремешки",
            title: "Apple Watch Series 9 - Ремешки",
            description: "Разнообразие сменных ремешков",
            category: "wearables"
        },

        // Игровые консоли
        {
            id: 12,
            src: "images/products/ps5.webp",
            fallback: "images/products/ps5.jpg",
            alt: "PlayStation 5 - вертикальная установка",
            title: "PlayStation 5",
            description: "Игровая консоль нового поколения с 4K Blu-ray приводом",
            category: "gaming"
        },
        {
            id: 13,
            src: "images/products/ps5-2.webp", // Замените на другое фото
            fallback: "images/products/ps5-2.jpg",
            alt: "PlayStation 5 - с контроллерами",
            title: "PlayStation 5 - Контроллеры",
            description: "Контроллер DualSense с тактильной отдачей",
            category: "gaming"
        },
    ];

    // Переменные состояния
    let currentFilter = 'all';
    let currentImageIndex = 0;
    let filteredImages = [...galleryImages];
    let isTransitioning = false;

    // Инициализация
    initGallery();

    function initGallery() {
        renderGallery();
        setupEventListeners();
        setupLazyLoading();

        // Автоматически показываем первое изображение в лайтбоксе для демо
        setTimeout(() => {
            // Не открываем автоматически, только инициализируем
            console.log('Gallery initialized with', galleryImages.length, 'images');
        }, 500);
    }

    function renderGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        // Фильтруем изображения
        if (currentFilter === 'all') {
            filteredImages = [...galleryImages];
        } else {
            filteredImages = galleryImages.filter(img => img.category === currentFilter);
        }

        galleryGrid.innerHTML = '';

        filteredImages.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryGrid.appendChild(galleryItem);
        });

        updateImageCounter();
    }

    function createGalleryItem(image, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.id = image.id;
        galleryItem.dataset.index = index;

        // Определяем эмодзи для категории
        const categoryEmoji = {
            'smartphones': '📱',
            'laptops': '💻',
            'headphones': '🎧',
            'tablets': '📱',
            'wearables': '⌚',
            'gaming': '🎮'
        }[image.category] || '📷';

        galleryItem.innerHTML = `
            <img 
                src="${image.src}" 
                alt="${image.alt}" 
                loading="lazy"
                onerror="this.onerror=null; this.src='${image.fallback}'">
            <div class="gallery-item__info">
                <span class="gallery-item__category">${categoryEmoji} ${getCategoryName(image.category)}</span>
                <h3 class="gallery-item__title">${image.title}</h3>
            </div>
        `;

        galleryItem.addEventListener('click', () => openLightbox(index));

        return galleryItem;
    }

    function getCategoryName(category) {
        const names = {
            'smartphones': 'Смартфоны',
            'laptops': 'Ноутбуки',
            'headphones': 'Наушники',
            'tablets': 'Планшеты',
            'wearables': 'Часы',
            'gaming': 'Игровые консоли'
        };
        return names[category] || category;
    }

    function setupEventListeners() {
        // Фильтры
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('active')) return;

                // Обновляем активную кнопку
                document.querySelectorAll('.filter-btn').forEach(btn =>
                    btn.classList.remove('active'));
                button.classList.add('active');

                // Применяем фильтр
                currentFilter = button.dataset.filter;
                renderGallery();
            });
        });

        // Лайтбокс элементы
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const lightbox = document.getElementById('lightbox');

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Навигация клавишами
            document.addEventListener('keydown', handleKeyNavigation);
        }

        // Свайпы для мобильных устройств
        setupSwipeGestures();
    }

    function handleKeyNavigation(e) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    function setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Свайп влево - следующее изображение
                    showNextImage();
                } else {
                    // Свайп вправо - предыдущее изображение
                    showPrevImage();
                }
            }
        }
    }

    function openLightbox(index) {
        if (isTransitioning) return;

        currentImageIndex = parseInt(index);
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxDescription = document.getElementById('lightboxDescription');

        if (!lightbox || !lightboxImage) return;

        const image = filteredImages[currentImageIndex];

        // Предзагрузка изображения
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            if (lightboxTitle) lightboxTitle.textContent = image.title;
            if (lightboxDescription) lightboxDescription.textContent = image.description;

            updateImageCounter();

            // Показываем лайтбокс с анимацией
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Добавляем анимацию появления
            lightboxImage.style.animation = 'lightboxFadeIn 0.3s ease';
            setTimeout(() => {
                lightboxImage.style.animation = '';
            }, 300);
        };

        img.onerror = () => {
            // Если WebP не загрузился, используем fallback
            lightboxImage.src = image.fallback;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }

    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        // Анимация закрытия
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.classList.remove('active');
            lightbox.style.opacity = '1';
            document.body.style.overflow = '';
        }, 300);
    }

    function showPrevImage() {
        if (isTransitioning || filteredImages.length <= 1) return;

        isTransitioning = true;
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        transitionImage('prev');
    }

    function showNextImage() {
        if (isTransitioning || filteredImages.length <= 1) return;

        isTransitioning = true;
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        transitionImage('next');
    }

    function transitionImage(direction) {
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxDescription = document.getElementById('lightboxDescription');

        if (!lightboxImage) {
            isTransitioning = false;
            return;
        }

        const image = filteredImages[currentImageIndex];

        // Анимация исчезновения текущего изображения
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = direction === 'next'
            ? 'translateX(-20px)'
            : 'translateX(20px)';

        setTimeout(() => {
            // Меняем изображение
            const img = new Image();
            img.src = image.src;

            img.onload = () => {
                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;

                if (lightboxTitle) lightboxTitle.textContent = image.title;
                if (lightboxDescription) lightboxDescription.textContent = image.description;

                updateImageCounter();

                // Анимация появления нового изображения
                lightboxImage.style.opacity = '1';
                lightboxImage.style.transform = 'translateX(0)';
                lightboxImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                setTimeout(() => {
                    lightboxImage.style.transition = '';
                    isTransitioning = false;
                }, 300);
            };

            img.onerror = () => {
                // Fallback если WebP не загрузился
                lightboxImage.src = image.fallback;
                lightboxImage.style.opacity = '1';
                lightboxImage.style.transform = 'translateX(0)';
                lightboxImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                setTimeout(() => {
                    lightboxImage.style.transition = '';
                    isTransitioning = false;
                }, 300);
            };
        }, 200);
    }

    function updateImageCounter() {
        const currentElement = document.getElementById('currentImage');
        const totalElement = document.getElementById('totalImages');

        if (currentElement) {
            currentElement.textContent = currentImageIndex + 1;
        }

        if (totalElement) {
            totalElement.textContent = filteredImages.length;
        }
    }

    function setupLazyLoading() {
        // Используем Intersection Observer для ленивой загрузки
        const observerOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && !img.getAttribute('data-loaded')) {
                        // Изображение загружается при попадании в viewport
                        img.setAttribute('data-loaded', 'true');

                        // Можно добавить эффект плавного появления
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';

                        setTimeout(() => {
                            img.style.opacity = '1';
                        }, 100);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за всеми элементами галереи
        document.querySelectorAll('.gallery-item').forEach(item => {
            observer.observe(item);
        });
    }

    // Экспортируем функции для отладки
    window.galleryDebug = {
        getCurrentImage: () => filteredImages[currentImageIndex],
        getFilteredCount: () => filteredImages.length,
        getCurrentIndex: () => currentImageIndex,
        getAllImages: () => galleryImages
    };
});