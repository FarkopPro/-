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

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

    // Обработка форм
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь будет логика отправки формы
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }

    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь будет логика отправки отзыва
            showNotification('Спасибо за ваш отзыв!');
            this.reset();
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
}); 