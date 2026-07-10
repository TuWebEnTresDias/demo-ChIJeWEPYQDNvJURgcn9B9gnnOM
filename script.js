/* ========================================
   Bodegón Ballarati - JavaScript
   Interactividad: Header, Menú, Tabs, WhatsApp, Animaciones
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // HEADER - Cambio al hacer scroll
    // ========================================
    const header = document.getElementById('header');
    const scrollThreshold = 50;
    
    function handleHeaderScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Ejecutar al cargar
    
    // ========================================
    // HAMBURGER MENU - Menú mobile
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.header__nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Cerrar menú al hacer clic en un link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ========================================
    // SMOOTH SCROLL - Links internos
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // MENU TABS - Cambio de categoría
    // ========================================
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover active de todos los tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Agregar active al tab clickeado
            this.classList.add('active');
            
            // Obtener la categoría a mostrar
            const targetCategory = this.getAttribute('data-tab');
            
            // Ocultar todas las categorías
            menuCategories.forEach(category => {
                category.classList.remove('active');
            });
            
            // Mostrar la categoría objetivo
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Scroll suave hacia el menú si es necesario
                const menuSection = document.getElementById('menu');
                if (menuSection) {
                    const menuRect = menuSection.getBoundingClientRect();
                    if (menuRect.top < 0) {
                        const headerHeight = header.offsetHeight;
                        window.scrollTo({
                            top: menuSection.offsetTop - headerHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    
    // ========================================
    // INTERSECTION OBSERVER - Animaciones on-scroll
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Opcional: dejar de observar después de animar
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con clase fade-in-up
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // ========================================
    // WHATSAPP FLOAT - Aparición con delay
    // ========================================
    const whatsappFloat = document.getElementById('whatsapp-float');
    
    if (whatsappFloat) {
        // Mostrar después de 2 segundos
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.transform = 'translateY(20px)';
        whatsappFloat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.transform = 'translateY(0)';
        }, 2000);
    }
    
    // ========================================
    // FORMULARIO - Envío a WhatsApp
    // ========================================
    const reservationForm = document.getElementById('reservation-form');
    const whatsappNumber = '5491127835437';
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value.trim();
            
            // Validar campos requeridos
            if (!name || !phone || !date || !time || !guests) {
                showNotification('Por favor, completá todos los campos requeridos.', 'error');
                return;
            }
            
            // Formatear fecha
            const dateObj = new Date(date + 'T12:00:00');
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('es-AR', options);
            
            // Construir mensaje
            let whatsappMessage = `Hola Bodegón Ballarati, me gustaría hacer una reserva:\n\n`;
            whatsappMessage += `👤 Nombre: ${name}\n`;
            whatsappMessage += `📱 Teléfono: ${phone}\n`;
            whatsappMessage += `📅 Fecha: ${formattedDate}\n`;
            whatsappMessage += `🕐 Hora: ${time}\n`;
            whatsappMessage += `👥 Personas: ${guests}\n`;
            
            if (message) {
                whatsappMessage += `\n💬 Mensaje: ${message}`;
            }
            
            whatsappMessage += `\n\n¡Gracias!`;
            
            // Codificar el mensaje para la URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Construir link de WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Abrir WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Mostrar confirmación
            showNotification('Abriendo WhatsApp para enviar tu reserva...', 'success');
            
            // Reset form
            reservationForm.reset();
        });
    }
    
    // ========================================
    // NOTIFICACIONES - Feedback visual
    // ========================================
    function showNotification(message, type = 'info') {
        // Eliminar notificación existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
                <span class="notification__text">${message}</span>
            </div>
        `;
        
        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
            font-family: var(--font-body, 'Source Sans 3', sans-serif);
            max-width: 90vw;
        `;
        
        // Agregar estilos de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            @keyframes slideDown {
                from {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }
            }
            .notification__content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification__icon {
                font-size: 18px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Eliminar después de 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    // ========================================
    // GALLERY - Hover effect enhancement
    // ========================================
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    // ========================================
    // MENU ITEMS - Hover sound effect (optional)
    // ========================================
    // Si quisieras agregar un sutil efecto de sonido al hover de los items del menú
    // const menuItems = document.querySelectorAll('.menu__item');
    // menuItems.forEach(item => {
    //     item.addEventListener('mouseenter', () => {
    //         // Lógica de sonido aquí
    //     });
    // });
    
    // ========================================
    // PARALLAX EFFECT - Hero background (sutil)
    // ========================================
    const heroBg = document.querySelector('.hero__bg');
    
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(1.1) translateY(${rate}px)`;
            }
        }, { passive: true });
    }
    
    // ========================================
    // COUNTER ANIMATION - Rating number
    // ========================================
    const ratingNumber = document.querySelector('.reviews__rating-number');
    
    if (ratingNumber) {
        const targetValue = parseFloat(ratingNumber.textContent);
        let currentValue = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        function animateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            currentValue = targetValue * easeOutQuart;
            ratingNumber.textContent = currentValue.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            } else {
                ratingNumber.textContent = targetValue.toFixed(1);
            }
        }
        
        // Observar cuando el elemento sea visible
        const ratingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(animateCounter);
                    ratingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        ratingObserver.observe(ratingNumber);
    }
    
    // ========================================
    // PROCESS STEPS - Sequential animation
    // ========================================
    const processSteps = document.querySelectorAll('.process__step');
    
    if (processSteps.length > 0) {
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.3 });
        
        processSteps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            processObserver.observe(step);
        });
    }
    
    // ========================================
    // MOMENTS - Staggered animation
    // ========================================
    const moments = document.querySelectorAll('.moment');
    
    if (moments.length > 0) {
        const momentsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.2 });
        
        moments.forEach(moment => {
            moment.style.opacity = '0';
            moment.style.transform = 'translateY(40px)';
            moment.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
            momentsObserver.observe(moment);
        });
    }
    
    // ========================================
    // TEAM MEMBERS - Hover interaction
    // ========================================
    const teamMembers = document.querySelectorAll('.team__member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.team__avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
                avatar.style.transition = 'transform 0.3s ease';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.team__avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // ========================================
    // PRELOADER - Opcional
    // ========================================
    // Si quisieras agregar un preloader
    // window.addEventListener('load', () => {
    //     const preloader = document.getElementById('preloader');
    //     if (preloader) {
    //         preloader.style.opacity = '0';
    //         setTimeout(() => {
    //             preloader.style.display = 'none';
    //         }, 500);
    //     }
    // });
    
    console.log('🍕 Bodegón Ballarati - Landing Page cargada correctamente');
    
});