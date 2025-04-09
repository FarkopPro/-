document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Плавная прокрутка к секциям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Закрываем мобильное меню при клике
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('price-card')) {
                    entry.target.style.transitionDelay = `${entry.target.dataset.delay}s`;
                }
            }
        });
    }, observerOptions);

    // Добавляем классы для анимации
    document.querySelectorAll('.service-card, .about-content, .contact-info, .contact-form, .price-card, .gallery-item').forEach((el, index) => {
        el.classList.add('fade-in');
        if (el.classList.contains('price-card')) {
            el.dataset.delay = index * 0.2;
        }
        observer.observe(el);
    });

    // Обработка формы обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Здесь можно добавить отправку данных на сервер
            // Например, через fetch API
            
            // Показываем сообщение об успешной отправке
            showNotification('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
            
            // Очищаем форму
            this.reset();
        });
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

    // Обработка формы отзыва
    const reviewForm = document.getElementById('reviewForm');
    const reviewsGrid = document.querySelector('.reviews-grid');

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (selectedRating === 0) {
            showNotification('Пожалуйста, поставьте оценку', 'error');
            return;
        }

        const name = this.querySelector('input[type="text"]').value;
        const text = this.querySelector('textarea').value;

        // Создаем новый отзыв
        const newReview = document.createElement('div');
        newReview.className = 'review-card fade-in';
        newReview.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="review-info">
                    <h4>${name}</h4>
                    <div class="review-rating">
                        ${Array(5).fill().map((_, i) => `
                            <i class="fas fa-star${i + 1 > selectedRating ? '-half-alt' : ''}"></i>
                        `).join('')}
                    </div>
                </div>
            </div>
            <p class="review-text">${text}</p>
        `;

        // Добавляем новый отзыв в начало сетки
        reviewsGrid.insertBefore(newReview, reviewsGrid.firstChild);

        // Очищаем форму
        this.reset();
        selectedRating = 0;
        highlightStars(0);

        // Показываем уведомление
        showNotification('Спасибо за ваш отзыв!', 'success');

        // Анимируем появление нового отзыва
        setTimeout(() => {
            newReview.classList.add('visible');
        }, 100);
    });

    // Функция показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
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

    // Параллакс эффект для hero секции
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    }

    // Анимация счетчиков
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const prefix = counter.textContent.charAt(0);
        const suffix = counter.textContent.slice(-1);
        
        let count = 0;
        const updateCounter = () => {
            const increment = target / 200;
            if (count < target) {
                count += increment;
                if (count > target) count = target;
                counter.textContent = prefix + Math.floor(count) + (suffix === '%' ? '%' : '');
                requestAnimationFrame(updateCounter);
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });

    // FAQ аккордеон
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Закрываем все активные элементы
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Если элемент не был активен, открываем его
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

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