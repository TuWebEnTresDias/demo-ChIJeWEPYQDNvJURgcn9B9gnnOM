// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Menu tabs functionality
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCategories = document.querySelectorAll('.menu-category');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and categories
        menuTabs.forEach(t => t.classList.remove('active'));
        menuCategories.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding category
        tab.classList.add('active');
        const categoryId = tab.getAttribute('data-tab');
        document.getElementById(categoryId).classList.add('active');
    });
});

// Show more functionality for menu items
const showMoreBtns = document.querySelectorAll('.show-more-btn');

showMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-target');
        const categoryElement = document.getElementById(category);
        const hiddenItems = categoryElement.querySelectorAll('.menu-item.hidden');
        
        hiddenItems.forEach(item => {
            item.classList.remove('hidden');
        });
        
        btn.style.display = 'none';
    });
});

// Form submission to WhatsApp
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(reservationForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const date = formData.get('date');
        const time = formData.get('time');
        const guests = formData.get('guests');
        const occasion = formData.get('occasion');
        
        // Format date for display
        const formattedDate = new Date(date).toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create WhatsApp message
        let message = `Hola Bodegón Ballarati, quiero hacer una reserva:\n\n`;
        message += `👤 Nombre: ${name}\n`;
        message += `📅 Fecha: ${formattedDate}\n`;
        message += `🕐 Hora: ${time}\n`;
        message += `👥 Personas: ${guests}\n`;
        
        if (occasion) {
            message += `🎉 Ocasión: ${occasion}\n`;
        }
        
        message += `\n📞 Mi teléfono: ${phone}`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp
        window.open(`https://wa.me/5491127835437?text=${encodedMessage}`, '_blank');
        
        // Reset form
        reservationForm.reset();
        
        // Show confirmation (optional)
        alert('Redirigiendo a WhatsApp para confirmar tu reserva...');
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to elements that should animate
const animateElements = [
    '.differential-item',
    '.menu-item',
    '.process-step',
    '.gallery-item',
    '.testimonial-item',
    '.moment-card',
    '.team-member'
];

animateElements.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// WhatsApp button pulse animation on scroll
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            whatsappFloat.style.animation = 'pulse 2s infinite';
        } else {
            whatsappFloat.style.animation = 'none';
        }
    });
}

// Lazy loading for images with fallback
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add subtle parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const heroImage = hero.querySelector('.hero-image img');
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
        }
    }
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Add current year to copyright
const currentYear = new Date().getFullYear();
const copyrightText = document.querySelector('.footer-bottom p');
if (copyrightText) {
    copyrightText.innerHTML = copyrightText.innerHTML.replace('2025', currentYear);
}

// Preload critical images
window.addEventListener('load', () => {
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) {
        heroImg.style.transform = 'scale(1)';
    }
});