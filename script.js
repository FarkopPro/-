document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Обработка кликов по кнопкам "Записаться"
    const serviceButtons = document.querySelectorAll('.service-link');
    console.log('Найдено кнопок:', serviceButtons.length);

    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке "Записаться"');
            
            // Получаем название услуги из заголовка карточки
            const serviceCard = this.closest('.service-card');
            const serviceTitle = serviceCard.querySelector('h3').textContent;
            console.log('Название услуги:', serviceTitle);
            
            // Находим форму
            const contactForm = document.querySelector('.contact-form');
            if (!contactForm) {
                console.error('Форма не найдена');
                return;
            }
            
            // Находим select с услугами
            const serviceSelect = contactForm.querySelector('select[name="service"]');
            if (!serviceSelect) {
                console.error('Select с услугами не найден');
                return;
            }
            
            // Маппинг названий услуг из карточек в значения select
            const serviceMapping = {
                'Установка фаркопов': 'Установка фаркопа',
                'Подключение электрики': 'Подключение электрики',
                'Ремонт прицепов': 'Ремонт прицепа'
            };
            
            // Получаем соответствующее значение для select
            const selectValue = serviceMapping[serviceTitle];
            console.log('Значение для select:', selectValue);
            
            if (selectValue) {
                // Устанавливаем значение в select
                Array.from(serviceSelect.options).forEach(option => {
                    if (option.text === selectValue) {
                        serviceSelect.value = option.value;
                        console.log('Установлено значение:', option.value);
                    }
                });
            } else {
                console.error('Не найдено соответствующее значение в маппинге');
            }
            
            // Плавно прокручиваем к форме
            const headerHeight = document.querySelector('header').offsetHeight;
            const formPosition = contactForm.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: formPosition,
                behavior: 'smooth'
            });
        });
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Специальная обработка для кнопки "Записаться на установку"
                if (targetId === '#contacts') {
                    // Получаем высоту шапки
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    // Находим форму
                    const form = target.querySelector('.contact-form');
                    if (form) {
                        // Прокручиваем так, чтобы форма была полностью видна
                        const formPosition = form.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: formPosition - headerHeight - 20,
                            behavior: 'smooth'
                        });
                    } else {
                        // Если форма не найдена, используем стандартную прокрутку
                        window.scrollTo({
                            top: target.offsetTop - headerHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // Для других ссылок используем стандартную прокрутку
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .about-content, .price-category, .gallery-item, .workflow-step, .review-card, .faq-item').forEach(el => {
        observer.observe(el);
    });

    // Обработка формы обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const service = this.querySelector('select[name="service"]').value;
            const message = this.querySelector('textarea[name="message"]').value || 'Не указано';

            // Формируем текст сообщения
            const text = `🔔 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n🔧 Услуга: ${service}\n💬 Сообщение: ${message}`;
            
            // Кодируем текст для URL
            const encodedText = encodeURIComponent(text);
            
            // Открываем WhatsApp с предзаполненным сообщением
            window.open(`https://wa.me/79823825858?text=${encodedText}`, '_blank');
            
            showNotification('Спасибо! Ваша заявка успешно отправлена.');
            contactForm.reset();
        });
    }

    // Обработка формы отзывов
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const rating = this.querySelector('.star-rating .active').dataset.rating;
            const message = this.querySelector('textarea').value;

            // Формируем текст сообщения
            const text = `⭐️ Новый отзыв с сайта!\n\n👤 Имя: ${name}\n⭐️ Оценка: ${rating}/5\n💬 Отзыв: ${message}`;
            
            // Кодируем текст для URL
            const encodedText = encodeURIComponent(text);
            
            // Открываем WhatsApp с предзаполненным сообщением
            window.open(`https://wa.me/79823825858?text=${encodedText}`, '_blank');
            
            showNotification('Спасибо за ваш отзыв!');
            reviewForm.reset();
        });
    }

    // FAQ аккордеон
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.style.maxHeight;
            
            // Закрываем все ответы
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.style.maxHeight = null;
            });
            
            // Открываем/закрываем выбранный ответ
            answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
            question.classList.toggle('active');
        });
    });

    // Функция показа уведомлений
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Адаптивная карта
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const updateMapSize = () => {
            const width = mapContainer.offsetWidth;
            const iframe = mapContainer.querySelector('iframe');
            if (iframe) {
                iframe.style.width = width + 'px';
            }
        };

        window.addEventListener('resize', updateMapSize);
        updateMapSize();
    }

    // Обработка звездного рейтинга
    const starRating = document.querySelector('.star-rating');
    const stars = starRating.querySelectorAll('i');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            highlightStars(rating);
        });

        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });

        star.addEventListener('click', function() {
            selectedRating = this.dataset.rating;
            highlightStars(selectedRating);
        });
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = star.dataset.rating;
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    // Анимация чисел в этапах работы
    const animateNumbers = () => {
        document.querySelectorAll('.stat-number').forEach(number => {
            const target = parseInt(number.getAttribute('data-count'));
            const duration = 2000;
            const step = target / duration * 10;
            let current = 0;
            
            const updateNumber = () => {
                current += step;
                if (current < target) {
                    number.textContent = Math.floor(current);
                    setTimeout(updateNumber, 10);
                } else {
                    number.textContent = target;
                }
            };
            
            updateNumber();
        });
    };

    // Запускаем анимацию при прокрутке до секции
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.about-stats').forEach(stats => {
        statsObserver.observe(stats);
    });

    // Обработка сворачивания/разворачивания цен
    document.querySelectorAll('.price-question').forEach(question => {
        question.addEventListener('click', () => {
            const category = question.parentElement;
            category.classList.toggle('active');
        });
    });

    // Обработка сворачивания формы отзывов
    const formHeader = document.querySelector('.form-header');
    if (formHeader) {
        formHeader.addEventListener('click', () => {
            const formContainer = formHeader.nextElementSibling;
            const toggleButton = formHeader.querySelector('.toggle-button');
            formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
            toggleButton.classList.toggle('active');
        });
    }

    // Кнопка прокрутки вверх
    const scrollToTopButton = document.querySelector('.scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Обработка переключения отзывов
    const toggleReviewsButton = document.getElementById('toggleReviews');
    const reviewsGrid = document.querySelector('.reviews-grid');
    let reviewsVisible = false;

    toggleReviewsButton.addEventListener('click', () => {
        reviewsVisible = !reviewsVisible;
        reviewsGrid.style.display = reviewsVisible ? 'grid' : 'none';
        toggleReviewsButton.classList.toggle('hidden');
        toggleReviewsButton.querySelector('span').textContent = reviewsVisible ? 'Скрыть отзывы' : 'Показать отзывы';
        toggleReviewsButton.querySelector('i').className = reviewsVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
    });

    // Обработка галереи
    const toggleGalleryButton = document.querySelector('.toggle-gallery-button');
    const galleryHidden = document.querySelector('.gallery-hidden');

    if (toggleGalleryButton && galleryHidden) {
        toggleGalleryButton.addEventListener('click', () => {
            galleryHidden.classList.toggle('visible');
            const isVisible = galleryHidden.classList.contains('visible');
            toggleGalleryButton.querySelector('span').textContent = isVisible ? 'Показать меньше фото' : 'Показать больше фото';
            toggleGalleryButton.classList.toggle('hidden');
        });
    }
}); 